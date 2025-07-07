export class SalesModel {
    // Get sales summary
    static async getSummary(startDate: Date, endDate: Date) {
      const query = `
        SELECT 
          COUNT(*) as total_orders,
          SUM(total_amount) as total_revenue,
          AVG(total_amount) as avg_order_value,
          COUNT(DISTINCT user_id) as unique_customers
        FROM orders
        WHERE created_at BETWEEN $1 AND $2
        AND status NOT IN ('cancelled', 'refunded')
      `;
      
      const result = await db.query(query, [startDate, endDate]);
      return result.rows[0];
    }
  
    // Get daily sales
    static async getDailySales(startDate: Date, endDate: Date) {
      const query = `
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as order_count,
          SUM(total_amount) as daily_revenue
        FROM orders
        WHERE created_at BETWEEN $1 AND $2
        AND status NOT IN ('cancelled', 'refunded')
        GROUP BY DATE(created_at)
        ORDER BY date DESC
      `;
      
      const result = await db.query(query, [startDate, endDate]);
      return result.rows;
    }
  
    // Get top selling products
    static async getTopProducts(limit: number = 10) {
      const query = `
        SELECT 
          p.name as product_name,
          p.sku,
          SUM(oi.quantity) as total_sold,
          SUM(oi.total_price) as total_revenue
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        JOIN orders o ON oi.order_id = o.id
        WHERE o.status NOT IN ('cancelled', 'refunded')
        GROUP BY p.id, p.name, p.sku
        ORDER BY total_sold DESC
        LIMIT $1
      `;
      
      const result = await db.query(query, [limit]);
      return result.rows;
    }
  
    // Get monthly growth
    static async getMonthlyGrowth() {
      const query = `
        WITH monthly_sales AS (
          SELECT 
            DATE_TRUNC('month', created_at) as month,
            SUM(total_amount) as revenue
          FROM orders
          WHERE status NOT IN ('cancelled', 'refunded')
          AND created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '12 months')
          GROUP BY DATE_TRUNC('month', created_at)
        )
        SELECT 
          month,
          revenue,
          LAG(revenue) OVER (ORDER BY month) as previous_month_revenue,
          CASE 
            WHEN LAG(revenue) OVER (ORDER BY month) > 0 THEN
              ((revenue - LAG(revenue) OVER (ORDER BY month)) / LAG(revenue) OVER (ORDER BY month)) * 100
            ELSE 0
          END as growth_percentage
        FROM monthly_sales
        ORDER BY month DESC
      `;
      
      const result = await db.query(query);
      return result.rows;
    }
  }