import React, { useState,useContext } from 'react';
import Api from '../../../components/Api';
import { getCookie } from "../../../components/cookies";
import UserContext from '../../../helpers/user/UserContext';
import { toast } from 'react-toastify';
import { LoaderContext } from '../../../helpers/loaderContext';
import { Modal, ModalBody, ModalHeader } from "reactstrap";
const CommentForm = ({ productId, setComments, comments }) => {
    const LoaderContextData = useContext(LoaderContext)
    const { catchErrors  } = LoaderContextData
  const [text, setText] = useState('');
  const [rating, setRating] = useState(1);
  const token = getCookie("ectoken");
  const userContext = useContext(UserContext);
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const isLogin = userContext.isLogin
  const handleSubmit = async (e) => {
  
    e.preventDefault();
    if(!isLogin){
        toast.error("Please login to comment");
        return;
    }
    try {
      const response = await Api.createComments({
        text,
        rating,
      }, productId, token);
      setComments([response.data.comment, ...comments]);
      setText('');
      setRating(1);
      toggle()
    } catch (error) {
        
        catchErrors(error)
    }
  };

  const handleRatingClick = (value) => {
    setRating(value);
  };

  return (
    <>
    
  <div className='mt-3' style={{textAlign:"center"}}>

  <button onClick={toggle} style={{maxWidth:"190px" }} type="submit" className=" btn btn-solid">
        Add Comment
      </button>
  </div>

  <Modal isOpen={modal} toggle={toggle} centered>
        <ModalHeader toggle={toggle}>Add Review</ModalHeader>
        <ModalBody>

    <form onSubmit={handleSubmit} className="comment-form">
      <div className="form-group">
        <label htmlFor="comment"> <strong>Comment:</strong> </label>
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
        <label htmlFor="rating"> <storage>Rating:</storage> </label>
        {[1, 2, 3, 4, 5].map((star) => (
          <i
            key={star}
            className={`fa fa-star${star <= rating ? ' highlighted' : ''} me-1`}
            onClick={() => handleRatingClick(star)}
            style={{ cursor: 'pointer', color: star <= rating ? '#ffa200' : '#ccc' }}
          ></i>
        ))}
      </div>

     <div style={{display:"flex" , justifyContent:"flex-end"}}>
     <button style={{maxWidth:"200px"}} type="submit" className="btn btn-solid">
        Add Comment
      </button>
     </div>
    </form>
    </ModalBody>
    </Modal>
    </>


   
  );
};

export default CommentForm;