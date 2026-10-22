/**
 * @file Email Dispatch Service for Tracked Flight Price Alerts
 * Supports custom SMTP (Gmail, Outlook, SendGrid, Amazon SES),
 * and automatic Ethereal email sandbox preview for instant testing.
 */

import nodemailer from 'nodemailer';
import { AIRPORT_BY_CODE } from '../src/data/airports.js';
import { getBookingUrl } from '../src/lib/bookingUrls.js';

let cachedTransporter = null;
let cachedAccountInfo = null;

/**
 * Initializes or retrieves the active email transporter.
 */
async function getTransporter(env = process.env) {
  if (cachedTransporter) return cachedTransporter;

  const smtpHost = env.SMTP_HOST?.trim();
  const smtpUser = env.SMTP_USER?.trim();
  const smtpPass = env.SMTP_PASS?.trim();
  const gmailUser = env.GMAIL_USER?.trim();
  const gmailPass = env.GMAIL_APP_PASSWORD?.trim();

  // 1. Custom SMTP Configured
  if (smtpHost && smtpUser && smtpPass) {
    const port = Number(env.SMTP_PORT) || 587;
    cachedTransporter = nodemailer.createTransport({
      host: smtpHost,
      port,
      secure: port === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });
    cachedAccountInfo = { type: 'custom_smtp', host: smtpHost, user: smtpUser };
    return cachedTransporter;
  }

  // 2. Gmail App Password Configured
  if (gmailUser && gmailPass) {
    cachedTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: gmailUser, pass: gmailPass },
    });
    cachedAccountInfo = { type: 'gmail', user: gmailUser };
    return cachedTransporter;
  }

  // 3. Automated Test Transporter (Ethereal) for Instant In-Browser Preview
  try {
    const testAccount = await nodemailer.createTestAccount();
    cachedTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
    cachedAccountInfo = { type: 'ethereal', user: testAccount.user };
    return cachedTransporter;
  } catch (err) {
    console.warn('[EmailService] Failed to create Ethereal test account:', err.message);
    // Graceful memory stream fallback
    cachedTransporter = nodemailer.createTransport({
      streamTransport: true,
      newline: 'unix',
      buffer: true,
    });
    cachedAccountInfo = { type: 'memory_stream' };
    return cachedTransporter;
  }
}

/**
 * Renders an inline-styled, modern HTML email template for flight price tracking.
 */
