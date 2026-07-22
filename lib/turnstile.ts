export function isDevelopmentBypass(request?: Request): boolean {
  if (process.env.NODE_ENV !== 'development') return false;
  const host = request?.headers.get('host') || '';
  return host.startsWith('localhost') || host.startsWith('127.0.0.1');
}

export async function verifyTurnstile(token: string, remoteIp?: string, request?: Request): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    console.warn('[turnstile] TURNSTILE_SECRET_KEY not configured, skipping verification');
    return true;
  }

  if (isDevelopmentBypass(request)) {
    console.warn('[turnstile] Development bypass active for localhost — skipping verification');
    return true;
  }

  if (!token) {
    return false;
  }

  try {
    const formData = new FormData();
    formData.append('secret', secretKey);
    formData.append('response', token);
    if (remoteIp) {
      formData.append('remoteip', remoteIp);
    }

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json() as { success: boolean; challenge_ts?: string; hostname?: string; error_codes?: string[] };
    
    console.log('[turnstile] verification result:', { success: result.success, hostname: result.hostname, errors: result.error_codes });

    return result.success === true;
  } catch (error) {
    console.error('[turnstile] verification error:', error);
    return false;
  }
}

export function getClientIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  const xri = request.headers.get('x-real-ip');
  if (xri) return xri;
  return 'unknown';
}
