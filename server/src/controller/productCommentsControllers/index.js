const mainProductModel = require("../../Model/mainProductModel")
const userModel = require("../../Model/userModel")

const createComments = async function (req, res) {
  try {
    const product = await mainProductModel.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { text, rating } = req.body;
    const user = await userModel.findById(req._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const comment = {
      text,
      user: req._id,
      rating
    };

    product.comments.push(comment);
    await product.save();

    res.status(201).json({ message: 'Comment added', comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getComments = async function (req, res) {
  try {

    const product = await mainProductModel.findById(req.params.productId).populate('comments.user').sort({ createdAt: -1 });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.comments.sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


const checkReviewInListing = async function (req, res) {
  try {
    const productId = req.params.productId
   
   
    const check = await mainProductModel.findOne({ _id: productId, "comments.user": req._id })
    if (check) {
      return res.status(200).json({ success: false, message: "You have already given a review for this listing", reviewIdUser: req._id });
    }
    return res.status(200).json({ success: true, message: "You haven't given a review for this listing yet" });
  } catch (error) {

    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}


const updateReview = async function (req, res) {
  try {
    const productId = req.params.productId;
    const { rating, text, userId } = req.body;

    
    if (userId !== req._id) {
      return res.status(403).json({ status: false, message: "You are not authorized to perform this task" });
    }

    
    const existingReview = await mainProductModel.findOne({
      _id: productId,
      "comments.user": userId
    });

    if (!existingReview) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    
    await mainProductModel.updateOne(
      { _id: productId, "comments.user": userId },
      {
        $set: {
          "comments.$.rating": rating,
          "comments.$.text": text,
          "comments.$.updatedAt": new Date() 
        }
      }
    );
    return res.status(200).json({ success: true, message: "Review updated successfully" });
  } catch (error) {
  
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};



const deleteReview = async function (req, res) {
  try {
    
    const commentId = req.params.commentId;
    const productId = req.params.productId;
   

    if (!commentId) {
      return res.status(400).json({ success: false, message: "Comment ID  are required" });
    }

    const existingProduct = await mainProductModel.findById(productId);
   

    if (!existingProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const commentIndex = existingProduct.comments.findIndex(comment => comment._id.toString() === commentId);

    if (commentIndex === -1) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

   
    existingProduct.comments.splice(commentIndex, 1);

   
    await existingProduct.save();

    return res.status(200).json({ success: true, message: "Comment deleted successfully from the product" });

  } catch (error) {
   
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

const getCommentByProductId = async function(req,res){
try {
  const userId = req._id;
  const productId = req.params.id
  if(!userId){
    return res.status(400).json({success:false, message:"User is missing"})
  }
const product = await mainProductModel.findById(productId).select("comments").sort({ createdAt: -1 })
  return res.status(200).json({success:false , data:product  , message:"Fetch comments by product"})

  
} catch (error) {
 
  return res.status(500).json({success:false , message:"Internal server error"})
}


}


module.exports = { createComments, getComments, checkReviewInListing, updateReview, deleteReview ,getCommentByProductId }