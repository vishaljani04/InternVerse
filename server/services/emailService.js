const nodemailer = require('nodemailer');

let transporter = null;

// Initialize transporter if credentials are available
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

const sendEmail = async (to, subject, html) => {
  if (!transporter) {
    console.log(`📧 Email (skipped - no SMTP config): To: ${to}, Subject: ${subject}`);
    return null;
  }

  try {
    const info = await transporter.sendMail({
      from: `"InternVerse" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log(`📧 Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Email error:', error.message);
    return null;
  }
};

const emailTemplates = {
  internApproval: (name) => ({
    subject: '🎉 Welcome to InternVerse – Your Internship is Approved!',
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to InternVerse!</h1>
        </div>
        <div style="padding: 32px;">
          <p style="font-size: 16px; color: #334155;">Hi <strong>${name}</strong>,</p>
          <p style="font-size: 16px; color: #334155;">Your internship has been approved! You can now log in to your dashboard to view your tasks, track progress, and more.</p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${process.env.CLIENT_URL}/login" style="background: #6366f1; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">Go to Dashboard</a>
          </div>
          <p style="color: #64748b; font-size: 14px;">Best regards,<br>The InternVerse Team</p>
        </div>
      </div>
    `
  }),

  taskAssignment: (name, taskTitle, deadline) => ({
    subject: `📋 New Task Assigned: ${taskTitle}`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #3b82f6, #6366f1); padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">New Task Assigned</h1>
        </div>
        <div style="padding: 32px;">
          <p style="font-size: 16px; color: #334155;">Hi <strong>${name}</strong>,</p>
          <p style="font-size: 16px; color: #334155;">A new task has been assigned to you:</p>
          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="margin: 0; font-weight: 600; color: #1e293b;">${taskTitle}</p>
            <p style="margin: 8px 0 0; color: #64748b;">Deadline: ${new Date(deadline).toLocaleDateString()}</p>
          </div>
          <p style="color: #64748b; font-size: 14px;">Best regards,<br>The InternVerse Team</p>
        </div>
      </div>
    `
  }),

  taskRejected: (name, taskTitle, feedback) => ({
    subject: `⚠️ Task Needs Revision: ${taskTitle}`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #ef4444, #f97316); padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Task Revision Required</h1>
        </div>
        <div style="padding: 32px;">
          <p style="font-size: 16px; color: #334155;">Hi <strong>${name}</strong>,</p>
          <p style="font-size: 16px; color: #334155;">Your submitted task needs revision:</p>
          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="margin: 0; font-weight: 600; color: #1e293b;">${taskTitle}</p>
            <p style="margin: 8px 0 0; color: #64748b;">Feedback: ${feedback || 'Please review and resubmit.'}</p>
          </div>
        </div>
      </div>
    `
  }),

  internshipComplete: (name) => ({
    subject: '🎓 Congratulations! Your Internship is Complete!',
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🎓 Internship Completed!</h1>
        </div>
        <div style="padding: 32px;">
          <p style="font-size: 16px; color: #334155;">Hi <strong>${name}</strong>,</p>
          <p style="font-size: 16px; color: #334155;">Congratulations on completing your internship! Your certificate is now ready for download in your dashboard.</p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${process.env.CLIENT_URL}/intern/certificates" style="background: #10b981; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">Download Certificate</a>
          </div>
        </div>
      </div>
    `
  }),

  certificateGenerated: (name) => ({
    subject: '📜 Your Internship Certificate is Ready!',
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #8b5cf6, #a855f7); padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">📜 Certificate Ready!</h1>
        </div>
        <div style="padding: 32px;">
          <p style="font-size: 16px; color: #334155;">Hi <strong>${name}</strong>,</p>
          <p style="font-size: 16px; color: #334155;">Your internship certificate has been generated and is ready for download.</p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${process.env.CLIENT_URL}/intern/certificates" style="background: #8b5cf6; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">View Certificate</a>
          </div>
        </div>
      </div>
    `
  }),
  evaluationCreated: (name, period) => ({
    subject: `🌟 New Performance Evaluation: ${period.charAt(0).toUpperCase() + period.slice(1)}`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Performance Review Available</h1>
        </div>
        <div style="padding: 32px;">
          <p style="font-size: 16px; color: #334155;">Hi <strong>${name}</strong>,</p>
          <p style="font-size: 16px; color: #334155;">A new performance evaluation (${period}) has been published for you. Log in to your dashboard to view your scores and feedback.</p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${process.env.CLIENT_URL}/login" style="background: #f59e0b; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">View Evaluation</a>
          </div>
          <p style="color: #64748b; font-size: 14px;">Best regards,<br>The InternVerse Team</p>
        </div>
      </div>
    `
  })
};

module.exports = { sendEmail, emailTemplates };
