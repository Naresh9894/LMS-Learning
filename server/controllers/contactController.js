import nodemailer from 'nodemailer'

export const sendContactEmail = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    if (!name || !email || !message) {
      return res.json({ success: false, message: 'Name, email and message are required' })
    }

    // ── Nodemailer transporter ────────────────────────────────────────────────
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.CONTACT_EMAIL,       // your gmail address
        pass: process.env.CONTACT_EMAIL_PASS,  // gmail app password (not your real password)
      },
    })

    // ── Email to YOU (admin notification) ────────────────────────────────────
    await transporter.sendMail({
      from: `"Sugoi Learn Contact" <${process.env.CONTACT_EMAIL}>`,
      to: process.env.CONTACT_EMAIL,
      subject: `[Contact Form] ${subject || 'New message'} — from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #050d1a; color: #f0e6cc; padding: 32px; border-radius: 12px; border: 1px solid rgba(212,168,67,0.3);">
          <h2 style="color: #d4a843; font-size: 24px; margin-bottom: 24px;">New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid rgba(212,168,67,0.15);">
              <td style="padding: 10px 0; color: #5a7a9a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; width: 120px;">Name</td>
              <td style="padding: 10px 0; color: #f0e6cc;">${name}</td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(212,168,67,0.15);">
              <td style="padding: 10px 0; color: #5a7a9a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Email</td>
              <td style="padding: 10px 0; color: #f0e6cc;"><a href="mailto:${email}" style="color: #d4a843;">${email}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(212,168,67,0.15);">
              <td style="padding: 10px 0; color: #5a7a9a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Subject</td>
              <td style="padding: 10px 0; color: #f0e6cc;">${subject || 'No subject'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #5a7a9a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; vertical-align: top;">Message</td>
              <td style="padding: 10px 0; color: #f0e6cc; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</td>
            </tr>
          </table>
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(212,168,67,0.15); font-size: 12px; color: #5a7a9a;">
            Sent from Sugoi Learn Contact Form
          </div>
        </div>
      `,
    })

    // ── Auto-reply to user ────────────────────────────────────────────────────
    await transporter.sendMail({
      from: `"Sugoi Learn" <${process.env.CONTACT_EMAIL}>`,
      to: email,
      subject: `We received your message — Sugoi Learn`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #050d1a; color: #f0e6cc; padding: 32px; border-radius: 12px; border: 1px solid rgba(212,168,67,0.3);">
          <h2 style="color: #d4a843; font-size: 24px; margin-bottom: 8px;">Thanks for reaching out, ${name}! 👋</h2>
          <p style="color: #a8b8d0; margin-bottom: 24px;">We've received your message and will get back to you within 24 hours.</p>
          <div style="background: rgba(212,168,67,0.06); border: 1px solid rgba(212,168,67,0.2); border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <p style="margin: 0 0 8px; color: #5a7a9a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Your Message</p>
            <p style="margin: 0; color: #f0e6cc; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          <p style="color: #a8b8d0;">In the meantime, explore our <a href="${process.env.CLIENT_URL}/course-list" style="color: #d4a843;">latest courses</a> or check our <a href="${process.env.CLIENT_URL}/about" style="color: #d4a843;">About page</a>.</p>
          <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid rgba(212,168,67,0.15); font-size: 12px; color: #5a7a9a;">
            © 2025 Sugoi Learn — LMS-TECHMANI. All rights reserved.
          </div>
        </div>
      `,
    })

    res.json({ success: true, message: 'Message sent successfully' })

  } catch (error) {
    console.error('Contact email error:', error)
    res.json({ success: false, message: error.message })
  }
}