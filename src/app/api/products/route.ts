import { NextRequest, NextResponse } from 'next/server';
import { ProductModel } from '@/lib/models/ProductModel';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  category_id: z.number().int().positive(),
  brand: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  cost_price: z.number().positive().optional(),
  sku: z.string().min(1, 'SKU is required'),
  weight: z.number().positive().optional(),
  dimensions: z.object({
    length: z.number().positive(),
    width: z.number().positive(),
    height: z.number().positive()
  }).optional(),
  material: z.string().optional(),
  care_instructions: z.string().optional(),
  origin: z.string().optional()
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');

    let result;
    if (search) {
      result = await ProductModel.search(search, page, limit);
    } else {
      result = await ProductModel.getAll(page, limit);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = productSchema.parse(body);

    const product = await ProductModel.create(validatedData);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}