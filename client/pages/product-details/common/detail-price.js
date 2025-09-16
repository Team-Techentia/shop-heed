import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Input,
  Media,
  Modal,
  ModalBody,
  ModalHeader,
} from "reactstrap";
import CartContext from "../../../helpers/cart";
import { useRouter } from "next/router";
import sizeChart1 from "../../../public/assets/images/size1.png";
import sizeChart2 from "../../../public/assets/images/size2.jpg";
import { colorData } from "../../../data/colorData";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import toast from "react-hot-toast";
import MarkdownRenderer from "../../../components/MarkDown";
import { discountCount, getDiscountPercentage } from "../../../services/script";
import { ListItem } from "@mui/material";
import Api from "../../../components/Api";
import axios from "axios";

const DetailsWithPrice = ({
  item,
  stickyClass,
  sameProductData,
  stock,
  quantity,
  setQuantity,
}) => {
  const product = item;
  const context = useContext(CartContext);
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState(null);
  const [uniqueSizes, setUniqueSizes] = useState([]);
  const [checkEstimateTime, setCheckEstimateTime] = useState('');
  const [expectDelivery, setExpectDelivery] = useState('');
  const [expectDeliveryError, setExpectDeliveryError] = useState('');
  const [isCheckingDelivery, setIsCheckingDelivery] = useState(false);
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [open, setOpen] = useState("");
  const togglee = (id) => {
    if (open === id) {
      setOpen();
    } else {
      setOpen(id);
    }
  };

  const changeInc = () => {
    if (product.quantity <= quantity) {
      return;
    }
    setQuantity((value) => value + 1);
  };

  const changeless = () => {
    if (quantity > 1) {
      setQuantity((value) => value - 1);
    }
  };

  let RatingStars = [];
  let rating = 5;
  for (var i = 0; i < rating; i++) {
    RatingStars.push(
      <i className="fa fa-star" style={{ color: "#ffa200" }} key={i}></i>
    );
  }
  const allSizes = ["m", "l", "xl", "xxl"];

  useEffect(() => {
    const filterSize = sameProductData.filter((data) => {
      return data.color === product.color;
    });
    console.log(filterSize);
    setUniqueSizes(filterSize);

    if (filterSize.length === 1) {
      setSelectedSize(filterSize[0].size);
    } else if (filterSize.length > 1 && selectedSize === null) {
      setSelectedSize(filterSize[0].size);
    }
  }, [product, sameProductData]);

  const uniqueColors = sameProductData
    .filter(
      (data, index, self) =>
        index === self.findIndex((t) => t.color === data.color)
    )
    .map((data) => ({
      color: data.color,
      image: data.image[0],
      colorName: colorData[data.color],
    }));

  console.log(uniqueColors);

  const handleSizeClick = (selectedProduct) => {
    setSelectedSize(selectedProduct.size);
    if (selectedProduct) {
      router.push(
        `/product-details/${selectedProduct.title
          .toLowerCase()
          .replaceAll(" ", "-")}/${selectedProduct._id}`
      );
    }
  };

  const handleColorClick = (color) => {
    console.log(color);
    console.log(product.size);
    console.log(sameProductData);
    const selectedProduct = sameProductData.find((data) => {
      return data.color == color;
    });
    console.log(selectedProduct);
    if (selectedProduct) {
      router.push(
        `/product-details/${selectedProduct.title
          .toLowerCase()
          .replaceAll(" ", "-")}/${selectedProduct._id}`
      );
    }
  };
  
  console.log("discountCount", getDiscountPercentage(product.price, product.finalPrice));

  // Updated static checkHandle function
  const checkHandle = async () => { 
    // Reset states
    setExpectDelivery('');
    setExpectDeliveryError('');
    
    // Validate pincode
    if (!checkEstimateTime || checkEstimateTime.length < 6) {
      setExpectDeliveryError('Please enter a valid 6-digit pincode');
      return;
    }
    
    setIsCheckingDelivery(true);
    
    try {
      // Simulate API delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Calculate delivery date (3 days from today)
      const today = new Date();
      const deliveryDate = new Date(today);
      deliveryDate.setDate(today.getDate() + 3);
      
      const formattedDate = deliveryDate.toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      
      // Always set successful delivery
      setExpectDelivery(formattedDate);
      
      console.log("Static delivery date===>", formattedDate);
      
    } catch (e) {
      setExpectDeliveryError('Unable to check delivery. Please try again.');
      console.log("error--->", e);
    } finally {
      setIsCheckingDelivery(false);
    }
  };

  return (
    <>
      <div className={`product-right ${stickyClass}`}>
        {/* Product Title */}
        <h2 className="product-title"> {product.title} </h2>
        
        {/* Price Section - Redesigned */}
        <div className="price-section">
          <div className="d-flex align-items-center">
            <h3 className="current-price">₹{product.finalPrice}</h3>
            {parseInt(product.price) > parseInt(product.finalPrice) && (
              <>
                <h4 className="original-price">
                  <del>₹{product.price}</del>
                </h4>
                <div className="discount-badge">
                  {getDiscountPercentage(product.price, product.finalPrice)} OFF
                </div>
              </>
            )}
          </div>
          <div className="free-shipping-badge">
            <i className="fa fa-truck me-1"></i> FREE SHIPPING
          </div>
        </div>

        {/* Rating */}
        <div className="rating-section mb-3">
          <div className="stars">
           
          </div>

        </div>

        {stock === "Out of Stock" ? (
          <div className="out-of-stock-banner">
            <strong>Out Of Stock</strong>
          </div>
        ) : (
          <>
            {sameProductData && sameProductData.length >= 1 && (
              <>
                <hr className="section-divider" />
                
                {/* Size Selection */}
                {product.category === "shirt" && (
                  <div className="selection-header">
                    <span>SELECT SIZE</span>
                    <button
                      className="size-chart-link"
                      onClick={toggle}
                    >
                      Size Chart
                    </button>
                  </div>
                )}
                
                <Modal
                  isOpen={modal}
                  toggle={toggle}
                  centered
                  className="size-chart-modal"
                >
                  <ModalHeader toggle={toggle}>Size Guide</ModalHeader>
                  <ModalBody>
                    <Media
                      src={sizeChart2.src}
                      alt="size"
                      className="img-fluid mb-3"
                    />
                    <Media
                      src={sizeChart1.src}
                      alt="size"
                      className="img-fluid"
                    />
                  </ModalBody>
                </Modal>
                
                <div className="size-selector mt-2">
                  {allSizes.map((size) => {
                    const matchedProduct = uniqueSizes.find(
                      (data) => data.size === size
                    );
                    const isAvailable = !!matchedProduct;

                    return (
                      <div
                        key={size}
                        className={`size-option ${!isAvailable ? 'unavailable' : ''} ${product.size === size ? 'selected' : ''}`}
                        onClick={() =>
                          isAvailable && handleSizeClick(matchedProduct)
                        }
                      >
                        {size.toUpperCase()}
                      </div>
                    );
                  })}
                </div>
                
                {/* Color Selection */}
                <div className="selection-header mt-3">
                  <span>SELECT COLOUR</span>
                </div>
                
                {uniqueColors && (
                  <div className="color-selector mt-2">
                    {uniqueColors.map((data, i) => (
                      <div
                        key={i}
                        className={`color-option ${product.color === data.color ? 'selected' : ''}`}
                        onClick={() => handleColorClick(data.color)}
                        title={data.colorName}
                      >
                        <div className="color-thumbnail">
                          <img src={data.image} alt={data.colorName} />
                        </div>
                        <div className="color-name">{data.colorName}</div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Quantity Selector */}
            <div className="quantity-section">
              <div className="selection-header">
                <span>QUANTITY</span>
              </div>
              <div className="quantity-selector">
                <button className="quantity-btn" onClick={changeless}>
                  <RemoveIcon />
                </button>
                <div className="quantity-display">{quantity}</div>
                <button className="quantity-btn" onClick={changeInc}>
                  <AddIcon />
                </button>
              </div>
              <div className="stock-status">
                <i className="fa fa-check-circle me-1"></i> In Stock
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons mt-4">
              <button
                className="btn btn-add-to-cart"
                onClick={() => {
                  context.addToCart(product, product._id, quantity);
                }}
              >
                <i className="fa fa-shopping-cart me-2"></i> Add to Cart
              </button>
              
              <button
  className="btn btn-buy-now"
  onClick={() => {
    // Add the current product to cart before checkout
    context.addToCart(product, product._id, quantity);
    
    // Then redirect to checkout
    router.push("/page/account/checkout");
  }}
  style={{
    flex: 1,
    background: '#8B4513', // SaddleBrown
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    fontWeight: '600',
    transition: 'all 0.2s',
  }}
  onMouseOver={(e) => {
    e.target.style.background = '#A0522D'; // Darker brown on hover (Sienna)
  }}
  onMouseOut={(e) => {
    e.target.style.background = '#8B4513'; // Original brown
  }}
>
  <i className="fa fa-bolt me-2"></i> Buy Now
</button>
            </div>
          </>
        )}

        {/* Key Specifications */}
        <div className="key-specifications">
          <h5>Key Features</h5>
          {product &&
            product.specificationSingleLine &&
            product.specificationSingleLine.slice(0, 5).map((data, index) => (
              <div key={index} className="spec-item">
                <i className="fa fa-check spec-icon"></i>
                <span>{data}</span>
              </div>
            ))}
        </div>

        {/* Product Details Accordion */}
        <div className="product-details-accordion mt-4">
          <Accordion flush open={open} toggle={togglee}>
            <AccordionItem>
              <AccordionHeader targetId={2}>
                <i className="fa fa-file-text-o me-2"></i> PRODUCT DESCRIPTION
              </AccordionHeader>
              <AccordionBody accordionId={2}>
                <div>
                  {product && product.description && (
                    <MarkdownRenderer markdown={product.description} />
                  )}
                </div>
                <br></br>
                <div>
                  <h5>Specification</h5>
                  {product && product.specificationArray && product.specificationArray.length > 0 && product.specificationArray.map((item, index) => {
                    return <p key={index}><span style={{fontWeight: 500}}>{item.question}: </span>{item.answer}</p>
                  }) 
                  }
                </div>
              </AccordionBody>
            </AccordionItem>

            <AccordionItem>
              <AccordionHeader targetId={3}>
                <i className="fa fa-info-circle me-2"></i> MORE INFORMATION
              </AccordionHeader>
              <AccordionBody accordionId={3}>
                <div className="info-item">
                  <strong>Manufactured & Marketed by:</strong>
                  <p>BRANDS.IN</p>
                  <p>A-39, West Patel Nagar, New Delhi – 110008</p>
                </div>
                <div className="info-item">
                  <strong>Country of Origin:</strong>
                  <p>India</p>
                </div>
              </AccordionBody>
            </AccordionItem>
            
            <AccordionItem>
              <AccordionHeader targetId={4}>
                <i className="fa fa-exchange me-2"></i> RETURN AND EXCHANGE
              </AccordionHeader>
              <AccordionBody accordionId={4}>
                <ul className="return-policy-list">
                  <li><i className="fa fa-check-circle text-success me-2"></i> Hassle-free return within 4 days - no questions asked.</li>
                  <li><i className="fa fa-check-circle text-success me-2"></i> Issues with defective, incorrect and damaged product should be reported within 24 hours of delivery.</li>
                  <li><i className="fa fa-times-circle text-danger me-2"></i> For hygiene, Inner Wear & Accessories are not eligible for Return or Exchanges.</li>
                </ul>
                <div className="return-links">
                  <p>
                    For more details on our Return and Exchange Policies, 
                    <Link href={"/return_and_exchange"}> Click here</Link>
                  </p>
                  <p>
                    To place a Return / Exchange Request, 
                    <Link href={"/contact-us"}> Click here</Link>
                  </p>
                </div>
              </AccordionBody>
            </AccordionItem>
          </Accordion>
          
          {/* Delivery Estimate Section */}
          <div className="delivery-estimate-section mt-4">
            <h6>
              <i className="fa fa-truck me-2"></i> Enter Pincode
            </h6>
            <div className="pincode-input-group">
              <input
                type="number"
                className="form-control pincode-input"
                placeholder="Enter 6-digit pincode"
                maxLength={6}
                value={checkEstimateTime}
                onChange={(e) => {
                  const value = e.target.value.slice(0, 6);
                  setCheckEstimateTime(value);
                  if (expectDelivery || expectDeliveryError) {
                    setExpectDelivery('');
                    setExpectDeliveryError('');
                  }
                }}
              />
              <button 
                type="button" 
                className="btn btn-check-delivery"
                onClick={checkHandle}
                disabled={isCheckingDelivery}
              >
                {isCheckingDelivery ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                    Checking...
                  </>
                ) : 'Check'}
              </button>
            </div>
            
            {expectDelivery && (
              <div className="delivery-success mt-3">
                <div className="d-flex align-items-center">
                  <i className="fa fa-check-circle text-success me-2"></i>
                  <div>
                    <div className="delivery-text">Expected delivery by</div>
                    <div className="delivery-date">{expectDelivery}</div>
                  </div>
                </div>
              </div>
            )}
            
            {expectDeliveryError && (
              <div className="delivery-error mt-2">
                <i className="fa fa-exclamation-circle me-2"></i>
                {expectDeliveryError}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .product-title {
          font-size: 24px;
          font-weight: 600;
          color: #2d2d2d;
          margin-bottom: 15px;
        }
        
        .price-section {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 15px;
        }
        
        .current-price {
          font-size: 28px;
          font-weight: 700;
          color: #2d2d2d;
          margin-right: 12px;
          margin-bottom: 0;
        }
        
        .original-price {
          font-size: 18px;
          color: #6c757d;
          margin-right: 12px;
          margin-bottom: 0;
        }
        
        .discount-badge {
          background: #dc3545;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .free-shipping-badge {
          background: #28a745;
          color: white;
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 12px;
          display: inline-block;
          margin-top: 8px;
        }
        
        .rating-section {
          display: flex;
          align-items: center;
        }
        
        .stars {
          margin-right: 8px;
        }
        
        .rating-text {
          font-size: 14px;
          color: #6c757d;
        }
        
        .out-of-stock-banner {
          background: #fff0f0;
          color: #dc3545;
          padding: 12px 15px;
          border-radius: 8px;
          text-align: center;
          font-size: 16px;
          border: 1px solid #ffcccc;
          margin: 15px 0;
        }
        
        .section-divider {
          border-top: 1px solid #e9ecef;
          margin: 20px 0;
        }
        
        .selection-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 500;
          color: #495057;
          margin-bottom: 10px;
        }
        
        .size-chart-link {
          background: none;
          border: none;
          color: #007bff;
          text-decoration: underline;
          cursor: pointer;
          font-size: 14px;
        }
        
        .size-selector {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        
        .size-option {
          width: 50px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }
        
        .size-option:hover {
          border-color: #495057;
        }
        
        .size-option.selected {
          border: 2px solid #000;
          background: #f8f9fa;
        }
        
        .size-option.unavailable {
          color: #adb5bd;
          text-decoration: line-through;
          cursor: not-allowed;
          background: #f8f9fa;
        }
        
        .color-selector {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }
        
        .color-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transition: all 0.2s;
          padding: 5px;
          border-radius: 8px;
        }
        
        .color-option:hover {
          background: #f8f9fa;
        }
        
        .color-option.selected {
          border: 2px solid #000;
        }
        
        .color-thumbnail {
          width: 50px;
          height: 50px;
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 5px;
        }
        
        .color-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .color-name {
          font-size: 12px;
          text-align: center;
          max-width: 60px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .quantity-section {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
        }
        
        .quantity-selector {
          display: flex;
          align-items: center;
          margin: 10px 0;
        }
        
        .quantity-btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #dee2e6;
          background: white;
          border-radius: 6px;
          cursor: pointer;
        }
        
        .quantity-display {
          width: 50px;
          text-align: center;
          font-weight: 600;
          margin: 0 10px;
        }
        
        .stock-status {
          color: #28a745;
          font-weight: 500;
        }
        
        .action-buttons {
          display: flex;
          gap: 15px;
        }
        
        .btn-add-to-cart {
          flex: 1;
          background: white;
          color: #495057;
          border: 1px solid #dee2e6;
          padding: 12px;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.2s;
        }
        
        .btn-add-to-cart:hover {
          background: #f8f9fa;
          border-color: #adb5bd;
        }
        
        .btn-buy-now {
          flex: 1;
          background: #28a745;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.2s;
        }
        
        .btn-buy-now:hover {
          background: #218838;
        }
        
        .key-specifications {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
        }
        
        .key-specifications h5 {
          margin-bottom: 12px;
          font-weight: 600;
        }
        
        .spec-item {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .spec-icon {
          color: #28a745;
          margin-right: 10px;
        }
        
        .product-details-accordion {
          border: 1px solid #e9ecef;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .accordion-button {
          font-weight: 600;
          padding: 15px;
        }
        
        .accordion-button:not(.collapsed) {
          background: #f8f9fa;
          color: #2d2d2d;
        }
        
        .info-item {
          margin-bottom: 15px;
        }
        
        .return-policy-list {
          list-style: none;
          padding-left: 0;
        }
        
        .return-policy-list li {
          margin-bottom: 10px;
        }
        
        .return-links {
          margin-top: 20px;
        }
        
        .return-links a {
          color: #007bff;
          text-decoration: none;
          margin-left: 5px;
        }
        
        .return-links a:hover {
          text-decoration: underline;
        }
        
        .delivery-estimate-section {
          padding: 15px;
        }
        
        .delivery-estimate-section h6 {
          font-weight: 600;
          margin-bottom: 12px;
        }
        
        .pincode-input-group {
          display: flex;
          gap: 10px;
        }
        
        .pincode-input {
          max-width: 180px;
        }
        
        .btn-check-delivery {
          background: #007bff;
          color: white;
          border: none;
          padding: 8px 15px;
          border-radius: 6px;
          font-weight: 500;
        }
        
        .btn-check-delivery:disabled {
          opacity: 0.65;
        }
        
        .delivery-success {
          background: #d4edda;
          color: #155724;
          padding: 10px 15px;
          border-radius: 6px;
        }
        
        .delivery-text {
          font-size: 14px;
        }
        
        .delivery-date {
          font-weight: 600;
        }
        
        .delivery-error {
          color: #dc3545;
          font-size: 14px;
        }
        
        @media (max-width: 768px) {
          .action-buttons {
            flex-direction: column;
          }
          
          .pincode-input-group {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .btn-check-delivery {
            margin-top: 10px;
          }
        }
      `}</style>
    </>
  );
};

export default DetailsWithPrice;