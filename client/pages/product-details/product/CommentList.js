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
  const [rating, setRating] = useState();
  const toggle = () => setModal(!modal);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const res = await Api.getComments(id);
      setComments(res.data.comments);
    } catch (error) {}
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

  const handleEdit = async (id, rating) => {
    try {
      setRating(rating);
      toggle();
    } catch (error) {}
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const payload = {
        rating,
        userId: reviewIdUser,
      };
      const res = await Api.updateReview(id, payload, token);
      toast.success("Review updated successfully");
      fetchData();
      toggle();
    } catch (error) {}
  };

  const [expandedComments, setExpandedComments] = useState({});

  return (
    <>
      <Paragraph
        title="title1 section-t-space"
        inner="title-inner1"
        hrClass={false}
        titleData="Ratings"
        headingStyle={{ fontSize: "30px" }}
        titleDisData=""
      />

      <div className="comment-list-container">
        <Row>
          {comments && comments.length > 0 ? (
            comments.map((comment) => {
              const isExpanded = expandedComments[comment._id] || false;
              return (
                <Col
                  key={comment._id}
                  xl="4"
                  lg="4"
                  md="4"
                  sm="6"
                  className="comment-col"
                >
                  <div className="comment-item">
                    {comment &&
                      comment.user &&
                      comment.user._id === reviewIdUser && (
                        <div
                          className="edit-icon"
                          onClick={() =>
                            handleEdit(reviewIdUser, comment.rating)
                          }
                        >
                          <MdEdit />
                        </div>
                      )}

                    <div className="avatar-circle">
                      {comment.user && comment.user.name
                        ? comment.user.name.slice(0, 1)
                        : "U"}
                    </div>

                    <div className="comment-user">
                      <div>
                        {comment.user && comment.user.name
                          ? comment.user.name
                          : "User"}
                      </div>
                      <div>{renderRatingStars(comment.rating)}</div>
                    </div>

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
          <form onSubmit={handleSubmit} className="comment-form">
            <div className="form-group">
              <label htmlFor="rating">
                <storage>Rating:</storage>
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
              Edit Rating
            </button>
          </form>
        </ModalBody>
      </Modal>
      <Toaster />

      {/* Inline CSS */}
      <style jsx>{`
        .comment-list-container {
          margin: 30px 0;
        }

        .comment-col {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }

        .comment-item {
          background: #ffffff;
          padding: 20px 15px;
          border-radius: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          position: relative;
          width: 100%;
          max-width: 350px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .comment-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
        }

        .avatar-circle {
          border-radius: 50%;
          background: #10ADD1;
          width: 40px;
          height: 40px;
          font-size: 16px;
          font-weight: bold;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          margin-bottom: 10px;
        }

        .comment-user {
          margin-left: 10px;
          font-size: 14px;
        }

        .comment-user div:first-child {
          font-weight: 600;
          color: #333;
        }

        .comment-user div:last-child {
          color: #ffa200;
          font-size: 16px;
        }

        .comment-date {
          margin-top: 10px;
          font-size: 12px;
          color: #888;
        }

        .edit-icon {
          position: absolute;
          top: 10px;
          right: 10px;
          cursor: pointer;
          color: #000;
          font-size: 20px;
        }

        .submit-button {
          background-color: #6c63ff;
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 10px;
          cursor: pointer;
          margin-top: 15px;
          transition: background 0.3s;
        }

        .submit-button:hover {
          background-color: #5548c8;
        }

        .no-reviews {
          text-align: center;
          color: #555;
          font-size: 16px;
          width: 100%;
        }
      `}</style>
    </>
  );
};

export default CommentList;
