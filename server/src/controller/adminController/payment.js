const payment = require("../../Model/paymentModel");

const getAllPayment = async function (req, res) {
    try {
        const status = req.query.status;
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;
        let query = {};

        if (status !== "null") {
            query.paymentStatus = status; 
        }

        // Add date range filtering
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)) 
            };
        }

        const getAll = await payment.find(query).populate("orderId").sort({ createdAt: -1 });

        // Calculate total amount
        const totalAmount = getAll.reduce((sum, payment) => sum + payment.amount, 0);

        return res.status(200).json({
            status: true,
            message: "Successfully fetched payments",
            data: getAll,
            totalAmount, 
            count: getAll.length
        });
    } catch (error) {
        
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = { getAllPayment };
