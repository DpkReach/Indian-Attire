export class OrderModel {
    // Get all orders with pagination
    static async getAll(page: number = 1, limit: number = 10) {
      const offset = (page - 1) * limit;
      const query = `
        SELECT o.*, u.first_name, u.last_name, u.email,
               COUNT(*) OVER() as total_count
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
        LIMIT $1 OFFSET $2
      `;
      
      const result = await db.query(query, [limit, offset]);
      return {
        orders: result.rows,
        total: result.rows[0]?.total_count || 0,
        page,
        limit,
        totalPages: Math.ceil((result.rows[0]?.total_count || 0) / limit)
      };
    }
  
    // Get order by ID with items
    static async getById(id: number) {
      const orderQuery = `
        SELECT o.*, u.first_name, u.last_name, u.email
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        WHERE o.id = $1
      `;
      
      const itemsQuery = `
        SELECT oi.*, p.name as product_name, pv.name as variant_name
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        LEFT JOIN product_variants pv ON oi.variant_id = pv.id
        WHERE oi.order_id = $1
      `;
  
      const [orderResult, itemsResult] = await Promise.all([
        db.query(orderQuery, [id]),
        db.query(itemsQuery, [id])
      ]);
  
      if (orderResult.rows.length === 0) {
        return null;
      }
  
      return {
        ...orderResult.rows[0],
        items: itemsResult.rows
      };
    }
  
    // Create new order
    static async create(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>, items: Omit<OrderItem, 'id' | 'order_id' | 'created_at'>[]) {
      return await db.transaction(async (client) => {
        // Create order
        const orderQuery = `
          INSERT INTO orders (user_id, order_number, status, total_amount, tax_amount, shipping_amount, discount_amount, payment_status, payment_method, payment_reference, shipping_address, billing_address, notes)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          RETURNING *
        `;
        
        const orderValues = [
          order.user_id,
          order.order_number,
          order.status,
          order.total_amount,
          order.tax_amount,
          order.shipping_amount,
          order.discount_amount,
          order.payment_status,
          order.payment_method,
          order.payment_reference,
          JSON.stringify(order.shipping_address),
          JSON.stringify(order.billing_address),
          order.notes
        ];
  
        const orderResult = await client.query(orderQuery, orderValues);
        const newOrder = orderResult.rows[0];
  
        // Create order items
        for (const item of items) {
          const itemQuery = `
            INSERT INTO order_items (order_id, product_id, variant_id, quantity, unit_price, total_price)
            VALUES ($1, $2, $3, $4, $5, $6)
          `;
          
          await client.query(itemQuery, [
            newOrder.id,
            item.product_id,
            item.variant_id,
            item.quantity,
            item.unit_price,
            item.total_price
          ]);
  
          // Update inventory
          const inventoryQuery = `
            UPDATE inventory 
            SET reserved_quantity = reserved_quantity + $1
            WHERE product_id = $2 AND ($3 IS NULL OR variant_id = $3)
          `;
          
          await client.query(inventoryQuery, [
            item.quantity,
            item.product_id,
            item.variant_id
          ]);
        }
  
        return newOrder;
      });
    }
  
    // Update order status
    static async updateStatus(id: number, status: Order['status']) {
      const query = `
        UPDATE orders 
        SET status = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
      `;
      
      const result = await db.query(query, [status, id]);
      return result.rows[0];
    }
  
    // Get sales analytics
    static async getSalesAnalytics(startDate: Date, endDate: Date) {
      const query = `
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as order_count,
          SUM(total_amount) as total_sales,
          AVG(total_amount) as avg_order_value
        FROM orders
        WHERE created_at BETWEEN $1 AND $2
        AND status NOT IN ('cancelled', 'refunded')
        GROUP BY DATE(created_at)
        ORDER BY date DESC
      `;
      
      const result = await db.query(query, [startDate, endDate]);
      return result.rows;
    }
  }