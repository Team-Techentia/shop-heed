import React, { useEffect, useState } from "react";
import Api from "../../../components/Api";
import { Col, Row } from "reactstrap";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { getCookie } from "../../../components/cookies";
import { toast, Toaster } from "react-hot-toast";
import Paragraph from "../../../components/common/Paragraph";
import { MdEdit } from "react-icons/md";
const CommentList = ({ id, comments, setComments, reviewIdUser }) => {
  const token = getCookie("ectoken");
  const [modal, setModal] = useState(false);
  const [text, setText] = useState();
  const [rating, setRating] = useState();
  const toggle = () => setModal(!modal);
  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const res = await Api.getComments(id);
      setComments(res.data.comments);
    } catch (error) {
    }
  };

  const renderRatingStars = (rating) => {
    return [...Array(5)].map((_, index) => {
      const starChar = index < rating ? "★" : "☆";
      return (
        <span
          key={index}
          style={{ color: index < rating ? "#ffa200" : "#ccc" }}
        >
          {starChar}
        </span>
      );
    });
  };
  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleEdit = async (id, rating, text) => {
    try {
      setRating(rating);
      setText(text);
      toggle();
     
    } catch (error) {
    }
  };

  const handleSubmit = async (e) => {
    try {
        e.preventDefault();
      const payload = {
        text,
        rating,
        userId: reviewIdUser,
      };
      const res = await Api.updateReview(id, payload, token);
      toast.success("Review updated successfully")
      fetchData()
      toggle();
      
    } catch (error) {
    }
  };
  const [expandedComments, setExpandedComments] = useState({}); 

  const toggleReadMore = (commentId) => {
    setExpandedComments((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId], 
    }));
  };

  const truncateText = (text, limit) => {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + '...'; 
  };
  return (
    <>
        <Paragraph title="title1 section-t-space" inner="title-inner1" hrClass={false} titleData="Ratings & Reviews" headingStyle={{fontSize: "30px"}}   titleDisData=""/>
        {" "}
        <div className="comment-list-container">
      <Row>
        {comments && comments.length > 0 ? (
          comments.map((comment) => {
            const isExpanded = expandedComments[comment._id] || false;
            return (
              <Col
                key={comment._id}
                style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '20px' }}
                xl="4"
                lg="4"
                md="4"
                sm="6"
              >
                <div style={{ position: 'relative' }} className="comment-item">
                  { comment && comment.user &&  comment.user._id === reviewIdUser && (
                    <div
                      onClick={() => {
                        handleEdit(reviewIdUser, comment.rating, comment.text);
                      }}
                      style={{
                        position: 'absolute',
                        top: '0px',
                        right: '0px',
                        cursor: 'pointer',
                      }}
                    >
                      <strong><MdEdit /></strong>
                    </div>
                  )}

                  <div
                    style={{
                      borderRadius: '50%',
                      background: '#D5E4D9',
                      width: '35px',
                      height: '35px',
                      fontSize: '15px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop:"-4px"
                    }}
                  >
                    {comment.user && comment.user.name ? comment.user.name.slice(0, 1) : 'U'}
                  </div>
                  <div style={{ position: 'absolute', top: '7px', left: '51px' }} className="comment-user">
                    <div>{comment.user && comment.user.name ? comment.user.name : 'User'}</div>
                    <div style={{marginTop:"-3px"}}>{renderRatingStars(comment.rating)}</div>
                  </div>

                  <p className="comment-text">
                    {isExpanded
                      ? comment.text 
                      : truncateText(comment.text, 150)}{' '}
                    {comment.text.length > 150 && (
                      <span
                        onClick={() => toggleReadMore(comment._id)}
                        style={{ color: 'blue', cursor: 'pointer' }}
                      >
                        {isExpanded ? 'Read less' : 'Read more'}
                      </span>
                    )}
                  </p>

                  <div className="comment-date">
                    <small>
                      <strong>
                        {comment.createdAt
                          ? new Date(comment.createdAt).toLocaleString()
                          : new Date(Date.now()).toLocaleString()}
                      </strong>
                    </small>
                  </div>
                </div>
              </Col>
            );
          })
        ) : (
          <p className="no-reviews">No Reviews Yet</p>
        )}
      </Row>
    </div>
      <Modal isOpen={modal} toggle={toggle} centered>
        <ModalHeader toggle={toggle}>Edit Review</ModalHeader>
        <ModalBody>
          <form  onSubmit={handleSubmit} className="comment-form">
            <div className="form-group">
            <h4>Comment:</h4> 
              <textarea
              maxLength="800"
                id="comment"
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                className="form-control-comment"
              />
            </div>
            <div className="form-group">
              <label htmlFor="rating">
                {" "}
                <storage>Rating:</storage>{" "}
              </label>
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={`fa fa-star${
                    star <= rating ? " highlighted" : ""
                  } me-1`}
                  onClick={() => handleRatingClick(star)}
                  style={{
                    cursor: "pointer",
                    color: star <= rating ? "#ffa200" : "#ccc",
                  }}
                ></i>
              ))}
            </div>
            <button type="submit" className="submit-button">
              Edit Comment
            </button>
          </form>
        </ModalBody>
      </Modal>
      <Toaster />
    </>
  );
};

export default CommentList;
