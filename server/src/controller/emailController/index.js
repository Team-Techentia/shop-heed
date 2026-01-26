const validator = require("../../validator/validator");
const nodemailer = require("nodemailer");
const { generateInvoicePDF } = require("../../utils/invoiceGenerator");

console.log("---------------- EMAIL CONFIG DEBUG ----------------");
console.log("SMTP_HOST:", process.env.SMTP_HOST);
console.log("SMTP_PORT:", process.env.SMTP_PORT);
console.log("SMTP_SECURE (raw):", process.env.SMTP_SECURE);
console.log("SMTP_SECURE (parsed):", process.env.SMTP_SECURE === "true");
console.log("SMTP_USER:", process.env.SMTP_USER);
console.log("----------------------------------------------------");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT), // Convert to number
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: false // Accept self-signed certificates
    },
    debug: true, // Enable debug output
    logger: true // Log to console
});

// Verify connection on startup
transporter.verify(function (error, success) {
    if (error) {
        console.error("❌ SMTP Connection Failed:", error);
    } else {
        console.log("✅ SMTP Server is ready to send emails");
    }
});

function EmailSendComponent(to, subject, htmlContent) {
    const mailOptions = {
        from: process.env.SMTP_FROM || `"ShopHeed" <${process.env.SMTP_USER}>`,
        to: to,
        subject: subject,
        html: htmlContent,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("❌ Error sending email:", error);
            console.error("Error details:", {
                code: error.code,
                command: error.command,
                response: error.response,
                responseCode: error.responseCode
            });
        } else {
            console.log(`✅ Email sent successfully to ${to}. MessageId:`, info.messageId);
        }
    });
}

const contactUs = async function (req, res) {
    try {
        const { to, name, email, message, phone } = req.body;

        if (!validator.isValid(name)) {
            return res
                .status(404)
                .json({ success: false, message: "name must be required" });
        }

        if (!validator.isValid(email)) {
            return res
                .status(404)
                .json({ success: false, message: "email must be required" });
        }

        if (!validator.isValid(message)) {
            return res
                .status(404)
                .json({ success: false, message: "message must be required" });
        }

        if (!validator.isValid(phone)) {
            return res
                .status(404)
                .json({ success: false, message: "phone must be required" });
        }
        const htmlData = `<!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f2f2f2;
            }
            .container {
                width: 80%;
                margin: auto;
                padding: 20px;
                background-color: #fff;
                border: 1px solid #ddd;
                border-radius: 5px;
                margin-top: 50px;
                box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
            }
            .container h2 {
                color: #4CAF50;
                margin-top: 0;
            }
            .container p {
                color: #333;
            }
        .verification-code {
                color: #4CAF50;
                font-size: 2rem;
                font-weight: bold;
                margin: 20px 0;
            }
  </style>
  </head>
    <body>
        <div class="container">
            <div style="font-family: Helvetica,Arial,sans-serif;overflow:auto;line-height:2">
      <div style="margin:50px auto;width:90%;padding:20px 0">
        <div style="border-bottom:1px solid #eee">
          <a href="https://shopheed.com/assets/images/icon/logo.png" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600"></a>
    </div>
        <p style="font-size:1.1em">Hi,</p>
        <p>Name :${name} </p>
        
        <p>email :${email} </p>
        <p>phone :${phone} </p>
           <p>message :${message} </p>
        
   
    
      </div>
    </div>
       </div>
    </body>
    </html>`;
        EmailSendComponent(
            process.env.CLIENT_MAIL,
            "contact for ShopHeed",
            htmlData
        );

        return res
            .status(250)
            .json({ success: true, message: "received successfully" });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to submit. Internal server error.",
        });
    }
};

