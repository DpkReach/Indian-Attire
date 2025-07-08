import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // This API route is not currently used by the application,
    // which uses localStorage for data persistence.
    // Returning an empty list to ensure the build passes.
    return NextResponse.json({
      products: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    });
  } catch (error) {
    console.error('Error in placeholder products GET:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // This API route is not currently used by the application.
    return NextResponse.json(
      { message: 'Endpoint not implemented.' },
      { status: 501 }
    );
  } catch (error) {
    console.error('Error in placeholder products POST:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
