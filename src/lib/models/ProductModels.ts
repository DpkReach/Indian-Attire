import db from '../database';
import { Product, ProductVariant, Inventory } from '../../types/database';

export class ProductModel {
  // Get all products with pagination
  static async getAll(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;
    const query = `
      SELECT p.*, c.name as category_name, 
             COUNT(*) OVER() as total_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true
      ORDER BY p.created_at DESC
      LIMIT $1 OFFSET $2
    `;
    
    const result = await db.query(query, [limit, offset]);
    return {
      products: result.rows,
      total: result.rows[0]?.total_count || 0,
      page,
      limit,
      totalPages: Math.ceil((result.rows[0]?.total_count || 0) / limit)
    };
  }

  // Get product by ID with variants and inventory
  static async getById(id: number) {
    const productQuery = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1 AND p.is_active = true
    `;
    
    const variantsQuery = `
      SELECT pv.*, i.quantity, i.reserved_quantity, i.low_stock_threshold
      FROM product_variants pv
      LEFT JOIN inventory i ON pv.id = i.variant_id
      WHERE pv.product_id = $1 AND pv.is_active = true
    `;
    
    const imagesQuery = `
      SELECT * FROM product_images 
      WHERE product_id = $1 
      ORDER BY is_primary DESC, sort_order ASC
    `;

    const [productResult, variantsResult, imagesResult] = await Promise.all([
      db.query(productQuery, [id]),
      db.query(variantsQuery, [id]),
      db.query(imagesQuery, [id])
    ]);

    if (productResult.rows.length === 0) {
      return null;
    }

    return {
      ...productResult.rows[0],
      variants: variantsResult.rows,
      images: imagesResult.rows
    };
  }

  // Create new product
  static async create(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
    const query = `
      INSERT INTO products (name, description, category_id, brand, price, cost_price, sku, weight, dimensions, material, care_instructions, origin)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;
    
    const values = [
      product.name,
      product.description,
      product.category_id,
      product.brand,
      product.price,
      product.cost_price,
      product.sku,
      product.weight,
      JSON.stringify(product.dimensions),
      product.material,
      product.care_instructions,
      product.origin
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  }

  // Update product
  static async update(id: number, product: Partial<Product>) {
    const setClause = Object.keys(product)
      .filter(key => key !== 'id' && key !== 'created_at' && key !== 'updated_at')
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');

    const query = `
      UPDATE products 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;

    const values = [id, ...Object.values(product).filter((_, index) => 
      Object.keys(product)[index] !== 'id' && 
      Object.keys(product)[index] !== 'created_at' && 
      Object.keys(product)[index] !== 'updated_at'
    )];

    const result = await db.query(query, values);
    return result.rows[0];
  }

  // Delete product (soft delete)
  static async delete(id: number) {
    const query = `
      UPDATE products 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  // Get low stock products
  static async getLowStock() {
    const query = `
      SELECT p.*, i.quantity, i.low_stock_threshold
      FROM products p
      JOIN inventory i ON p.id = i.product_id
      WHERE p.is_active = true 
      AND i.quantity <= i.low_stock_threshold
      ORDER BY i.quantity ASC
    `;
    
    const result = await db.query(query);
    return result.rows;
  }

  // Search products
  static async search(searchTerm: string, page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;
    const query = `
      SELECT p.*, c.name as category_name,
             COUNT(*) OVER() as total_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true 
      AND (
        p.name ILIKE $1 OR 
        p.description ILIKE $1 OR 
        p.brand ILIKE $1 OR
        c.name ILIKE $1
      )
      ORDER BY p.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    const searchPattern = `%${searchTerm}%`;
    const result = await db.query(query, [searchPattern, limit, offset]);
    
    return {
      products: result.rows,
      total: result.rows[0]?.total_count || 0,
      page,
      limit,
      totalPages: Math.ceil((result.rows[0]?.total_count || 0) / limit)
    };
  }
}