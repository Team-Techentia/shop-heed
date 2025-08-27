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

  // const uniqueColors = (
  //   selectedSize
  //     ? sameProductData.filter((data) => data.size === selectedSize)
  //     : sameProductData
  // ).map((data) => ({
  //   color: data.color,
  //   image: data.image[0],
  //   colorName: colorData[data.color],
  // }));
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
    // setSelectedSize(size);
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
  
  console.log("discountCount", getDiscountPercentage(product.price, product.finalPrice))
  const checkHandle = async () => { 
    setExpectDelivery('');
   try {
    const res = await axios.get(`https://shopheed.com/api/product-api/service/availability?pickup_postcode=110008&delivery_postcode=${checkEstimateTime}`);
    if (res.data.data) {
      const data = res.data.data.available_courier_companies;
      
      // Get the minimum date as a timestamp
      const minTimestamp = Math.min(...data.map(item => new Date(item.etd).getTime()));
      
      // Convert the timestamp back to a Date object
      const minDate = new Date(minTimestamp);
      
      // Format the date as a string
      const formattedDate = minDate.toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      
      // Set the formatted date
      setExpectDelivery(formattedDate);
    
      console.log("data===>", formattedDate);
    } else {
      setExpectDelivery(false);
      setExpectDeliveryError(res.data.message);
    }
  } catch (e) {
    setExpectDeliveryError(e.response.data.error ?? 'Internal Server Error');
    console.log("error--->", e);
  }
  }

  return (
    <>
      <div className={`product-right ${stickyClass}`}>
        <h2 style={{ fontSize: "22px" }}> {product.title} </h2>
        {/* <p> {product && product.sku && `SKU: ${product.sku}`} </p> */}
        <div className="mt-3" style={{ display: "flex" }}>
          <h3 style={{ fontSize: "22px" }}>₹ {product.finalPrice}</h3>
          <h4 className="mt-1 ms-2">
            <del style={{ fontSize: "15px" }}>₹{product.price}</del>
            {/* <span style={{ fontSize: "15px" }} className="ms-1">{product.discount}% off</span> */}
            <span style={{ fontSize: "15px" }} className="ms-1">{getDiscountPercentage(product.price, product.finalPrice)} off</span>

          </h4>
          <span className="ms-3"> FREE SHIPPING</span>
        </div>

        {stock === "Out of Stock" ? (
          <div
            className="my-3"
            style={{ fontSize: "20px", color: "#ff00009c" }}
          >
            <strong> Out Of Stock</strong>
          </div>
        ) : (
          <>
            {sameProductData && sameProductData.length >= 1 && (
              <>
                <hr />
                {product.category === "shirt" ? (
                  <p
                    style={{ display: "flex", justifyContent: "space-between", color: "#808080", fontWeight: 500 }}
                    className="mt-2"
                  >
                    SELECT SIZE{" "}
                    <a
                      href={null}
                      data-toggle="modal"
                      data-target="#sizemodal"
                      onClick={toggle}
                      style={{ cursor: "pointer" }}
                    >
                      Size Chart
                    </a>
                  </p>
                ) : (
                  ""
                )}
                <Modal
                  isOpen={modal}
                  toggle={toggle}
                  centered
                  style={{ height: "100vh", borderRadius: "20px" }}
                >
                  <ModalHeader toggle={toggle}>Shop Heed</ModalHeader>
                  <ModalBody>
                    <Media
                      src={sizeChart2.src}
                      alt="size"
                      className="img-fluid"
                    />
                    <Media
                      src={sizeChart1.src}
                      alt="size"
                      className="img-fluid"
                    />
                  </ModalBody>
                </Modal>
                <div className="size-box mt-3">
                  {/* {allSizes.map((size, i) => (
                      <li
                        key={i}
                        onClick={() => handleSizeClick(size)}
                        style={{
                          border:
                            selectedSize === size && uniqueSizes[i].size ==size
                              ? "0.2px solid #121212"
                              : "",
                          borderRadius: "5px",
                          padding: "0px 10px",
                          textTransform: "capitalize",

                          textDecoration: uniqueSizes.size ==size
                            ? "none"
                            : "line-through",
                          pointerEvents: uniqueSizes.includes(size)
                            ? "auto"
                            : "none",
                        }}
                      >
                     
                          <a
                            href="#"
                            style={{
                              fontWeight:600,
                              color: uniqueSizes.includes(size)
                                ? "#000"
                                : "#8d89898c",textTransform:"uppercase"
                            }}
                            onClick={(e) => e.preventDefault()}
                          >
                            {size}
                          </a>
                       
                      </li>
                    ))} */}

                  <ul style={{ gap: "30px", display: "flex" }}>
                    {allSizes.map((size) => {
                      // Check if the size is available in uniqueSizes
                      const matchedProduct = uniqueSizes.find(
                        (data) => data.size === size
                      );
                      const isAvailable = !!matchedProduct;

                      return (
                        <li
                          className="hover-hover-hover"
                          key={size}
                          onClick={() =>
                            isAvailable && handleSizeClick(matchedProduct)
                          }
                          style={{
                            border:
                              product.size === size
                                ? "0.2px solid #121212"
                                : "",
                            borderRadius: "5px",
                            padding: "0px 10px",
                            textTransform: "capitalize",
                            cursor: isAvailable ? "pointer" : "not-allowed",
                            color: isAvailable ? "#000" : "#8d89898c",
                            textDecoration: !isAvailable
                              ? "line-through"
                              : "none",
                          }}
                        >
                          <a
                            href="#"
                            style={{
                              fontWeight: 600,
                              color: isAvailable ? "#000" : "#8d89898c",
                              textTransform: "uppercase",
                              pointerEvents: isAvailable ? "auto" : "none",
                            }}
                          >
                            {size}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <p
                    style={{ display: "flex", justifyContent: "space-between", color: "#808080", fontWeight: 500 }}
                    className="mt-2"
                  >
                    SELECT COLOUR{" "}
                  </p>
                {uniqueColors && (
                  <div className="size-box">
                    <div
                      style={{ gap: "10px", display: "flex", flexWrap: "wrap" }}
                    >
                      {uniqueColors.map((data, i) => (
                        <div
                          key={i}
                          onClick={() => handleColorClick(data.color)}
                          style={{
                            display: "flex",
                            padding: "5px",
                            cursor: "pointer",
                            borderRadius: "8px",
                            flexWrap: "wrap",

                            border:
                              product.color === data.color
                                ? "1px solid black"
                                : "",
                          }}
                          className="hover-hover-hover"
                        >
                          <div>
                            <img
                              style={{
                                width: "50px ",
                                height: "50px",
                                objectFit: "cover",
                              }}
                              src={data.image}
                            />
                            <div
                              style={{
                                textAlign: "center",
                              }}
                            >
                              {" "}
                              <strong>{data.colorName}</strong>{" "}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="product-description border-product ">
            <p style={{ display: "flex", justifyContent: "space-between", fontWeight: 500, color: "#808080" }} className="mt-2" > QUANTITY {" "}</p>
              <div className="qty-box my-1">
                <div className="input-group">
                  <span className="input-group-prepend">
                    <button
                      type="button"
                      className="btn quantity-left-minus"
                      onClick={changeless}
                      data-type="minus"
                      data-field=""
                    >
                      <RemoveIcon style={{ fontSize: "15px" }} />
                    </button>
                  </span>
                  <Input
                    type="text"
                    name="quantity"
                    value={quantity}
                    className="form-control input-number"
                    readOnly
                  />
                  <span className="input-group-prepend">
                    <button
                      type="button"
                      className="btn quantity-right-plus"
                      onClick={changeInc}
                      data-type="plus"
                      data-field=""
                    >
                      <AddIcon style={{ fontSize: "15px" }} />
                    </button>
                  </span>
                </div>
              </div>
              <span className="instock-cls" style={{ color: "green" }}>
                {" "}
                In Stock{" "}
              </span>
            </div>

            <div className="product-buttons mt-3">
              <div
                className="btn btn-solid"
                onClick={() => {
                  context.addToCart(product, product._id, quantity);
                }}
              >
                Add to Cart
              </div>

              <Link
                href={"#"}
                className="btn btn-solid"
                onClick={() => {
                  let cart = JSON.parse(localStorage.getItem("cart")) || [];
                  if (cart.length == 0) {
                    return toast.error(
                      "You must have at least one item in your cart to checkout"
                    );
                  } else {
                    router.push("/page/account/checkout");
                  }
                }}
              >
                Checkout
              </Link>
            </div>
          </>
        )}

<div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {product &&
            product.specificationSingleLine &&
            product.specificationSingleLine.slice(0, 5).map((data, index) => {
              return (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    columnGap: 10,
                  }}
                >
                  <div>
                    <p className="mt-1">{data}</p>
                  </div>
                </div>
              );
            })}
        </div>

        <div className="mt-3">
          <Accordion flush open={open} toggle={togglee}>
            {/* <AccordionItem>
              <AccordionHeader targetId={4}>PRODUCT DETAILS</AccordionHeader>
              <AccordionBody accordionId={4}>
                {product &&
                  product.specificationArray &&
                  product.specificationArray.map((data, index) => {
                    return (
                      <div key={index}>
                        <p className="mt-1">
                          <strong>{data.question}:</strong> {data.answer}
                        </p>
                      </div>
                    );
                  })}
              </AccordionBody>
            </AccordionItem> */}

            {/* <AccordionItem> */}
              {/* <AccordionHeader targetId={5}>
                PRODUCT SPECIFICATION
              </AccordionHeader> */}
              {/* <AccordionBody accordionId={5}>
                {product &&
                  product.specificationSingleLine &&
                  product.specificationSingleLine.map((data, index) => {
                    return (
                      <div key={index}>
                        <p className="mt-1">
                          <strong>{data}</strong>
                        </p>
                      </div>
                    );
                  })}
              </AccordionBody>
            </AccordionItem> */}
            {console.log("product==>", product)}
            <AccordionItem>
              <AccordionHeader targetId={2}>PRODUCT DESCRIPTION</AccordionHeader>
              <AccordionBody accordionId={2}>
                <div>
                  {product && product.description && (
                    <MarkdownRenderer markdown={product.description} />
                  )}
                </div>
                <br></br>
                <div>
                <h5>Specification</h5>
                  {product && product.specificationArray && product.specificationArray.length > 0  && product.specificationArray.map((item) => {
                    return <p><span style={{fontWeight: 500}}>{item.question}: </span>{item.answer}</p>
                  }) 
                  }
                </div>
                {/* <p>{product && product.description}</p> */}
              </AccordionBody>
            </AccordionItem>

            <AccordionItem>
              <AccordionHeader targetId={3}>MORE INFORMATION</AccordionHeader>
              <AccordionBody accordionId={3}>
                <p>
                  {" "}
                  <strong style={{color: "black"}}> Manufactured & Marketed by:</strong>{" "}
                </p>
                {/* <p className="mt-2">
                  {" "}
                  <strong> Heed Attentive</strong>{" "}
                </p> */}
                <p className="mt-2">
                  {" "}
                  BRANDS.IN
                </p>
                <p className="mt-2">
                  {" "}
                  A-39, West Patel Nagar, New Delhi – 110008
                </p>
                <br></br>
                <p>
                  {" "}
                  <strong style={{color: "black"}}> Country of Origin:</strong>{" "}
                </p>
                <p className="mt-2">
                   India
                </p>

                {/* <p className="mt-2">
                  {" "}
                  <strong> Country of Origin:</strong>{" "}
                </p>
                <p> India</p> */}
              </AccordionBody>
            </AccordionItem>
            <AccordionItem>
              <AccordionHeader targetId={3}>{"RETURN AND EXCHANGE"}</AccordionHeader>
              <AccordionBody accordionId={3}>
                <ul>
                  <li><span style={{fontWeight: 900, position: "relative", top: "-5px"}}>.</span> {"Hassle-free return within 4 day - no questions asked."}</li>
                  <li><span style={{fontWeight: 900, position: "relative", top: "-5px"}}>.</span> {"Issues with defective, incorrect and damaged product should be reported within 24 hours of delivery."}</li>
                  <li><span style={{fontWeight: 900, position: "relative", top: "-5px"}}>.</span> {"For hygiene, Inner Wear & Accessories are not eligible for Return or Exchanges."}</li>
                </ul>
                <p className="mt-2">
                    {"For more details on our Return and Exchange Policies,"} 
                    <Link href={"/return_and_exchange"}>{"Click here"}</Link>
                    {/* <a href="your-refund-exchange-policy-link" target="_blank">click here</a>. */}
                </p>
                <p className="mt-2">
                    {"To place a Return / Exchange Request, "}
                    <Link href={"/contact-us"}>{"Click here"}</Link>
                    {/* <a href="contact-us" target="_blank">click here</a>. */}
                  </p>

                {/* <p className="mt-2">
                  {" "}
                  <strong> Country of Origin:</strong>{" "}
                </p>
                <p> India</p> */}
              </AccordionBody>
            </AccordionItem>
          </Accordion>
          {/* Check estimate time */}
          <br></br>
            <div className="mt-3">
               <label>Estimated Delivery Date</label><br></br>
               <input
                type="number"
                className="form-control"
                max={10}
                value={checkEstimateTime}
                onChange={(e) => {
                    setCheckEstimateTime(e.target.value);
                }}
              />
            <span>
              {expectDelivery ? (
                <>
                  Expect delivery by <p style={{ color: "green", display: "inline", fontWeight: 500 }}>{expectDelivery}</p>
                </>
              ) : <p style={{color: "red"}}>{expectDeliveryError}</p>}
            </span>
              <br></br>
               <button style={{marginTop: "4px"}} type="button" className="btn btn-solid" onClick={checkHandle}>Check</button>
            </div>
          {/* End estimate time */}
        </div>
      </div>
    </>
  );
};

export default DetailsWithPrice;
