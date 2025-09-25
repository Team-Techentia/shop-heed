import React, { useState, useEffect } from "react";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import Api from "../../../components/Api";
import { getCookie } from "../../../components/cookies";
import Paragraph from "../../../components/common/Paragraph";

const ProductReviewSection = ({ productData }) => {
  const token = getCookie("ectoken");
  const [comments, setComments] = useState([]);
  const [reviewIdUser, setReviewIdUser] = useState("");
  const [showReviewSection, setShowReviewSection] = useState(true);

  // productData is assumed to be available globally in LeftSidebarPage
  const [internalProductData, setInternalProductData] = useState(null);

  useEffect(() => {
    // Try to read productData from window if not passed as prop
    if (!productData && window.productDataGlobal) {
      setInternalProductData(window.productDataGlobal);
    } else {
      setInternalProductData(productData);
    }
  }, [productData]);

  const productId = internalProductData?._id || internalProductData?.productId;

  useEffect(() => {
    if (productId) {
      fetchComments();
      if (token) checkReviewInListing();
    }
  }, [productId, token]);

  const fetchComments = async () => {
    try {
      const res = await Api.getComments(productId);
      setComments(res.data.comments);
    } catch (error) {}
  };

  const checkReviewInListing = async () => {
    try {
      const res = await Api.checkReviewInListing(productId, token);
      if (
        res.data.message ===
        "You have already given a review for this listing"
      ) {
        setShowReviewSection(false);
        setReviewIdUser(res.data.reviewIdUser);
      }
    } catch (error) {}
  };

  const sectionStyle = {
    marginTop: "40px",
    padding: "20px",
    background: "#f9f9f9",
    borderRadius: "12px",
  };

  if (!internalProductData || !productId) return null;

  return (
    <div className="product-review-section" style={sectionStyle}>
      <Paragraph
        title="Ratings & Reviews"
        headingStyle={{ fontSize: "30px", marginBottom: "20px" }}
        hrClass={false}
      />

      <CommentList
        reviewIdUser={reviewIdUser}
        id={productId}
        comments={comments}
        setComments={setComments}
      />

      {showReviewSection && (
        <div style={{ marginTop: "20px" }}>
          <CommentForm
            productId={productId}
            comments={comments}
            setComments={setComments}
          />
        </div>
      )}
    </div>
  );
};

export default ProductReviewSection;
