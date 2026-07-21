import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/customer - Fetch a customer by id or templateId
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const templateId = searchParams.get('templateId');

    let customer;

    if (id) {
      customer = await prisma.customer.findUnique({ where: { id } });
      if (!customer) {
        return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
      }
    } else if (templateId) {
      customer = await prisma.customer.findFirst({ where: { templateId } });
      if (!customer) {
        // Create a new customer record for this template
        customer = await prisma.customer.create({ data: { templateId } });
      }
    } else {
      customer = await prisma.customer.findFirst({ where: { status: 'active' } });
      if (!customer) {
        customer = await prisma.customer.create({ data: {} });
      }
    }

    return NextResponse.json({ customer });
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json({ error: 'Failed to fetch customer' }, { status: 500 });
  }
}

// PUT /api/customer - Update a customer, optionally by templateId
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const templateId = body.templateId;
    delete body.templateId; // Remove templateId from update data

    let customer;

    if (templateId) {
      customer = await prisma.customer.findFirst({ where: { templateId } });
      if (!customer) {
        customer = await prisma.customer.create({ data: { ...body, templateId } });
      } else {
        customer = await prisma.customer.update({
          where: { id: customer.id },
          data: body,
        });
      }
    } else {
      customer = await prisma.customer.findFirst({ where: { status: 'active' } });
      if (!customer) {
        customer = await prisma.customer.create({ data: body });
      } else {
        customer = await prisma.customer.update({
          where: { id: customer.id },
          data: body,
        });
      }
    }

    return NextResponse.json({ customer });
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
  }
}