function renderFlightEmailHtml({
  type = 'track_confirmation', // 'track_confirmation' | 'price_drop'
  flight,
  targetPriceFormatted,
  currentPriceFormatted,
  savingsFormatted,
  currency = 'INR',
  bookingUrl,
  recipientEmail,
}) {
  const isDrop = type === 'price_drop';
  const origAirport = AIRPORT_BY_CODE[flight.origin] || { city: flight.origin, name: '' };
  const destAirport = AIRPORT_BY_CODE[flight.destination] || { city: flight.destination, name: '' };
  const airlineName = flight.airline?.name || flight.flightNumber;
  const directLink = bookingUrl || getBookingUrl('direct', flight.airline, flight.origin, flight.destination, flight.date);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isDrop ? 'Price Drop Alert' : 'Price Tracking Active'}</title>
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f8fafc;padding:32px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" style="max-width:580px;background-color:#ffffff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;box-shadow:0 10px 25px -5px rgba(0,0,0,0.05);">
          
          <!-- Brand Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #4f46e5 0%, #3730a3 100%);padding:28px 32px;text-align:left;">
              <table width="100%">
                <tr>
                  <td>
                    <span style="font-size:20px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">✈️ AirFare</span>
                    <span style="display:inline-block;margin-left:8px;background:rgba(255,255,255,0.2);color:#ffffff;font-size:11px;font-weight:600;padding:3px 8px;border-radius:12px;text-transform:uppercase;">
                      ${isDrop ? '🔥 Fare Drop Alert' : '🔔 Alert Activated'}
                    </span>
                  </td>
                  <td align="right" style="color:#c7d2fe;font-size:12px;">
                    ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                </tr>
              </table>
              <h1 style="color:#ffffff;font-size:22px;font-weight:700;margin:16px 0 4px 0;line-height:1.3;">
                ${isDrop ? `Fare dropped to ${currentPriceFormatted}!` : `Now tracking flight ${flight.flightNumber}`}
              </h1>
              <p style="color:#e0e7ff;font-size:13px;margin:0;">
                ${isDrop ? 'Your target price has been reached. Act fast before fare buckets adjust.' : 'We are monitoring real-time price fluctuations 24/7 across OTAs and airline portals.'}
              </p>
            </td>
          </tr>

          <!-- Flight Itinerary Summary -->
          <tr>
            <td style="padding:28px 32px;">
              <table width="100%" style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px 20px;">
                <tr>
                  <td style="vertical-align:top;">
                    <div style="font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Flight</div>
                    <div style="font-size:16px;font-weight:700;color:#0f172a;margin-top:2px;">${airlineName}</div>
                    <div style="font-size:12px;font-weight:600;color:#4f46e5;margin-top:2px;">${flight.flightNumber} · ${flight.aircraft || 'Commercial Aircraft'}</div>
                  </td>
                  <td style="vertical-align:top;text-align:right;">
                    <div style="font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Departure Date</div>
                    <div style="font-size:14px;font-weight:700;color:#0f172a;margin-top:2px;">${flight.date}</div>
                    <div style="font-size:12px;color:#64748b;margin-top:2px;">One-way Journey</div>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top:16px;border-top:1px dashed #cbd5e1;margin-top:12px;">
                    <table width="100%">
                      <tr>
                        <td width="42%">
                          <div style="font-size:20px;font-weight:800;color:#0f172a;">${flight.origin}</div>
                          <div style="font-size:12px;color:#64748b;margin-top:2px;">${origAirport.city}</div>
                        </td>
                        <td width="16%" align="center" style="color:#94a3b8;font-size:16px;">
                          ✈️
                        </td>
                        <td width="42%" align="right">
                          <div style="font-size:20px;font-weight:800;color:#0f172a;">${flight.destination}</div>
                          <div style="font-size:12px;color:#64748b;margin-top:2px;">${destAirport.city}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Price Breakdown Strip -->
              <table width="100%" style="margin-top:20px;border-collapse:collapse;">
                <tr>
                  <td style="padding:14px 16px;background-color:#f1f5f9;border-radius:10px 0 0 10px;border:1px solid #e2e8f0;border-right:none;">
                    <div style="font-size:11px;color:#64748b;font-weight:600;text-transform:uppercase;">Current Fare</div>
                    <div style="font-size:20px;font-weight:800;color:#0f172a;margin-top:2px;">${currentPriceFormatted}</div>
                  </td>
                  <td style="padding:14px 16px;background-color:#ecfdf5;border:1px solid #a7f3d0;border-right:none;">
                    <div style="font-size:11px;color:#047857;font-weight:600;text-transform:uppercase;">Target Price</div>
                    <div style="font-size:20px;font-weight:800;color:#059669;margin-top:2px;">${targetPriceFormatted}</div>
                  </td>
                  <td style="padding:14px 16px;background-color:#f0fdf4;border-radius:0 10px 10px 0;border:1px solid #bbf7d0;">
                    <div style="font-size:11px;color:#15803d;font-weight:600;text-transform:uppercase;">Estimated Savings</div>
                    <div style="font-size:20px;font-weight:800;color:#16a34a;margin-top:2px;">${savingsFormatted || 'Active'}</div>
                  </td>
                </tr>
              </table>

              <!-- Primary Call To Action -->
              <div style="margin-top:28px;text-align:center;">
                <a href="${directLink}" target="_blank" style="display:inline-block;background-color:#4f46e5;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:10px;box-shadow:0 4px 14px rgba(79,70,229,0.3);">
                  View Live Deal &amp; Book Fare ↗
                </a>
                <p style="margin-top:10px;font-size:11px;color:#94a3b8;">
                  Compares MakeMyTrip, Cleartrip, Ixigo, Skyscanner &amp; official carrier rates.
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc;padding:20px 32px;border-top:1px solid #e2e8f0;font-size:11px;color:#64748b;line-height:1.5;">
              <p style="margin:0 0 6px 0;">
                You are receiving this notification because you subscribed to flight price tracking for <strong>${flight.flightNumber}</strong> with <strong>${recipientEmail}</strong>.
              </p>
              <p style="margin:0;color:#94a3b8;">
                AirFare Intelligence · Real-Time Flight Analytics &amp; Price Prediction Engine
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Dispatches an email notification for flight price tracking.
 */
export async function sendFlightAlertEmail({
  recipient,
  type = 'track_confirmation',
  flight,
  targetPrice,
  currentPrice,
  currency = 'INR',
  bookingUrl,
  env = process.env,
}) {
  if (!recipient || !flight) {
    throw new Error('Recipient email and flight payload are required.');
  }

  const transporter = await getTransporter(env);
  const sender = env.SMTP_FROM || '"AirFare Alerts" <alerts@airfare.app>';

  const targetFormatted = `${currency} ${Number(targetPrice).toLocaleString()}`;
  const currentFormatted = `${currency} ${Number(currentPrice).toLocaleString()}`;
  const savings = Math.max(0, currentPrice - targetPrice);
  const savingsFormatted = savings > 0 ? `-${currency} ${savings.toLocaleString()}` : 'Target Met';

  const isDrop = type === 'price_drop';
  const subject = isDrop
    ? `🔥 Price Drop Alert: ${flight.flightNumber} dropped to ${currentFormatted}!`
    : `✈️ AirFare Price Alert Active: ${flight.flightNumber} (${flight.origin} → ${flight.destination})`;

  const html = renderFlightEmailHtml({
    type,
    flight,
    targetPriceFormatted: targetFormatted,
    currentPriceFormatted: currentFormatted,
    savingsFormatted,
    currency,
    bookingUrl,
    recipientEmail: recipient,
  });

  const mailOptions = {
    from: sender,
    to: recipient,
    subject,
    text: `AirFare Alert for ${flight.flightNumber}: Current fare is ${currentFormatted}, target is ${targetFormatted}. Check deals: ${bookingUrl || 'https://www.google.com/travel/flights'}`,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  const previewUrl = nodemailer.getTestMessageUrl(info) || null;

  return {
    success: true,
    messageId: info.messageId,
    previewUrl,
    accountType: cachedAccountInfo?.type || 'unknown',
    recipient,
    type,
    flightNumber: flight.flightNumber,
  };
}
