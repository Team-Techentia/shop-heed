const Cart = require('../../Model/cartModel');
const Product = require('../../Model/productModel'); 

const AddToCart = async (req, res) => {
    const {  productId, variantId, quantity } = req.body;
       const userId = req._id
    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [], totalPrice: 0 });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        
        const variant = product.variants.id(variantId);
        if (!variant) {
            return res.status(404).json({ success: false, message: "Variant not found" });
        }

        const itemIndex = cart.items.findIndex(item => item.variantId.toString() === variantId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ productId, variantId, quantity });
        }

        const itemsWithProductDetails = await Promise.all(cart.items.map(async item => {
            const product = await Product.findById(item.productId);
            const variant = product.variants.id(item.variantId);
            return { ...item._doc, product, variant };
        }));



        cart.totalPrice = itemsWithProductDetails.reduce((total, item) => {
            
           
            const variantPrice = Math.floor(parseFloat(item.product.price-(item.product.price * item.product.discount)/100));

            const itemQuantity = parseInt(item.quantity, 10);

            if (isNaN(variantPrice) || isNaN(itemQuantity)) {
                throw new Error('Invalid price or quantity');
            }

            return total + (variantPrice * itemQuantity);
        }, 0);

     

        await cart.save();

        res.status(200).json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const getCart =  async (req, res) => {
    try {
        const userId = req._id
        const cart = await Cart.findOne({ userId }).populate('items.productId').sort({ createdAt: -1 });
       return res.status(200).json({ success: true, cart });
    } catch (error) {
       return res.status(500).json({ success: false, message: error.message });
    }
};


const removeFromCart = async (req, res) => {
    try {
      const {  itemId } = req.params;
  
      const userId = req._id
      const cart = await Cart.findOne({ userId }).populate('items.productId');
  
      if (!cart) {
        return res.status(404).json({ success: false, message: 'Cart not found' });
      }
  
     
      const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
  
      if (itemIndex === -1) {
        return res.status(404).json({ success: false, message: 'Item not found in cart' });
      }
  
     
      const removedItem = cart.items[itemIndex];
     
      cart.items.splice(itemIndex, 1);
  
     
      const itemPrice = removedItem.productId.price - (removedItem.productId.price * removedItem.productId.discount / 100);
      cart.totalPrice -= itemPrice * removedItem.quantity;
  
    
      await cart.save();
  
      return res.status(200).json({ success: true, cart });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };


  const deteteCart =  async (req, res) => {
    
    try {
        const userId = req._id
        await Cart.findOneAndDelete({ userId});
       return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {getCart ,AddToCart , removeFromCart , deteteCart};
