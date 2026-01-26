const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

async function downloadImage(url, outputPath) {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  fs.writeFileSync(outputPath, response.data);
}

async function createInvoice(invoice) {
  const doc = new PDFDocument();
  const urlPath = `invoice_${invoice.orderNumber}_${invoice.invoiceNumber}_${
    new Date().toISOString().split("T")[0]
  }.pdf`;
  const invoicePath = path.join(__dirname, "../../../invoices", urlPath);

  if (!fs.existsSync(path.join(__dirname, "../../../invoices"))) {
    fs.mkdirSync(path.join(__dirname, "../../../invoices"));
  }
  const logoUrl = "https://shopheed.com/assets/images/icon/logo.png";

  const logoPath = path.join(__dirname, "../../../invoices/logo.png");
  const qrCode = path.join(__dirname, "../../../invoices/shopheed.png");


  await downloadImage(logoUrl, logoPath);

  doc.pipe(fs.createWriteStream(invoicePath));

  doc.image(logoPath, 50, 40, { width: 100 });
  doc.image(qrCode, 50, 75, { width: 100 });

  doc.font(path.join(__dirname, "../../../fonts", "DejaVuSans.ttf"));
  doc.fontSize(20).text("Invoice", 330, 40);

  doc
    .rect(320, 35, 220, 105)
    .stroke()
    .fontSize(10)
    .text(`Invoice Number: ${invoice.invoiceNumber}`, 330, 70)
    .text(` Order Id: ${invoice.orderNumber}`, 330, 85)
    .text(`Invoice Date: ${invoice.invoiceDate}`, 330, 100)
    .text(`Total Amount: ₹${invoice.totalAmount}`, 330, 115);
  doc
    .fontSize(10)
    .text("From:", 50, 200)
    .text(invoice.from.name, 50, 215)
    .text(invoice.from.address, 50, 230)
    .text(invoice.from.email, 50, 245)
    .text("Shipping Address:", 50, 280)
    .text(invoice.to.name, 50, 295)
    .text(invoice.to.address, 50, 310)
    .text(invoice.to.email, 50, 325)
    .text(invoice.to.mobile, 50, 340);
    doc
    .rect(50, 375, 500, 25)
    .fillAndStroke("#f0f0f0", "#000")
    .stroke()
    .fillColor("#000")
    .fontSize(10)
    .text("S.No", 60, 382)
    .text("Product", 95, 382)
    .text("Rate/Price", 350, 382)
    .text("Qty", 420, 382)
    .text("Sub Total", 480, 382);
  
  doc.moveTo(50, 400).lineTo(550, 400).stroke();
  let yx
  invoice.items.forEach((item, i) => {
   
    const y = 415 + i * 60; 
    yx = y;
    
  
    doc.rect(50, y - 5, 500, 50).stroke(); 
    doc
      .text(item.sno, 60, y)
      .text(item.Product.slice(0, 48), 95, y)
      .text(`ProductId: ${item.productId}`, 95, y + 14)
      .text(`VariantId: ${item.variantId}`, 95, y + 28) 
      .text(`₹${item.rate}`, 350, y)
      .text(`${item.quantity}`, 420, y)
      .text(`₹${item.subTotal.toFixed(2)}`, 480, y);
  });
  
  doc.moveTo(50, 415 + invoice.items.length * 60).stroke();

  doc.rect(440,  yx+51, 110, 20).stroke(); 
 
  doc
    .fontSize(10)
    .text(`Total: ₹${invoice.totalAmount.toFixed(2)}`, 450, yx+55);



  doc.end();

  // const host = "http://localhost:3110/";
  const host = "https://shopheed.com/";
  // const pdfLink = `${host}/${urlPath}`;
  const pdfLink = `${host}/static/${urlPath}`;

  
  return pdfLink;
}



module.exports = { createInvoice };
