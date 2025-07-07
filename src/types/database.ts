  export interface User {
    id: number;
    email: string;
    password_hash: string;
    first_name: string;
    last_name: string;
    phone?: string;
    role: 'customer' | 'admin' | 'employee';
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
  }
  
  export interface Category {
    id: number;
    name: string;
    description?: string;
    image_url?: string;
    parent_id?: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
  }
  
  export interface Product {
    id: number;
    name: string;
    description?: string;
    category_id: number;
    brand?: string;
    price: number;
    cost_price?: number;
    sku: string;
    weight?: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
    material?: string;
    care_instructions?: string;
    origin?: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
  }
  
  export interface ProductVariant {
    id: number;
    product_id: number;
    name: string;
    sku: string;
    price?: number;
    attributes?: {
      color?: string;
      size?: string;
      [key: string]: any;
    };
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
  }
  
  export interface Inventory {
    id: number;
    product_id: number;
    variant_id?: number;
    quantity: number;
    reserved_quantity: number;
    low_stock_threshold: number;
    location?: string;
    last_restocked_at?: Date;
    created_at: Date;
    updated_at: Date;
  }
  
  export interface Order {
    id: number;
    user_id: number;
    order_number: string;
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
    total_amount: number;
    tax_amount: number;
    shipping_amount: number;
    discount_amount: number;
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
    payment_method?: string;
    payment_reference?: string;
    shipping_address?: Address;
    billing_address?: Address;
    notes?: string;
    created_at: Date;
    updated_at: Date;
  }
  
  export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    variant_id?: number;
    quantity: number;
    unit_price: number;
    total_price: number;
    created_at: Date;
  }
  
  export interface Address {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  }
  
  export interface Employee {
    id: number;
    user_id: number;
    employee_id: string;
    department?: string;
    position?: string;
    hire_date?: Date;
    salary?: number;
    manager_id?: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
  }
  
  export interface TimeEntry {
    id: number;
    employee_id: number;
    clock_in_time: Date;
    clock_out_time?: Date;
    break_duration: number;
    total_hours?: number;
    notes?: string;
    created_at: Date;
  }
  