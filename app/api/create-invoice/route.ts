import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/create-invoice - Create a Xendit payment invoice for template purchase
export async function POST(request: NextRequest) {
  try {
    const { templateId, templateName, templatePrice, customerEmail, customerName } = await request.json();

    if (!templateId || !templateName) {
      return NextResponse.json({ error: 'templateId and templateName are required' }, { status: 400 });
    }

    // Determine price in IDR (minimum 1000 for Xendit)
    const amount = parseInt(templatePrice) || 0;
    const isFree = amount === 0;

    // If free, skip Xendit and return success immediately
    if (isFree) {
      // Create order record for free template
      await prisma.order.create({
        data: {
          templateId,
          templateName,
          customerName: customerName || '',
          customerEmail: customerEmail || '',
          amount: 0,
          status: 'paid',
          paidAt: new Date(),
        },
      });
      return NextResponse.json({
        success: true,
        isFree: true,
        invoiceUrl: `/dashboard/kelola-template?id=${templateId}`,
        message: 'Template is free! Redirecting to dashboard...',
      });
    }

    // Xendit API configuration
    const apiKey = process.env.XENDIT_API_KEY;
    const isProduction = process.env.XENDIT_PRODUCTION === 'true';
    const baseUrl = isProduction
      ? 'https://api.xendit.co'
      : 'https://api.xendit.co'; // Same endpoint for both

    if (!apiKey) {
      return NextResponse.json({ error: 'Xendit API key not configured' }, { status: 500 });
    }

    const externalId = `template-${templateId}-${Date.now()}`;

    // Create invoice via Xendit API
    const xenditResponse = await fetch(`${baseUrl}/v2/invoices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(apiKey + ':').toString('base64')}`,
      },
      body: JSON.stringify({
        external_id: externalId,
        amount,
        payer_email: customerEmail || '',
        description: `Pembelian template undangan: ${templateName}`,
        customer: {
          given_names: customerName || 'Customer',
          email: customerEmail || '',
        },
        customer_notification_preference: {
          invoice_created: ['email', 'whatsapp'],
          invoice_reminder: ['email', 'whatsapp'],
          invoice_paid: ['email', 'whatsapp'],
        },
        success_redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/success?templateId=${templateId}`,
        failure_redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/detail/${templateId}?status=failed`,
        currency: 'IDR',
      }),
    });

    if (!xenditResponse.ok) {
      const errorData = await xenditResponse.json().catch(() => ({}));
      console.error('Xendit API error:', errorData);
      return NextResponse.json({
        error: 'Failed to create invoice',
        details: errorData,
      }, { status: 502 });
    }

    const invoice = await xenditResponse.json();

    // Create pending order record
    await prisma.order.create({
      data: {
        templateId,
        templateName,
        customerName: customerName || '',
        customerEmail: customerEmail || '',
        amount,
        status: 'pending',
        invoiceUrl: invoice.invoice_url || '',
        paymentMethod: '',
      },
    });

    return NextResponse.json({
      success: true,
      isFree: false,
      invoiceUrl: invoice.invoice_url,
      invoiceId: invoice.id,
      externalId: invoice.external_id,
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }
}
