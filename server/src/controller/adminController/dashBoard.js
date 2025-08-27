const userModel = require("../../Model/userModel");
const productModel = require("../../Model/mainProductModel");
const orderModel = require("../../Model/orderModel");
const transactionModel = require("../../Model/paymentModel");

const adminPannel = async function (req, res) {
  const userID = req._id;
  if (!userID) {
    return res.status(404).json({ success: false, message: "User ID is missing" });
  }

  const getCurrentMonthDateRange = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { firstDay, lastDay };
  };

  const { firstDay, lastDay } = getCurrentMonthDateRange();

  try {
    const userCountPromise = userModel.countDocuments({ role: "user" });
    const productCountPromise = productModel.countDocuments();
    const orderCountPromise = orderModel.countDocuments();
    const transactionCountPromise = transactionModel.countDocuments();

    const userCountThisMonthPromise = userModel.countDocuments({
      role: "user",
      createdAt: { $gte: firstDay, $lte: lastDay }
    });
    const productCountThisMonthPromise = productModel.countDocuments({
      createdAt: { $gte: firstDay, $lte: lastDay }
    });
    const orderCountThisMonthPromise = orderModel.countDocuments({
      createdAt: { $gte: firstDay, $lte: lastDay }
    });
    const transactionCountThisMonthPromise = transactionModel.countDocuments({
      createdAt: { $gte: firstDay, $lte: lastDay }
    });

    const [
      userCount,
      productCount,
      orderCount,
      transactionCount,
      userCountThisMonth,
      productCountThisMonth,
      orderCountThisMonth,
      transactionCountThisMonth
    ] = await Promise.all([
      userCountPromise,
      productCountPromise,
      orderCountPromise,
      transactionCountPromise,
      userCountThisMonthPromise,
      productCountThisMonthPromise,
      orderCountThisMonthPromise,
      transactionCountThisMonthPromise
    ]);

   
    const TopDashboardCardsData = [
      {
        id: "1",
        type: "Transaction",
        bgColor: "bg-warning",
        count: transactionCountThisMonth,
        total: transactionCount,
        icon: "Navigation",
        className: "font-warning"
      },
      {
        id: "2",
        type: "Products",
        bgColor: "bg-secondary",
        count: productCountThisMonth,
        total: productCount,
        icon: "Box",
        className: "font-secondary",
      
      },
      {
        id: "3",
        type: "Orders",
        bgColor: "bg-primary",
        count: orderCountThisMonth,
        total: orderCount,
        icon: "MessageSquare",
        className: "font-primary",
    
      },
      {
        id: "4",
        type: " Users",
        bgColor: "bg-danger",
        count: userCountThisMonth,
        total: userCount,
        icon: "Users",
        className: "font-danger",
       
      }
    ];
    

    return res.status(200).json({
      success: true,
      message: "Successful",
      userCount,
      productCount,
      orderCount,
      transactionCount,
      TopDashboardCardsData: TopDashboardCardsData
    });

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { adminPannel };
