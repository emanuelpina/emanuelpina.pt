const sgMail = require('@sendgrid/mail');

exports.handler = function(event, context, callback) {
    const body = JSON.parse(event.body);
    const name = body.data.Name.trim();
    const email = body.data.Email.trim();
    const subject = body.data.Subject.trim();
    const mailto = process.env.CONTACT_MAIL_TO;
    const mailfrom = process.env.CONTACT_MAIL_FROM;
    const dataArray = Object.entries(body.human_fields);
    console.log('Variables are loaded...');
    const tableData = dataArray
        .map(x => `<tr><td><b>${x[0]}</b>&nbsp;</td><td>${x[1]}</td></td>`)
        .join('');
    const textData = dataArray.map(x => ` ${x[0]}: ${x[1]}\r\n`).join('');
    const htmlone = `${name},<br><br>You are receiving this email because you sent me a message through a form on my blog.<br><br><u>If you want to add further details, simply reply to this e-mail.</u><br><br>A copy of your message:<br><table><tbody>${tableData}</tbody></table><br>I will reply as soon as possible.<br><br>Sincerly,<br>Emanuel Pina<br>emanuelpina.pt`;
    const htmltwo = `You have received a new message.<br><br><table><tbody>${tableData}</tbody></table><br>Best regards,<br>The Post Office`;
    const textone = ` ${name},\r\n\r\n You are receiving this email because you sent me a message through a form on my blog.\r\n\r\n If you want to add further details, simply reply to this e-mail.\r\n\r\n A copy of your message:\r\n${textData}\r\n I will reply as soon as possible.\r\n\r\n Sincerly,\r\n Emanuel Pina\r\n emanuelpina.pt`;
    const texttwo = ` You have received a new message.\r\n\r\n${textData}\r\n Best regards,\r\n The Post Office`;
    console.log('Messages are ready...');
    const msgs = [
        {
        to: email,
        from: {
            email: mailfrom,
            name: 'Emanuel Pina'
        },
        replyTo: mailto,
        subject: 'Thanks for your message!',
        text: textone,
        html: htmlone,
        },
        {
        to: mailto,
        from: {
            email: mailfrom,
            name: name
        },
        replyTo: email,
        subject: subject,
        text: texttwo,
        html: htmltwo,
        },
    ];

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    sgMail
    .send(msgs)
    .then(() => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(msgs),
      });
    console.log('Emails are sent!');
    })
    .catch(error => callback(error));
};