const BulkEnquiry = async function (req, res) {
    try {
        const {
            fullName,
            companyName,
            natureOfBusiness,
            phoneNumber,
            preferredContact,
            productsInterested,
            quantityRequired,
            shippingAddress,
            deliveryDate,
            additionalInfo,
            priceRange,
            heardAboutUs,
            otherSource,
            email,
        } = req.body;

        if (!validator.isValid(fullName)) {
            return res
                .status(404)
                .json({ success: false, message: "Full name is required" });
        }

        if (!validator.isValid(email)) {
            return res
                .status(404)
                .json({ success: false, message: "Email is required" });
        }

        if (!validator.isValid(phoneNumber)) {
            return res
                .status(404)
                .json({ success: false, message: "Phone number is required" });
        }

        if (!validator.isValid(productsInterested)) {
            return res
                .status(404)
                .json({ success: false, message: "Products interested is required" });
        }

        if (!validator.isValid(quantityRequired)) {
            return res
                .status(404)
                .json({ success: false, message: "Quantity required is required" });
        }

        if (!validator.isValid(shippingAddress)) {
            return res
                .status(404)
                .json({ success: false, message: "Shipping address is required" });
        }

        const htmlData = `
      <!DOCTYPE html>
      <html>
      <head>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f2f2f2;
                  color: #000;
              }
              .container {
                  width: 80%;
                  margin: auto;
                  padding: 20px;
                  background-color: #fff;
                  border: 1px solid #ddd;
                  border-radius: 5px;
                  margin-top: 50px;
                  box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
              }
              .container h2 {
                  color: #000;
                  margin-top: 0;
              }
              .container p {
                  color: #000;
              }
              .label {
                  font-weight: bold;
                  color: #000;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h2>Bulk Enquiry Information</h2>
              <p><span class="label">Full Name:</span> ${fullName}</p>
              <p><span class="label">Email:</span> ${email}</p>
              <p><span class="label">Phone Number:</span> ${phoneNumber}</p>
              <p><span class="label">Products Interested:</span> ${productsInterested}</p>
              <p><span class="label">Quantity Required:</span> ${quantityRequired}</p>
              <p><span class="label">Shipping Address:</span> ${shippingAddress}</p>
                <p><span class="label">Company Name:</span> ${companyName || "N/A"
            }</p>
              <p><span class="label">Additional Information:</span> ${additionalInfo || "N/A"
            }</p>
              <p><span class="label">Nature Of Business:</span> ${natureOfBusiness || "N/A"
            }</p>
              <p><span class="label">Preferred Contact:</span> ${preferredContact || "N/A"
            }</p>
              <p><span class="label">Delivery Date:</span> ${deliveryDate || "N/A"
            }</p>
              <p><span class="label">Price Range:</span> ${priceRange || "N/A"
            }</p>
              <p><span class="label">Heard AboutUs:</span> ${heardAboutUs || "N/A"
            }</p>
              <p><span class="label">Other Source:</span> ${otherSource || "N/A"
            }</p>
          </div>
      </body>
      </html>`;

        EmailSendComponent(
            process.env.CLIENT_MAIL,
            "Bulk Enquiry for ShopHeed",
            htmlData
        );

        return res
            .status(200)
            .json({ success: true, message: "Received successfully" });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to submit. Internal server error.",
        });
    }
};

