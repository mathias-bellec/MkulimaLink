const AfricasTalking = require('africastalking');

const credentials = {
  apiKey: process.env.AFRICASTALKING_API_KEY || 'test',
  username: process.env.AFRICASTALKING_USERNAME || 'sandbox'
};

const africasTalking = AfricasTalking(credentials);
const sms = africasTalking.SMS;

const sendSMS = async (phoneNumber, message) => {
  try {
    if (!phoneNumber || !message) {
      console.log('SMS not sent: Missing phone number or message');
      return { success: false, message: 'Missing parameters' };
    }

    let formattedPhone = phoneNumber.toString().trim();
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+255' + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+255' + formattedPhone;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[SMS] To: ${formattedPhone}, Message: ${message}`);
      return { success: true, message: 'SMS logged (dev mode)' };
    }

    const options = {
      to: [formattedPhone],
      message: message,
      from: 'MkulimaLink'
    };

    const response = await sms.send(options);
    console.log('SMS sent successfully:', response);
    return { success: true, response };
  } catch (error) {
    console.error('SMS sending error:', error);
    return { success: false, error: error.message };
  }
};

const sendBulkSMS = async (recipients) => {
  try {
    const results = [];
    
    for (const recipient of recipients) {
      const result = await sendSMS(recipient.phone, recipient.message);
      results.push({
        phone: recipient.phone,
        success: result.success
      });
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return results;
  } catch (error) {
    console.error('Bulk SMS error:', error);
    throw error;
  }
};

module.exports = { sendSMS, sendBulkSMS };
