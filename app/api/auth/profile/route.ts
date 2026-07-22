import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { requireCustomer } from '@/lib/auth';

// PUT /api/auth/profile - Update the authenticated user's own profile.
//
// SECURITY: The account is identified by the signed session (session.sub),
// NEVER by an `email` field in the request body. The previous version looked up
// the customer purely by body.email, which let anyone take over any account by
// simply knowing its email address.
export async function PUT(request: NextRequest) {
  try {
    const { session, response: authResponse } = await requireCustomer(request);
    if (authResponse) return authResponse;

    const body = await request.json();
    const { name, newEmail, currentPassword, newPassword } = body;

    // Load the account by session id — the only trusted identity source.
    const customer = await prisma.customer.findUnique({
      where: { id: session!.sub },
    });
    if (!customer) {
      return NextResponse.json({ error: 'Akun tidak ditemukan' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};

    // Update name
    if (name !== undefined) {
      if (!String(name).trim()) {
        return NextResponse.json(
          { error: 'Nama tidak boleh kosong' },
          { status: 400 }
        );
      }
      updateData.name = String(name).trim();
    }

    // Update email (if changed) — scoped to the logged-in account.
    if (newEmail !== undefined && newEmail !== customer.email) {
      if (!String(newEmail).trim()) {
        return NextResponse.json(
          { error: 'Email tidak boleh kosong' },
          { status: 400 }
        );
      }

      // Check if new email is already taken by another account.
      const emailExists = await prisma.customer.findFirst({
        where: { email: String(newEmail).trim(), id: { not: customer.id } },
      });

      if (emailExists) {
        return NextResponse.json(
          { error: 'Email sudah digunakan oleh akun lain' },
          { status: 409 }
        );
      }

      updateData.email = String(newEmail).trim();
    }

    // Update password
    if (currentPassword || newPassword) {
      // If customer has no password set (old account), allow setting one
      // without requiring the current password.
      if (customer.password) {
        if (!currentPassword) {
          return NextResponse.json(
            { error: 'Password saat ini wajib diisi untuk mengganti password' },
            { status: 400 }
          );
        }

        const passwordValid = await bcrypt.compare(
          currentPassword,
          customer.password
        );
        if (!passwordValid) {
          return NextResponse.json(
            { error: 'Password saat ini salah' },
            { status: 401 }
          );
        }
      }

      if (!newPassword) {
        return NextResponse.json(
          { error: 'Password baru wajib diisi' },
          { status: 400 }
        );
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: 'Password baru minimal 6 karakter' },
          { status: 400 }
        );
      }

      const salt = await bcrypt.genSalt(12);
      updateData.password = await bcrypt.hash(newPassword, salt);
    }

    // If nothing to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'Tidak ada data yang diubah' },
        { status: 400 }
      );
    }

    const updated = await prisma.customer.update({
      where: { id: customer.id },
      data: updateData,
    });

    // Return customer data without password
    const { password: _, ...customerSafe } = updated;

    return NextResponse.json({
      success: true,
      customer: customerSafe,
      message: 'Profil berhasil diperbarui',
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
