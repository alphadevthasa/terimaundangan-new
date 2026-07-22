import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { requireAdmin } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { response } = await requireAdmin(request);
  if (response) return response;
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: params.id },
      include: {
        templateData: {
          include: { template: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    return NextResponse.json({ customer });
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json({ error: 'Failed to fetch customer' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { response } = await requireAdmin(request);
  if (response) return response;
  try {
    const body = await request.json();
    const { name, email, newPassword } = body;

    const customer = await prisma.customer.findUnique({ where: { id: params.id } });
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const updateData: Record<string, any> = {};

    if (name !== undefined) {
      if (!name.trim()) {
        return NextResponse.json({ error: 'Nama tidak boleh kosong' }, { status: 400 });
      }
      updateData.name = name.trim();
    }

    if (email !== undefined && email !== customer.email) {
      if (!email.trim()) {
        return NextResponse.json({ error: 'Email tidak boleh kosong' }, { status: 400 });
      }
      const emailExists = await prisma.customer.findFirst({
        where: { email: email.trim(), id: { not: customer.id } },
      });
      if (emailExists) {
        return NextResponse.json({ error: 'Email sudah digunakan oleh user lain' }, { status: 409 });
      }
      updateData.email = email.trim();
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json({ error: 'Password minimal 6 karakter' }, { status: 400 });
      }
      const salt = await bcrypt.genSalt(12);
      updateData.password = await bcrypt.hash(newPassword, salt);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'Tidak ada data yang diubah' }, { status: 400 });
    }

    const updated = await prisma.customer.update({
      where: { id: customer.id },
      data: updateData,
    });

    const { password: _, ...customerSafe } = updated;

    return NextResponse.json({
      success: true,
      customer: customerSafe,
      message: 'User berhasil diperbarui',
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tds = await prisma.templateData.findMany({
      where: { customerId: params.id },
      select: { id: true },
    });
    const tdIds = tds.map(t => t.id);
    if (tdIds.length > 0) {
      await prisma.wish.deleteMany({ where: { templateDataId: { in: tdIds } } });
    }
    await prisma.templateData.deleteMany({ where: { customerId: params.id } });
    await prisma.customer.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 });
  }
}
