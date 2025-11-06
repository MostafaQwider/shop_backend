// mailer.js
const { Resend } = require('resend');

// إنشاء كائن Resend باستخدام مفتاح البيئة
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * إرسال كود تحقق عبر البريد الإلكتروني
 * @param {string} toEmail - البريد المستلم
 * @param {string} code - كود التحقق
 * @param {string} subject - عنوان الرسالة (اختياري)
 */
exports.sendCode = async (toEmail, code, subject = "Verification Code") => {
  try {
    await resend.emails.send({
      from: 'Shopingo App <onboarding@resend.dev>', // لا يمكن تغييره إلا بعد توثيق نطاقك
      to: toEmail,
      subject,
      html: `<p>Your verification code is: <strong>${code}</strong></p>`,
    });

    console.log(`✅ Verification code sent to ${toEmail}`);
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
  }
};