const htmlContentForMailTemplate = (name, title, dis) => {
    return `<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office">
  
  <head>
  
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="format-detection" content="telephone=no">
  <meta name="format-detection" content="date=no">
  <meta name="format-detection" content="address=no">
  <meta name="format-detection" content="email=no">
  <title>Email</title>
  
  <link href="https://fonts.googleapis.com/css?family=Josefin+Sans:300,300i,400,400i,600,600i,700,700i,800,800i"
      rel="stylesheet">
  <link href="https://fonts.googleapis.com/css?family=Lora:300,300i,400,400i,600,600i,700,700i,800,800i"
      rel="stylesheet">
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i,800,800i"
      rel="stylesheet">
  <link href="https://fonts.googleapis.com/css?family=Dancing+Script:300,300i,400,400i,600,600i,700,700i,800,800i"
      rel="stylesheet">
  <link href="https://fonts.googleapis.com/css?family=Roboto:300,300i,400,400i,600,600i,700,700i,800,800i"
      rel="stylesheet">
  
  
  <style type="text/css">
  
      body {
          margin: 0px !important;
          padding: 0px !important;
          display: block !important;
          min-width: 100% !important;
          width: 100% !important;
          -webkit-text-size-adjust: none;
      }
  
      table {
          border-spacing: 0;
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
      }
  
      table td {
          border-collapse: collapse;
      }
  
      strong {
          font-weight: bold !important;
      }
  
      td img {
          -ms-interpolation-mode: bicubic;
          display: block;
          width: auto;
          max-width: auto;
          height: auto;
          margin: auto;
          display: block !important;
          border: 0px !important;
      }
  
      td p {
          margin: 0 !important;
          padding: 0 !important;
          display: inline-block !important;
          font-family: inherit !important;
      }
  
      td a {
          text-decoration: none !important;
      }
  
      /* outlook */
      .ExternalClass {
          width: 100%;
      }
  
      .ExternalClass,
      .ExternalClass p,
      .ExternalClass span,
      .ExternalClass font,
      .ExternalClass td,
      .ExternalClass div {
          line-height: inherit;
      }
  
      .ReadMsgBody {
          width: 100%;
          background-color: #ffffff;
      }
  
      /* iOS blue links */
      a[x-apple-data-detectors] {
          color: inherit !important;
          text-decoration: none !important;
          font-size: inherit !important;
          font-family: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
      }
  
      /* gmail blue links */
      u+#body a {
          color: inherit;
          text-decoration: none;
          font-size: inherit;
          font-family: inherit;
          font-weight: inherit;
          line-height: inherit;
      }
  
      /* buttons fix */
      .undoreset a,
      .undoreset a:hover {
          text-decoration: none !important;
      }
  
      .yshortcuts a {
          border-bottom: none !important;
      }
  
      .ios-footer a {
          color: #aaaaaa !important;
          text-decoration: none;
      }
  
      /* responsive */
      @media screen and (max-width: 640px) {
  
          td.img-responsive img {
              width: 100% !important;
              max-width: 100% !important;
              height: auto !important;
              margin: auto;
          }
  
          table.row {
              width: 100% !important;
              max-width: 100% !important;
          }
  
          table.center-float,
          td.center-float {
              float: none !important;
          }
  
          /* stops floating modules next to each other */
          td.center-text {
              text-align: center !important;
          }
  
          td.container-padding {
              width: 100% !important;
              padding-left: 15px !important;
              padding-right: 15px !important;
          }
  
          table.hide-mobile,
          tr.hide-mobile,
          td.hide-mobile,
          br.hide-mobile {
              display: none !important;
          }
  
          td.menu-container {
              text-align: center !important;
          }
  
          td.autoheight {
              height: auto !important;
          }
  
          table.mobile-padding {
              margin: 15px 0 !important;
          }
  
          table.br-mobile-true td br {
              display: initial !important;
          }
  
      }
  </style>
  </head>
  
  <body>
      <table style="width:100%;max-width:100%;" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
          <tbody><tr>
                         <td bgcolor="#F4F4F4" align="center">
                       
                             <!--container-->
                              <table class="row" style="width:600px;max-width:600px;" width="600" cellspacing="0" cellpadding="0" border="0" align="center">
                                  <tbody><tr><td bgcolor="# 000000" align="center">
                                      
                                      <!--wrapper-->
                                      <table class="row" style="width:540px;max-width:540px;" width="540" cellspacing="0" cellpadding="0" border="0" align="center">
                                      <tbody><tr><td class="container-padding" align="center">
                                          
                                        
                                          
                                          <!-- content container -->
                                          <table width="540" border="0" cellpadding="0" cellspacing="0" align="center" class="row" style="width:540px;max-width:540px;">
                                              <tbody><tr><td align="center">
                                                  
                                              <!-- content -->    
                                                <table border="0" width="100%" cellpadding="0" cellspacing="0" align="center" style="width:100%; max-width:100%;">
                                                    <tbody><tr><td height="25"> </td></tr> 
                                               <tr><td>
                                                   <table border="0" width="100%" cellpadding="0" cellspacing="0" align="center">
                                                   <tbody><tr>
                                                       <td width="80" align="left">
                                                       <img width="80" style="display:block;width:100%;max-width:80px;" alt="img" src="https://shopheed.com/assets/images/icon/logo.png">
                                                       </td>
                                                       <td> </td>
                                                       <td align="right" style="font-family:'Open Sans', Arial, Helvetica, sans-serif;font-size: 14px;color: #ffffff;"><a href="https://shopheed.com/contact-us" target="_blank" style="color: #ffffff">Help Center</a></td>
                                                       </tr>
                                                   </tbody></table>
                                                   </td></tr>
                                                    <tr><td height="25"> </td></tr> 
                                                  </tbody></table>
                                                  
                                                  </td></tr>
                                          </tbody></table>
                                          
                                        
                                          
                                          </td></tr>
                                      </tbody></table>
                                      
                                      </td></tr>
                         </tbody></table>
                       
                       </td>
                         </tr>
                  </tbody></table>
          
  <table style="width:100%;max-width:100%;" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
      <tbody>
          <tr>
              <td bgcolor="#F4F4F4" align="center">
  
                  <!--container-->
                  <table class="row" style="width:600px;max-width:600px;" width="600" cellspacing="0" cellpadding="0"
                      border="0" align="center">
                      <tbody>
                          <tr>
                              <td bgcolor="#f6f6f4" align="center">
  
                                  <!--wrapper-->
                                  <table class="row" style="width:540px;max-width:540px;" width="540" cellspacing="0"
                                      cellpadding="0" border="0" align="center">
                                      <tbody>
                                          <tr>
                                              <td class="container-padding" align="center">
  
  
  
                                                  <!-- content container -->
                                                  <table width="540" border="0" cellpadding="0" cellspacing="0"
                                                      align="center" class="row" style="width:540px;max-width:540px;">
                                                      <tbody>
                                                          <tr>
                                                              <td align="center">
                                                                 
                                                                  <!-- content -->
                                                                  <table border="0" width="100%" cellpadding="0"
                                                                      cellspacing="0" align="center"
                                                                      style="width:100%; max-width:100%;">
                                                                      <tbody>
                                                                          <tr>
                                                                              <td height="30"> </td>
                                                                          </tr>
                                                                          
                                                                          <tr>
                                                                           
                                                                          </tr>
                                                                          <tr>
                                                                              <td height="20"> </td>
                                                                          </tr>
                                                                          <tr>
                                                                              
                                                                              <td align="center"
                                                                                  style="font-family:'Josefin Sans', Arial, Helvetica, sans-serif;font-size: 30px;color: #282828;">
                                                                                  Dear, ${name}</td>
                                                                          </tr>
                                                                          <tr>
                                                                              <td height="30"> </td>
                                                                          </tr>
                                                                          
                                                                          <tr>
                                                                              
                                                                              <td align="center"
                                                                                  style="font-family:'Josefin Sans', Arial, Helvetica, sans-serif;font-size: 30px;color: #282828;">
    ${title}</td>
                                                                          </tr>
                                                                          <tr>
                                                                              <td height="18"> </td>
                                                                          </tr>
                                                                          <tr>
                                                                              <td align="center"
                                                                                  style="font-family:'Josefin Sans', Arial, Helvetica, sans-serif;font-size: 24px;color: #282828;">
                                                                                 ${dis} </td>
                                                                          </tr>
                                                                          
                                                                          <tr>
                                                                              <td height="18"> </td>
                                                                          </tr>
                                                                        
                                                                          <tr>
                                                                              <td height="25"> </td>
                                                                          </tr>
                                                                          <tr>
                                                                              <td align="center">
  
                                                                                  <!--button-->
                                                                                  <table border="0" bgcolor="# 000000"
                                                                                      cellpadding="0" cellspacing="0">
                                                                                      <tbody>
                                                                                          <tr>
  
                                                                                              <td align="center"
                                                                                                  height="40"
                                                                                                  width="170"
                                                                                                  style="font-family:'Open Sans', Arial, Helvetica, sans-serif;font-size: 13px;color: #ffffff;font-weight: 600;letter-spacing: 0.5px;">
  
  
                                                                                                  <a href="https://shopheed.com/"
                                                                                                      target="_blank"
                                                                                                      style="color: #ffffff">GO
                                                                                                      TO SITE</a>
                                                                                              </td>
  
                                                                                          </tr>
                                                                                      </tbody>
                                                                                  </table>
  
                                                                              </td>
                                                                          </tr>
  
  
                                                                          <tr>
                                                                              <td height="30"> </td>
                                                                          </tr>
                                                                      </tbody>
                                                                  </table>
  
                                                              </td>
                                                          </tr>
                                                      </tbody>
                                                  </table>
  
  
  
                                              </td>
                                          </tr>
                                      </tbody>
                                  </table>
  
                              </td>
                          </tr>
                      </tbody>
                  </table>
  
              </td>
          </tr>
      </tbody>
  </table>
  
  
  <table style="width:100%;max-width:100%;" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
      <tbody>
          <tr>
              <td bgcolor="#F4F4F4" align="center">
  
                  <!--container-->
                  <table class="row" style="width:600px;max-width:600px;" width="600" cellspacing="0" cellpadding="0"
                      border="0" align="center">
                      <tbody>
                          <tr>
                              <td bgcolor="#FFFFFF" align="center">
  
                                  <!--wrapper-->
                                  <table class="row" style="width:540px;max-width:540px;" width="540" cellspacing="0"
                                      cellpadding="0" border="0" align="center">
                                      <tbody>
                                          <tr>
                                              <td class="container-padding" align="center">
  
  
  
                                                  <!-- content container -->
                                                  <table width="540" border="0" cellpadding="0" cellspacing="0"
                                                      align="center" class="row" style="width:540px;max-width:540px;">
                                                      <tbody>
                                                          <tr>
                                                              <td align="center">
  
                                                                  <!-- content -->
                                                                  <table border="0" width="100%" cellpadding="0"
                                                                      cellspacing="0" align="center"
                                                                      style="width:100%; max-width:100%;">
                                                                      <tbody>
                                                                          <tr>
                                                                              <td
                                                                                  style="line-height: 15px;height: 15px;font-size: 0px;">
                                                                              </td>
                                                                          </tr>
  
  
                                                                          <tr>
                                                                              <td align="center">
  
                                                                                  <!--[if (gte mso 9)|(IE)]><table border="0" cellpadding="0" cellspacing="0"><tr><td><![endif]-->
  
                                                                                  <!-- column -->
                                                                               
                                                                                
                                                                                
  
  
  
  
                                                                                
                                                                              </td>
                                                                          </tr>
                                                                          <tr>
                                                                              <td height="30"> </td>
                                                                          </tr>
                                                                      </tbody>
                                                                  </table>
  
                                                              </td>
                                                          </tr>
                                                      </tbody>
                                                  </table>
  
  
  
                                              </td>
                                          </tr>
                                      </tbody>
                                  </table>
  
                              </td>
                          </tr>
                      </tbody>
                  </table>
  
              </td>
          </tr>
      </tbody>
  </table>
  
  <table style="width:100%;max-width:100%;" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
      <tbody>
          <tr>
              <td bgcolor="#F4F4F4" align="center">
  
                  <!--container-->
                  <table class="row" style="width:600px;max-width:600px;" width="600" cellspacing="0" cellpadding="0"
                      border="0" align="center">
                      <tbody>
                          <tr>
                              <td bgcolor="# 000000" align="center">
  
                                  <!--wrapper-->
                                  <table class="row" style="width:540px;max-width:540px;" width="540" cellspacing="0"
                                      cellpadding="0" border="0" align="center">
                                      <tbody>
                                          <tr>
                                              <td class="container-padding" align="center">
  
  
  
                                                  <!-- content container -->
                                                  <table width="540" border="0" cellpadding="0" cellspacing="0"
                                                      align="center" class="row" style="width:540px;max-width:540px;">
                                                      <tbody>
                                                          <tr>
                                                              <td align="center">
  
                                                                  <!-- content -->
                                                                  <table border="0" width="100%" cellpadding="0"
                                                                      cellspacing="0" align="center"
                                                                      style="width:100%; max-width:100%;">
                                                                      <tbody>
                                                                          <tr>
                                                                              <td height="40"> </td>
                                                                          </tr>
  
                                                                          <tr>
                                                                              <td align="center"
                                                                                  style="font-family:'Josefin Sans', Arial, Helvetica, sans-serif;font-size: 18px;color: #dadada;font-weight: 400;">
                                                                                  Get in Touch</td>
                                                                          </tr>
  
                                                                          <tr>
                                                                              <td height="20"> </td>
                                                                          </tr>
                                                                          <tr>
                                                                              <td>
  
                                                                                 
  
                                                                              </td>
                                                                          </tr>
                                                                          <tr>
                                                                              <td height="20"> </td>
                                                                          </tr>
                                                                          <tr>
                                                                              <td align="center"
                                                                                  style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size: 13px;color: #dadada;line-height: 19px;">
                                                                                  This email was sent to :
                                                                         heed.brandsin@gmail.com<br>
                                                                                  You are receiving this email because
                                                                                  you are subscribed to our mailing
                                                                                  list.<br>
                                                                                  For any questions please send to
                                                                              heed.brandsin@gmail.com
                                                                              </td>
                                                                          </tr>
                                                                          <tr>
                                                                              <td> </td>
                                                                          </tr>
                                                                          <tr>
                                                                              <td align="center">
  
                                                                                  <table cellspacing="0"
                                                                                      cellpadding="0" border="0">
                                                                                      <tbody>
                                                                                          <tr>
                                                                                             
                                                                                            
                                                                                              <td align="center"
                                                                                                  style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size: 13px;color: #dadada;line-height: 20px;text-decoration: underline">
                                                                                                  <a href="https://shopheed.com/privacy-policy"
                                                                                                      target="_blank"
                                                                                                      style="color: #dadada">Privacy
                                                                                                      Policy</a></td>
                                                                                              <td width="20"
                                                                                                  align="center"
                                                                                                  style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size: 13px;color: #dadada;line-height: 20px;">
                                                                                                  |</td>
                                                                                              <td align="center"
                                                                                                  style="font-family:'Roboto', Arial, Helvetica, sans-serif;font-size: 13px;color: #dadada;line-height: 20px;text-decoration: underline">
                                                                                                  <a href="https://shopheed.com/contact-us"
                                                                                                      target="_blank"
                                                                                                      style="color: #dadada">Help
                                                                                                      Center</a></td>
                                                                                          </tr>
                                                                                      </tbody>
                                                                                  </table>
  
                                                                              </td>
                                                                          </tr>
                                                                          <tr>
                                                                              <td height="40"> </td>
                                                                          </tr>
                                                                      </tbody>
                                                                  </table>
  
                                                              </td>
                                                          </tr>
                                                      </tbody>
                                                  </table>
  
  
  
                                              </td>
                                          </tr>
                                      </tbody>
                                  </table>
  
                              </td>
                          </tr>
                      </tbody>
                  </table>
  
              </td>
          </tr>
      </tbody>
  </table>
  
  </body>
  
  </html>`;
};
/**
 * 
 * @param {*} body 
 */
