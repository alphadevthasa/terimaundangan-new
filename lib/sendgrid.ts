import sgMail from '@sendgrid/mail';

const apiKey = process.env.SENDGRID_API_KEY;
if (apiKey) {
  sgMail.setApiKey(apiKey);
} else if (process.env.NODE_ENV !== 'production') {
  console.warn('[sendgrid] SENDGRID_API_KEY not set — emails will be logged to console only');
}

export default sgMail;
