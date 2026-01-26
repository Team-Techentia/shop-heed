const PDFDocument = require("pdfkit");

const generateInvoicePDF = (orderData) => {
    return new Promise((resolve, reject) => {
        try {
            console.log("Starting Invoice Generation for Order:", orderData ? orderData.orderId : "NO DATA");
            if (!orderData || !orderData.customerDetails) {
                throw new Error("Invalid Order Data: Missing customerDetails");
            }

            const doc = new PDFDocument({ margin: 50 });
            const buffers = [];

            doc.on("data", (buffer) => buffers.push(buffer));
            doc.on("end", () => {
                console.log("Invoice Generation Completed. Buffer Size:", Buffer.concat(buffers).length);
                resolve(Buffer.concat(buffers));
            });
            doc.on("error", (err) => {
                console.error("PDFKit Error:", err);
                reject(err);
            });

            // --- Helper Functions ---
            const formatDate = (dateString) => {
                if (!dateString) return "N/A";
                const date = new Date(dateString);
                if (isNaN(date.getTime())) return "Invalid Date";
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
            };

            console.log("Adding Header...");
            // --- Invoice Layout (Ported from Client-Side) ---

            // Header
            doc
                .fontSize(20)
                .font("Helvetica-Bold")
                .text("Tax Invoice", 50, 50);

            doc.moveTo(50, 80).lineTo(550, 80).stroke();

            const customer = orderData.customerDetails;
            const isDelhi = customer.state && customer.state.toLowerCase() === "delhi";

            console.log("Generating Invoice Numbers...");
            const invoiceNumber = orderData.invoiceNumber || `INV-${orderData.orderId}`;
            const invoiceDate = new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });
            const orderDate = formatDate(orderData.createdAt);

            // Right Side Info
            doc
                .fontSize(9)
                .font("Helvetica-Bold")
                .text("GSTIN Number: 07BGUPB9136M1ZR", 350, 100)
                .text(`Invoice Number: ${invoiceNumber}`, 350, 115)
                .text(`Order Id: ${orderData.orderId}`, 350, 130)
                .text(`Invoice Date: ${invoiceDate}`, 350, 145)
                .text(`Order Date: ${orderDate}`, 350, 160)
                .text(
                    `Nature of Transaction: ${isDelhi ? "Intra-State" : "Inter-State"}`,
                    350,
                    175
                )
                .text(`Place of Supply: ${customer.state || 'N/A'}`, 350, 190)
                .text("Nature of Supply: Goods", 350, 205);

            // Left Side Info (Bill From / Ship From)
            doc.text("Bill From:", 50, 100);
            doc.fontSize(11).text("BRANDS.IN", 50, 115);
            doc
                .fontSize(9)
                .font("Helvetica")
                .text("A-39, West Patel Nagar, New Delhi-110008", 50, 130)
                .text("New delhi, delhi-110008", 50, 145);

            doc.font("Helvetica-Bold").fontSize(10).text("Ship From:", 50, 165);
            doc.font("Helvetica").fontSize(9).text("BRANDS.IN", 50, 180);
            doc.text("A-39, West Patel Nagar, New Delhi-110008", 50, 195);
            doc.text("New delhi, delhi-110008", 50, 210);

            console.log("Adding Customer Info...");
            // Bill To
            doc.font("Helvetica-Bold").fontSize(10).text("Bill To / Ship To:", 50, 235);
            doc
                .font("Helvetica")
                .fontSize(9)
                .text(`${customer.first_name || ''} ${customer.last_name || ''}`, 50, 250);

            // Address wrapping
            doc.text(`${customer.address || ''}`, 50, 265, { width: 250 });
            doc.text(`${customer.city || ''}, ${customer.state || ''}`, 50, doc.y);
            doc.text(`${customer.country || 'India'} - ${customer.pincode || ''}`, 50, doc.y);

            // Table Header
            let yPos = 350;
            doc.rect(40, yPos - 10, 520, 20).fill("#F5F5F5");
            doc.fillColor("black");

            doc.font("Helvetica-Bold").fontSize(8);
            doc.text("Qty", 45, yPos - 5);
            doc.text("Product", 80, yPos - 5);
            doc.text("Gross", 250, yPos - 5);
            doc.text("Taxable", 300, yPos - 5);
            doc.text("CGST", 350, yPos - 5);
            doc.text("SGST", 400, yPos - 5);
            doc.text("IGST", 450, yPos - 5);
            doc.text("Total", 500, yPos - 5);

            yPos += 20;

            let totalGross = 0;
            let totalTaxable = 0;
            let totalCGST = 0;
            let totalSGST = 0;
            let totalIGST = 0;
            let grandTotal = 0;

            console.log("Adding Items...");

            // Table Items
            if (orderData.items && orderData.items.length > 0) {
                orderData.items.forEach((item) => {
                    const productTitle = item.title || "Product";
                    const truncatedTitle =
                        productTitle.length > 30
                            ? productTitle.substring(0, 30) + "..."
                            : productTitle;

                    doc.font("Helvetica-Bold").fontSize(8);
                    doc.text((item.quantity || 0).toString(), 45, yPos);
                    doc.text(truncatedTitle, 80, yPos);

                    doc.font("Helvetica").fontSize(7);
                    doc.text(
                        `(${String(item.size || "N/A").toUpperCase()}) - SKU: ${item.sku || "N/A"
                        }`,
                        80,
                        yPos + 10
                    );

                    const grossAmount = item.totalPrice || item.finalPrice || 0;
                    let taxableAmount = 0;
                    let cgst = 0;
                    let sgst = 0;
                    let igst = 0;

                    if (isDelhi) {
                        if (grossAmount <= 2500) {
                            taxableAmount = Number(((grossAmount * 100) / 105).toFixed(2));
                            const totalGst = Number((grossAmount - taxableAmount).toFixed(2));
                            cgst = Number((totalGst / 2).toFixed(2));
                            sgst = Number((totalGst / 2).toFixed(2));
                        } else {
                            taxableAmount = Number(((grossAmount * 100) / 112).toFixed(2));
                            const totalGst = Number((grossAmount - taxableAmount).toFixed(2));
                            cgst = Number((totalGst / 2).toFixed(2));
                            sgst = Number((totalGst / 2).toFixed(2));
                        }
                    } else {
                        if (grossAmount <= 2500) {
                            taxableAmount = Number(((grossAmount * 100) / 105).toFixed(2));
                            igst = Number((grossAmount - taxableAmount).toFixed(2));
                        } else {
                            taxableAmount = Number(((grossAmount * 100) / 112).toFixed(2));
                            igst = Number((grossAmount - taxableAmount).toFixed(2));
                        }
                    }

                    totalGross += grossAmount;
                    totalTaxable += taxableAmount;
                    totalCGST += cgst;
                    totalSGST += sgst;
                    totalIGST += igst;
                    grandTotal += grossAmount;

                    doc.fontSize(8);
                    doc.text(grossAmount.toFixed(2), 250, yPos);
                    doc.text(taxableAmount.toFixed(2), 300, yPos);
                    doc.text(cgst > 0 ? cgst.toFixed(2) : "", 350, yPos);
                    doc.text(sgst > 0 ? sgst.toFixed(2) : "", 400, yPos);
                    doc.text(igst > 0 ? igst.toFixed(2) : "", 450, yPos);
                    doc.text(grossAmount.toFixed(2), 500, yPos);

                    yPos += 30; // Row height
                });
            }

            console.log("Adding Totals...");
            doc.moveTo(40, yPos).lineTo(560, yPos).stroke();
            yPos += 10;

            // Totals
            doc.font("Helvetica-Bold").fontSize(8);
            doc.text("TOTAL", 45, yPos);
            doc.text(totalGross.toFixed(2), 250, yPos);
            doc.text(totalTaxable.toFixed(2), 300, yPos);
            if (totalCGST > 0) doc.text(totalCGST.toFixed(2), 350, yPos);
            if (totalSGST > 0) doc.text(totalSGST.toFixed(2), 400, yPos);
            if (totalIGST > 0) doc.text(totalIGST.toFixed(2), 450, yPos);
            doc.text(grandTotal.toFixed(2), 500, yPos);

            yPos += 20;
            doc.moveTo(40, yPos).lineTo(560, yPos).stroke();

            // Footer / Declaration
            yPos += 30;
            doc.fontSize(11).text("BRANDS.IN", 50, yPos);
            yPos += 20;
            doc.fontSize(9).text("DECLARATION", 50, yPos);
            yPos += 15;
            doc.font("Helvetica").fontSize(7).text(
                "The goods sold as part of this shipment are intended for end-user consumption and are not for retail sale",
                50,
                yPos
            );
            yPos += 15;
            doc.text(
                "Reg Address: BRANDS.IN, A-39, WEST PATEL NAGAR, New delhi, DELHI-110008",
                50,
                yPos
            );
            yPos += 15;
            doc.text(
                "This is a computer generated bill, does not require any physical signature.",
                50,
                yPos
            );

            doc.font("Helvetica-Bold").fontSize(14).text("HEED", 450, yPos);

            console.log("Finalizing PDF...");
            doc.end();
        } catch (error) {
            console.error("Synchronous Error in Invoice Gen:", error);
            reject(error);
        }
    });
};

module.exports = { generateInvoicePDF };