const returnOrExchangeMail = async (body) => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Return or Exchange Request</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f7f7f7;
            margin: 0;
            padding: 0;
            color: #333333;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #dddddd;
            border-radius: 5px;
        }
        .header {
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            color: #333333;
            margin-bottom: 10px;
        }
        .subtitle {
            text-align: center;
            font-size: 16px;
            color: #666666;
            margin-bottom: 20px;
        }
        .info {
            margin-bottom: 15px;
        }
        .info label {
            font-weight: bold;
            color: #333333;
        }
        .info p {
            margin: 5px 0;
            padding: 10px;
            background-color: #f9f9f9;
            border: 1px solid #dddddd;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #999999;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">Return/Exchange Request</div>
        <div class="subtitle">A user has submitted a  Return/Exchange Request form with the following details:</div>

        <div class="info">
            <label>Order Id:</label>
            <p>${body.orderId}}</p>
        </div>
        <div class="info">
            <label>Name:</label>
            <p>{{name}}</p>
        </div>
        <div class="info">
            <label>Email:</label>
            <p>${body.email}</p>
        </div>
        <div class="info">
            <label>Phone Number:</label>
            <p>${body.phone}</p>
        </div>
        <div class="info">
            <label>Option Selected:</label>
            <p>${body.option}</p>
        </div>
        <div class="info">
            <label>Message:</label>
            <p>${body.message}</p>
        </div>
    </div>
