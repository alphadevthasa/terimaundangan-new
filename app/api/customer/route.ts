import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const email = searchParams.get('email');

    let customer;

    if (id) {
      customer = await prisma.customer.findUnique({
        where: { id },
        include: { templateData: { include: { template: { select: { name: true } } } } },
      });
      if (!customer) {
        return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
      }
    } else if (email) {
      customer = await prisma.customer.findFirst({
        where: { email },
        include: { templateData: { include: { template: { select: { name: true } } } } },
      });
      if (!customer) {
        return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
      }
    } else {
      customer = await prisma.customer.findFirst({
        where: { status: 'active' },
        include: { templateData: { include: { template: { select: { name: true } } } } },
      });
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

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, email, status } = body;

    if (!id) {
      return NextResponse.json({ error: 'Customer ID required' }, { status: 400 });
    }

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(status !== undefined && { status }),
      },
    });

    return NextResponse.json({ customer });
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
  }
}
