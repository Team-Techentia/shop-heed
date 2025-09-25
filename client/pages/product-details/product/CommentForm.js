import React, { useState, useContext } from 'react';
import Api from '../../../components/Api';
import { getCookie } from "../../../components/cookies";
import UserContext from '../../../helpers/user/UserContext';
import { toast } from 'react-toastify';
import { LoaderContext } from '../../../helpers/loaderContext';
import { Modal, ModalBody, ModalHeader } from "reactstrap";

const RatingForm = ({ productId }) => {
  const LoaderContextData = useContext(LoaderContext);
  const { catchErrors } = LoaderContextData;

  const [rating, setRating] = useState(1);
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const token = getCookie("ectoken");
  const userContext = useContext(UserContext);
  const isLogin = userContext.isLogin;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin) {
      toast.error("Please login to give rating");
      return;
    }

    try {
      // Only send rating, no text/comment
      await Api.createComments(
        { rating },
        productId,
        token
      );

      toast.success("Rating submitted successfully!");
      toggle();
    } catch (error) {
      catchErrors(error);
    }
  };

  const handleRatingClick = (value) => {
    setRating(value);
  };

  return (
    <>
      <div className='mt-3' style={{ textAlign: "center" }}>
        <button onClick={toggle} style={{ maxWidth: "190px" }} className="btn btn-solid">
          Add Rating
        </button>
      </div>

      <Modal isOpen={modal} toggle={toggle} centered>
        <ModalHeader toggle={toggle}>Add Rating</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit} className="rating-form" style={{ textAlign: "center" }}>
            <div className="form-group mb-3">
              <label><strong>Rating:</strong></label>
              <div>
                {[1, 2, 3, 4, 5].map((star) => (
                  <i
                    key={star}
                    className={`fa fa-star${star <= rating ? ' highlighted' : ''} me-1`}
                    onClick={() => handleRatingClick(star)}
                    style={{
                      cursor: 'pointer',
                      color: star <= rating ? '#ffa200' : '#ccc',
                      fontSize: '28px',
                    }}
                  ></i>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-solid mt-3" style={{ maxWidth: "200px" }}>
              Submit Rating
            </button>
          </form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default RatingForm;
