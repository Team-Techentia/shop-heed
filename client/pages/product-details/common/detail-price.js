import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
import freedelivery from "../../../public/assets/images/freedeliverylogo.png";
import { colorData } from "../../../data/colorData";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import toast from "react-hot-toast";
import MarkdownRenderer from "../../../components/MarkDown";
import { discountCount, getDiscountPercentage } from "../../../services/script";


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

  // Calculate if product is actually in stock based on current product and same variants
  const isProductInStock = () => {
    // Check current product quantity
    if (product && product.quantity > 0) {
      return true;
    }

    // Check if any variant of the same product has stock
    if (sameProductData && sameProductData.length > 0) {
      return sameProductData.some(variant => variant.quantity > 0);
    }

    return false;
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

  // Size options based on product category
  const sizeOptions = {
    shirts: [
      { value: "xs", label: "XS" },
      { value: "s", label: "S" },
      { value: "m", label: "M" },
      { value: "l", label: "L" },
      { value: "xl", label: "XL" },
      { value: "xxl", label: "XXL" },
      { value: "xxxl", label: "XXXL" }
    ],
    pants: [
      { value: "30", label: "30" },
      { value: "32", label: "32" },
      { value: "34", label: "34" },
      { value: "36", label: "36" },
      { value: "38", label: "38" },
      { value: "40", label: "40" },
      { value: "42", label: "42" },
      { value: "44", label: "44" },
      { value: "46", label: "46" }
    ],
    shoes: [
      { value: "6", label: "6" },
      { value: "7", label: "7" },
      { value: "8", label: "8" },
      { value: "9", label: "9" },
      { value: "10", label: "10" },
      { value: "11", label: "11" },
      { value: "12", label: "12" }
    ],
    oneSize: [
      { value: "one-size", label: "One Size" }
    ]
  };

  // Dynamically detect size type based on actual size data
  const getSizeType = () => {
    if (!sameProductData || sameProductData.length === 0) {
      return 'oneSize';
    }

    // Get first available size to determine type
    const sampleSize = sameProductData[0]?.size?.toLowerCase()?.trim();
    
    if (!sampleSize) {
      return 'oneSize';
    }

    // Check if it's a text size (xs, s, m, l, xl, xxl, etc.)
    const textSizes = ['xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl', '3xl', '4xl', '5xl'];
    if (textSizes.includes(sampleSize)) {
      return 'shirts';
    }

    // Check if it's a numeric size
    const numericSize = parseInt(sampleSize);
    if (!isNaN(numericSize)) {
      // Pants sizes are typically 28-50
      // Shoe sizes are typically 6-15
      if (numericSize >= 20) {
        return 'pants';
      } else if (numericSize >= 5 && numericSize <= 15) {
        return 'shoes';
      }
      // Default to pants for other numbers
      return 'pants';
    }

    // If it's "one-size" or similar
    if (sampleSize.includes('one') || sampleSize.includes('free')) {
      return 'oneSize';
    }

    // Default to shirts for unknown text sizes
    return 'shirts';
  };

  const sizeType = getSizeType();
  const allSizes = sizeOptions[sizeType];
  
  useEffect(() => {
    const filterSize = sameProductData.filter((data) => {
      return data.color === product.color;
    });
    
    // Sort by size order - handles both text sizes and numeric sizes
    const sortedSizes = filterSize.sort((a, b) => {
      const sizeOrder = ['xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl', '3xl', '4xl', '5xl'];
      const aLower = a.size.toLowerCase();
      const bLower = b.size.toLowerCase();
      
      // If both are in the size order array, sort by that
      const aIndex = sizeOrder.indexOf(aLower);
      const bIndex = sizeOrder.indexOf(bLower);
      
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      
      // If both are numbers, sort numerically
      const aNum = parseInt(a.size);
      const bNum = parseInt(b.size);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return aNum - bNum;
      }
      
      // Default alphabetical sort
      return aLower.localeCompare(bLower);
    });
    
    setUniqueSizes(sortedSizes);

    // If current product is out of stock → redirect to first available variant
    if (product.quantity <= 0) {
      const firstInStock = sortedSizes.find((s) => s.quantity > 0);
      if (firstInStock) {
        router.replace(
          `/product-details/${firstInStock.title
            .toLowerCase()
            .replaceAll(" ", "-")}/${firstInStock._id}`
        );
        return;
      } else {
        setSelectedSize(null);
        return;
      }
    }

    // Normal selection logic
    if (sortedSizes.length === 1 && sortedSizes[0].quantity > 0) {
      setSelectedSize(sortedSizes[0].size);
    } else if (sortedSizes.length > 1) {
      const firstInStock = sortedSizes.find((s) => s.quantity > 0);
      if (firstInStock) {
        setSelectedSize(firstInStock.size);
      } else {
        setSelectedSize(null);
      }
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
    const selectedProduct = sameProductData.find((data) => {
      return data.color == color;
    });
    if (selectedProduct) {
      router.push(
        `/product-details/${selectedProduct.title
          .toLowerCase()
          .replaceAll(" ", "-")}/${selectedProduct._id}`
      );
    }
  };

  // Updated static checkHandle function
  const checkHandle = async () => {
    setExpectDelivery('');
    setExpectDeliveryError('');

    if (!checkEstimateTime || checkEstimateTime.length < 6) {
      setExpectDeliveryError('Please enter a valid 6-digit pincode');
      return;
    }

    setIsCheckingDelivery(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const today = new Date();
      const deliveryDate = new Date(today);
      deliveryDate.setDate(today.getDate() + 3);

      const formattedDate = deliveryDate.toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

      setExpectDelivery(formattedDate);
    } catch (e) {
      setExpectDeliveryError('Unable to check delivery. Please try again.');
    } finally {
      setIsCheckingDelivery(false);
    }
  };

  return (
    <>
      <div className={`product-right ${stickyClass}`}>
        <h2 className="product-Brand">{product.brand}</h2>
        <h2 className="product-title">{product.title}</h2>

        <div className="price-section">
          <div className="price-main-row">
            <span className="current-price">₹{product.finalPrice}</span>
            <span className="mrp-badge">MRP</span>
            <span className="original-price">₹{product.price}</span>

            {parseInt(product.price) > parseInt(product.finalPrice) && (
              <span className="discount-text">
                ({Math.round(((product.price - product.finalPrice) / product.price) * 100)}% OFF)
              </span>
            )}
          </div>

          <div className="price-details-row">
            <span className="tax-inclusive">inclusive of all taxes</span>
          </div>
        </div>
        
        <div className="free-shipping">
          <Image
            src={freedelivery}
            alt="Free Shipping"
            width={110}
            height={45}
          />
        </div>

        {!isProductInStock() ? (
          <div className="out-of-stock-banner">
            <strong>Out Of Stock</strong>
          </div>
        ) : (
          <>
            {sameProductData && sameProductData.length >= 1 && (
              <>
                <hr className="section-divider" />

                {sizeType !== 'oneSize' && uniqueSizes.length > 0 && (
                  <div className="size-selector mt-2">
                    {uniqueSizes.map((matchedProduct) => {
                      const isOutOfStock = matchedProduct.quantity <= 0;

                      return (
                        <div
                          key={matchedProduct._id}
                          className={`size-option-wrapper ${isOutOfStock ? 'disabled' : ''}`}
                        >
                          <div
                            className={`size-option 
                              ${product.size === matchedProduct.size ? 'selected' : ''} 
                              ${isOutOfStock ? 'out-of-stock' : ''}`}
                            onClick={() => !isOutOfStock && handleSizeClick(matchedProduct)}
                          >
                            {matchedProduct.size.toUpperCase()}
                          </div>

                          {matchedProduct.quantity > 0 && matchedProduct.quantity <= 2 && (
                            <span className="qty-badge">
                              {matchedProduct.quantity} left
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {product.quantity > 0 && (
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
                  </div>
                )}

                {uniqueColors && uniqueColors.length > 1 && (
                  <>
                    <div className="selection-header mt-3">
                      <span>MORE COLOURS</span>
                    </div>

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
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {product.quantity > 0 && (
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
                        context.addToCart(product, product._id, quantity);
                        router.push("/page/account/checkout");
                      }}
                      style={{
                        flex: 1,
                        background: '#10ADD6',
                        color: 'white',
                        border: 'none',
                        padding: '12px',
                        borderRadius: '8px',
                        fontWeight: '600',
                        transition: 'all 0.2s',
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#10ADD1';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = '#10ADD6';
                      }}
                    >
                      <i className="fa fa-bolt me-2"></i> Buy Now
                    </button>
                  </div>
                )}
              </>
            )}
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

        <Accordion flush open={open} toggle={togglee}>
          <AccordionItem>
            <AccordionHeader targetId={2}>
              DETAILS
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
                  return <p key={index}><span style={{ fontWeight: 500 }}>{item.question}: </span>{item.answer}</p>
                })
                }
              </div>
            </AccordionBody>
          </AccordionItem>

          <AccordionItem>
            <AccordionHeader targetId={4}>
              RETURN
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


          <AccordionItem>
            <AccordionHeader targetId={5}>
              DELIVERY
            </AccordionHeader>
            <AccordionBody accordionId={5}>
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
                    type="button" style={{
                      color: "#fff",
                      width: "130px",
                      padding: "10px 16px",
                      background: "#000",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                      transition: "all 0.3s ease",
                    }}
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
                  <div
                    style={{
                      marginTop: "14px",
                      padding: "14px 18px",
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #fdfdfd, #f7f9fc)",
                      border: "1px solid #e6ebf1",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <i
                        className="fa fa-check-circle"
                        style={{
                          color: "#4CAF50",
                          fontSize: "22px",
                        }}
                      ></i>
                      <div>
                        <div
                          style={{
                            fontSize: "15px",
                            fontWeight: "600",
                            color: "#222",
                            marginBottom: "4px",
                          }}
                        >
                          Expected delivery <span style={{ color: "#4CAF50" }}>IN 2 To 3 Days</span>
                        </div>
                        <div
                          style={{
                            fontSize: "13px",
                            color: "#6b7280",
                            fontStyle: "italic",
                          }}
                        >
                          {expectDelivery}
                        </div>
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
            </AccordionBody>
          </AccordionItem>
        </Accordion>
      </div>

      <style jsx>{`
      .product-Brand {
  font-size: 24px;     
  font-weight: 700;      
  color: #000;       
  margin-bottom: 10px;   
}

.size-option.out-of-stock {
  position: relative;
  color: #aaa;
  pointer-events: none;
  opacity: 0.6;
}

.size-option.out-of-stock::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 10%;
  right: 10%;
  height: 2px;
  background: #555;
  transform: translateY(-50%);
}

.product-title {
  font-size: 24px;
  font-weight: 400;
  color: #6c757d;
  margin-bottom: 15px;
}

.current-price {
  font-size: 32px;
  font-weight: 720;
  color: #2d2d2d;
}

.mrp-badge {
  color: #6c757d;
  font-size: 25px;
  font-weight: 600;
  border-radius: 3px;
  margin-left: 6px;
}

.original-price {
  font-size: 25px;
  color: #6c757d;
  text-decoration: line-through;
}

.discount-text {
  font-size: 25px;
  font-weight: 700;
  color: #FF8C5A;
  margin-left: 6px;
}

.price-main-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
  flex-wrap: wrap;
}

.tax-inclusive {
  font-size: 15px;
  color: #28a745;
  font-weight: 700;
}

.free-shipping {
  margin-top: 10px;
}

.rating-section {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
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

.low-stock-warning {
  background: #fff8e1;
  color: #f57c00;
  padding: 10px 15px;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  border: 1px solid #ffcc02;
  margin: 15px 0;
  font-weight: 600;
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
  flex-wrap: wrap;
  gap: 10px;
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
  gap: 12px;
  flex-wrap: wrap;
}

.size-option {
  width: 52px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.5px;
  color: #212529;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.25s ease;
}

.size-option:hover {
  border-color: #10ADD6;
  color: #10ADD6;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.size-option.selected {
  border: 2px solid #10ADD6;
  color: #10ADD6;
  border-color: #10ADD6;
  background: linear-gradient(145deg, #f9f9f9, #fff);
}

.size-option.unavailable {
  color: #b0b0b0;
  border: 1.5px dashed #d6d6d6;
  background: #f8f9fa;
  cursor: not-allowed;
  text-decoration: line-through;
  box-shadow: none;
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
  width: 55px;
  height: 70px;
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
  flex-wrap: wrap;
  gap: 10px;
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
  transition: all 0.2s;
}

.quantity-btn:active {
  transform: scale(0.95);
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
  cursor: pointer;
}

.btn-add-to-cart:hover {
  background: #f8f9fa;
  border-color: #adb5bd;
}

.btn-add-to-cart:active {
  transform: scale(0.98);
}

.btn-buy-now {
  flex: 1;
  background: #000;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s;
  cursor: pointer;
}

.btn-buy-now:hover {
  background: #333;
}

.btn-buy-now:active {
  transform: scale(0.98);
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
  flex-wrap: wrap;
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
  width: 100%;
  text-align: left;
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

.delivery-estimate-section h6 {
  font-weight: 600;
}

.pincode-input-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.pincode-input {
  max-width: 180px;
  flex: 1;
  min-width: 120px;
}

.btn-check-delivery {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-check-delivery:hover {
  background: #0056b3;
}

.btn-check-delivery:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.delivery-success {
  background: #d4edda;
  color: #155724;
  padding: 10px 15px;
  border-radius: 6px;
  margin-top: 10px;
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
  margin-top: 10px;
}

.size-option-wrapper {
  position: relative;
  display: inline-block;
  margin: 5px;
}

.qty-badge {
  position: absolute;
  bottom: -13px;
  right: 1px;
  background: #ff7b54;
  color: #fff;
  font-size: 11px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
}

/* Tablet Styles (768px - 1024px) */
@media (max-width: 1024px) and (min-width: 769px) {
  .product-Brand {
    font-size: 22px;
  }
  
  .product-title {
    font-size: 20px;
  }
  
  .current-price {
    font-size: 28px;
  }
  
  .mrp-badge,
  .original-price,
  .discount-text {
    font-size: 22px;
  }
  
  .color-selector {
    gap: 12px;
  }
  
  .size-selector {
    gap: 10px;
  }
}

/* Mobile and Small Tablet Styles (max-width: 768px) */
@media (max-width: 768px) {
  .product-Brand {
    font-size: 20px;
    margin-bottom: 8px;
  }
  
  .product-title {
    font-size: 18px;
    margin-bottom: 12px;
  }
  
  .current-price {
    font-size: 26px;
  }
  
  .mrp-badge,
  .original-price,
  .discount-text {
    font-size: 20px;
  }
  
  .tax-inclusive {
    font-size: 13px;
  }
  
  .price-main-row {
    gap: 4px;
  }
  
  .rating-section {
    margin-bottom: 15px;
  }
  
  .rating-text {
    font-size: 13px;
  }
  
  .out-of-stock-banner,
  .low-stock-warning {
    font-size: 14px;
    padding: 10px 12px;
    margin: 12px 0;
  }
  
  .section-divider {
    margin: 15px 0;
  }
  
  .selection-header {
    font-size: 14px;
  }
  
  .size-chart-link {
    font-size: 13px;
  }
  
  .size-selector {
    gap: 8px;
  }
  
  .size-option {
    width: 48px;
    height: 38px;
    font-size: 13px;
  }
  
  .color-selector {
    gap: 10px;
  }
  
  .color-thumbnail {
    width: 50px;
    height: 65px;
  }
  
  .color-name {
    font-size: 11px;
  }
  
  .quantity-section {
    padding: 12px;
    margin: 15px 0;
  }
  
  .quantity-btn {
    width: 32px;
    height: 32px;
  }
  
  .quantity-display {
    width: 40px;
    margin: 0 8px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 10px;
  }
  
  .btn-add-to-cart,
  .btn-buy-now {
    width: 100%;
    padding: 14px;
    font-size: 16px;
  }
  
  .key-specifications {
    padding: 12px;
    margin: 15px 0;
  }
  
  .key-specifications h5 {
    font-size: 16px;
    margin-bottom: 10px;
  }
  
  .spec-item {
    font-size: 14px;
    margin-bottom: 6px;
  }
  
  .accordion-button {
    padding: 12px;
    font-size: 15px;
  }
  
  .info-item {
    margin-bottom: 12px;
    font-size: 14px;
  }
  
  .pincode-input-group {
    flex-direction: column;
    align-items: stretch;
  }
  
  .pincode-input {
    max-width: 100%;
    width: 100%;
  }
  
  .btn-check-delivery {
    width: 100%;
    padding: 10px 15px;
    margin-top: 0;
  }
  
  .delivery-success {
    padding: 8px 12px;
    font-size: 13px;
  }
  
  .delivery-text {
    font-size: 13px;
  }
  
  .qty-badge {
    font-size: 10px;
    padding: 1px 4px;
    bottom: -11px;
  }
}

/* Small Mobile Styles (max-width: 480px) */
@media (max-width: 480px) {
  .product-Brand {
    font-size: 18px;
  }
  
  .product-title {
    font-size: 16px;
  }
  
  .current-price {
    font-size: 24px;
  }
  
  .mrp-badge,
  .original-price,
  .discount-text {
    font-size: 18px;
  }
  
  .size-option {
    width: 44px;
    height: 36px;
    font-size: 12px;
  }
  
  .color-thumbnail {
    width: 45px;
    height: 60px;
  }
  
  .quantity-section {
    padding: 10px;
  }
  
  .btn-add-to-cart,
  .btn-buy-now {
    padding: 12px;
    font-size: 15px;
  }
}

/* Landscape Mobile Styles */
@media (max-width: 896px) and (orientation: landscape) {
  .action-buttons {
    flex-direction: row;
  }
  
  .size-selector,
  .color-selector {
    max-height: 150px;
    overflow-y: auto;
  }
}

/* Large Desktop Styles (min-width: 1440px) */
@media (min-width: 1440px) {
  .product-Brand {
    font-size: 26px;
  }
  
  .product-title {
    font-size: 26px;
  }
  
  .current-price {
    font-size: 36px;
  }
  
  .size-option {
    width: 56px;
    height: 44px;
  }
  
  .color-thumbnail {
    width: 60px;
    height: 75px;
  }
}

      `}</style>
    </>
  );

};

export default DetailsWithPrice;