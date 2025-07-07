export class InventoryModel {
    // Get all inventory with product details
    static async getAll() {
      const query = `
        SELECT i.*, p.name as product_name, p.sku as product_sku,
               pv.name as variant_name, pv.sku as variant_sku
        FROM inventory i
        LEFT JOIN products p ON i.product_id = p.id
        LEFT JOIN product_variants pv ON i.variant_id = pv.id
        WHERE p.is_active = true
        ORDER BY i.quantity ASC
      `;
      
      const result = await db.query(query);
      return result.rows;
    }
  
    // Update inventory quantity
    static async updateQuantity(productId: number, variantId: number | null, quantity: number) {
      const query = `
        UPDATE inventory 
        SET quantity = $1, 
            last_restocked_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE product_id = $2 AND ($3 IS NULL OR variant_id = $3)
        RETURNING *
      `;
      
      const result = await db.query(query, [quantity, productId, variantId]);
      return result.rows[0];
    }
  
    // Get low stock items
    static async getLowStock() {
      const query = `
        SELECT i.*, p.name as product_name, p.sku as product_sku,
               pv.name as variant_name, pv.sku as variant_sku
        FROM inventory i
        LEFT JOIN products p ON i.product_id = p.id
        LEFT JOIN product_variants pv ON i.variant_id = pv.id
        WHERE p.is_active = true 
        AND i.quantity <= i.low_stock_threshold
        ORDER BY i.quantity ASC
      `;
      
      const result = await db.query(query);
      return result.rows;
    }
  }