</body>
</html>`;

    const sendSmtpEmail = {
        to: [{ email: process.env.CLIENT_MAIL, name: "From Heed" }],
        sender: { email: body.email, name: "Return/Exchange Request" },
        subject: "Return/Exchange Request",
        htmlContent: htmlContent,
    };
    apiInstance.sendTransacEmail(sendSmtpEmail).then((data) => {
        return "Email sent:";
    });
};


const orderConfirmationTemplate = (order) => {
    const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.title} (Size: ${item.size || 'N/A'})</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">₹${item.finalPrice}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">₹${item.totalPrice}</td>
    </tr>
  `).join('');

    return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
          h2 { color: #00466a; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #f4f4f4; text-align: left; padding: 10px; }
          .total { font-weight: bold; text-align: right; margin-top: 20px; font-size: 1.2em; }
          .address { background-color: #f9f9f9; padding: 15px; margin-top: 20px; border-radius: 5px; }
          .footer { margin-top: 30px; font-size: 0.8em; color: #777; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Order Confirmation</h2>
          <p>Dear ${order.customerDetails.first_name},</p>
          <p>Thank you for your order! We have received your order <strong>${order.orderId}</strong> and it is now being processed.</p>
          
          <h3>Order Details</h3>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <div class="total">
            Total Amount: ₹${order.totalAmount}
          </div>

          <div class="address">
            <h3>Shipping Address</h3>
            <p>
              ${order.customerDetails.first_name} ${order.customerDetails.last_name || ''}<br>
              ${order.customerDetails.address}<br>
              ${order.customerDetails.city}, ${order.customerDetails.state} - ${order.customerDetails.pincode}<br>
              Phone: ${order.customerDetails.phone || order.customerDetails.mobile}
            </p>
          </div>

          <div class="footer">
            <p>If you have any questions, please reply to this email.</p>
            <p>Team ShopHeed</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

const adminNewOrderTemplate = (order) => {
    return `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <h2 style="color: #00466a;">New Order Received!</h2>
          <p>Hello Admin,</p>
          <p>You have received a new order <strong>${order.orderId}</strong>.</p>
          <p><strong>Customer:</strong> ${order.customerDetails.first_name} ${order.customerDetails.last_name}</p>
          <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
          <p>Please check the admin panel for more details.</p>
        </div>
      </body>
    </html>
  `;
};

const orderShippedTemplate = (order, awbNumber) => {
    const trackingUrl = awbNumber && awbNumber !== 'N/A' ? `https://shiprocket.co/tracking/${awbNumber}` : '#';
    return `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <h2 style="color: #00466a;">Your Order has been Shipped!</h2>
          <p>Dear ${order.customerDetails.first_name},</p>
          <p>Great news! Your order <strong>${order.orderId}</strong> has been shipped.</p>
          <p><strong>AWB Number:</strong> ${awbNumber || 'N/A'}</p>
          
          ${awbNumber && awbNumber !== 'N/A' ? `
          <p>You can track your order status directly on Shiprocket by clicking the link below:</p>
          <p style="text-align: center; margin: 20px 0;">
            <a href="${trackingUrl}" target="_blank" style="background-color: #00466a; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Track Your Order</a>
          </p>
          ` : ''}

          <p>Please note it may take a few hours for tracking details to be available.</p>
          <p>Thank you for shopping with us!</p>
          <p>Team ShopHeed</p>
        </div>
      </body>
    </html>
  `;
};

const orderCancelledTemplate = (order) => {
    return `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <h2 style="color: #d9534f;">Order Cancelled</h2>
          <p>Dear ${order.customerDetails.first_name},</p>
          <p>Your order <strong>${order.orderId}</strong> has been cancelled as per your request or due to unforeseen circumstances.</p>
          <p>If you have already paid, your refund will be processed within <strong>2 to 3 working days</strong>.</p>
          <p>We hope to serve you again in the future.</p>
          <p>Team ShopHeed</p>
        </div>
      </body>
    </html>
  `;
};

const returnUpdateTemplate = (order, status) => {
    return `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <h2 style="color: #00466a;">Return/Exchange Status Update</h2>
          <p>Dear ${order.customerDetails.first_name},</p>
          <p>The status of your return/exchange for order <strong>${order.orderId}</strong> has been updated to: <strong>${status}</strong>.</p>
          <p>We are processing your request and will keep you updated.</p>
          <p>Team ShopHeed</p>
        </div>
      </body>
    </html>
  `;
};

const updateOrderEmail = async (req, res) => {
    try {
        const { orderDataById, status, orderStatus } = req.body;
        console.log(`Sending Email for Status: ${orderStatus}, Invoice: ${status === "Shipped" ? "Yes" : "No"}`);

        if (!orderDataById || !orderDataById.customerDetails) {
            console.error("Missing order data for email");
            return res.status(400).json({ success: false, message: "Invalid order data" });
        }

        const { email, first_name } = orderDataById.customerDetails;
        const orderId = orderDataById.orderId || orderDataById._id;

        let subject = "";
        let htmlContent = "";
        let attachments = [];

        const normalizedStatus = orderStatus ? orderStatus.toLowerCase() : "";

        if (normalizedStatus === "shipped") {
            subject = `Your Order ${orderId} has been Shipped!`;
            const awb = orderDataById.forwardAwb || "N/A";

            htmlContent = orderShippedTemplate(orderDataById, awb);

            try {
                const pdfBuffer = await generateInvoicePDF(orderDataById);
                attachments = [{
                    filename: `Invoice_${orderId}.pdf`,
                    content: pdfBuffer
                }];
                console.log("Invoice generated and attached (Buffer).");
            } catch (err) {
                console.error("Error generating invoice PDF for email:", err);
            }

        } else if (normalizedStatus === "cancelled") {
            subject = `Order Cancelled: ${orderId}`;
            htmlContent = orderCancelledTemplate(orderDataById);
        } else if (normalizedStatus === "refunded") {
            // Basic refund template logic
            subject = `Refund Processed: ${orderId}`;
            htmlContent = `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Refund Processed</h2>
                    <p>Hi ${first_name},</p>
                    <p>We have processed the refund for your order <strong>${orderId}</strong>.</p>
                    <p>It may take 5-7 business days to reflect in your account.</p>
                </div>
            `;
        } else {
            // Default update - using return update or generic
            subject = `Order Update: ${orderId}`;
            htmlContent = returnUpdateTemplate(orderDataById, orderStatus);
        }

        const mailOptions = {
            from: process.env.SMTP_FROM || `"ShopHeed" <${process.env.SMTP_USER}>`,
            to: email,
            subject: subject,
            html: htmlContent,
            attachments: attachments
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                return res.status(500).json({ success: false, message: "Error sending email", error: error.message });
            } else {
                console.log(`Email sent: ${info.messageId}`);
                return res.status(200).json({ success: true, message: "Email sent successfully" });
            }
        });

    } catch (error) {
        console.error("Controller Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

module.exports = {
    htmlContentForMailTemplate,
    contactUs,
    EmailSendComponent,
    BulkEnquiry,
    returnOrExchangeMail,
    orderConfirmationTemplate,
    adminNewOrderTemplate,
    orderShippedTemplate,
    orderCancelledTemplate,
    returnUpdateTemplate,
    updateOrderEmail // Added
};
