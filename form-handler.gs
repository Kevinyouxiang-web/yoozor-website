/**
 * Yoozor.com Contact Form Handler
 * 
 * HOW TO DEPLOY:
 * 1. Go to https://script.google.com/
 * 2. Create a new project
 * 3. Paste this entire code
 * 4. Replace YOUR_EMAIL with evin.ho@yoozor.com
 * 5. Go to Deploy → New deployment → Web app
 * 6. Set "Execute as" to "Me", "Who has access" to "Anyone"
 * 7. Deploy and copy the web app URL
 * 8. Update the form action in index.html with that URL
 */

function doPost(e) {
  try {
    const data = e.parameter;
    const recipient = 'evin.ho@yoozor.com';
    
    // Build email content
    const subject = 'New Inquiry from yoozor.com — ' + (data.name || 'Unknown');
    const body = 
      'New inquiry from yoozor.com\n' +
      '========================\n\n' +
      'Name: ' + (data.name || 'N/A') + '\n' +
      'Company: ' + (data.company || 'N/A') + '\n' +
      'Email: ' + (data.email || 'N/A') + '\n' +
      'Phone: ' + (data.phone || 'N/A') + '\n' +
      'Product Interest: ' + (data.product || 'N/A') + '\n\n' +
      'Message:\n' + (data.message || 'N/A') + '\n\n' +
      '========================\n' +
      'Sent from yoozor.com contact form';
    
    // Send email
    MailApp.sendEmail({
      to: recipient,
      subject: subject,
      body: body,
      replyTo: data.email || recipient
    });
    
    // Return success
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return HtmlService.createHtmlOutput(
    '<h2>Yoozor Form Handler</h2><p>This endpoint is working. Use POST to submit forms.</p>'
  );
}
