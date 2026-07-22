import sgMail from './sendgrid';

const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@terimaundangan.com';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function sendPasswordResetEmail(to: string, token: string, customerName: string) {
  const resetUrl = `${BASE_URL}/reset-password?token=${token}`;

  const msg = {
    to,
    from: FROM_EMAIL,
    subject: 'Reset Password - Terima Undangan',
    text: `Halo ${customerName},\n\nAnda menerima email ini karena ada permintaan reset password untuk akun Terima Undangan Anda.\n\nSilakan klik link berikut untuk mereset password Anda:\n${resetUrl}\n\nLink ini berlaku selama 1 jam.\n\nJika Anda tidak meminta reset password, abaikan email ini.\n\nTerima Kasih,\nTim Terima Undangan`,
    html: `
      <div style="font-family: 'Jost', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 2rem; background: #0a0807; color: #f5ecd9; border-radius: 8px; border: 1px solid rgba(201,169,97,0.15);">
        <div style="text-align: center; margin-bottom: 1.5rem;">
          <div style="width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #c9a961, #8a6d2b); display: flex; align-items: center; justify-content: center; margin: 0 auto 0.75rem;">
            <span style="color: #0a0807; font-weight: 600; font-size: 1.2rem;">E</span>
          </div>
          <h1 style="font-family: 'Italiana', serif; font-size: 1.3rem; color: #c9a961; margin: 0;">Terima Undangan</h1>
        </div>

        <p style="font-size: 0.9rem; line-height: 1.6; margin-bottom: 1rem;">Halo <strong style="color: #c9a961;">${customerName}</strong>,</p>
        <p style="font-size: 0.9rem; line-height: 1.6; margin-bottom: 1rem;">Anda menerima email ini karena ada permintaan reset password untuk akun Terima Undangan Anda.</p>

        <div style="text-align: center; margin: 2rem 0;">
          <a href="${resetUrl}" style="display: inline-block; padding: 0.85rem 2rem; background: linear-gradient(135deg, #c9a961, #b8942e); color: #0a0807; text-decoration: none; border-radius: 4px; font-size: 0.9rem; font-weight: 500;">
            Reset Password
          </a>
        </div>

        <p style="font-size: 0.8rem; color: rgba(245,236,217,0.5); line-height: 1.5;">Link ini berlaku selama <strong style="color: #c9a961;">1 jam</strong>.</p>
        <p style="font-size: 0.8rem; color: rgba(245,236,217,0.4); line-height: 1.5;">Jika Anda tidak meminta reset password, abaikan email ini.</p>

        <hr style="border: none; border-top: 1px solid rgba(201,169,97,0.1); margin: 2rem 0 1rem;" />
        <p style="font-size: 0.75rem; color: rgba(245,236,217,0.3); text-align: center;">Terima Kasih<br/>Tim Terima Undangan</p>
      </div>
    `,
  };

  console.log('[sendgrid] ===== PASSWORD RESET EMAIL =====');
  console.log('[sendgrid] To:', to);
  console.log('[sendgrid] Reset URL:', resetUrl);
  console.log('[sendgrid] Token:', token);
  console.log('[sendgrid] =================================');

  if (process.env.SENDGRID_API_KEY) {
    try {
      await sgMail.send(msg);
      console.log('[sendgrid] Email sent successfully to:', to);
    } catch (error) {
      console.error('[sendgrid] Failed to send email via API (token still valid in DB):', error instanceof Error ? error.message : error);
    }
  }
}
