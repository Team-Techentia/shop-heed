import React, { useState } from "react";
import { Modal } from "reactstrap";

const ModalComponentt = ({ modal, setModal, images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const toggle = () => setModal(!modal);

  const nextSlide = () => {
    if (images.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }
  };

  const prevSlide = () => {
    if (images.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="test">

      <Modal
        isOpen={modal}
        toggle={toggle}
        className="theme-modal modal-xl modelwidth"
        style={{
          width: "100%", // Full width
          // display: "flex",
          // alignItems: "center",
         height: "100vh",
          backgroundColor: "white", // White background
          maxWidth:  "none",
        }}
        centered
      >
        <div className="modal-header" style={{ borderBottom: "none" }}>
          <button className="btn-close" onClick={toggle}></button>
        </div>
        <div className="modal-body" style={{ textAlign: "center", position: "relative" }}>
          {images.length > 0 ? (
            <>
              <img
                className="new imagewidth"
                src={images[currentIndex]}
                alt={`Slide ${currentIndex}`}
                style={{
                  width: "40%",
                  maxHeight: "500px",
                  objectFit: "cover",
                  borderRadius: "5px",
                }}
              />

              {/* Navigation Buttons */}
              <button
                className="carousel-button left"
                onClick={prevSlide}
                style={{
                  position: "absolute",
                  left: "20px",
                  top: "50%",
                  width: "41px",
                  transform: "translateY(-50%)",
                  background: "white",
                  color: "black",
                  border: "none",
                  padding: "12px",
                  cursor: "pointer",
                  borderRadius: "50%",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                }}
              >
                ❮
              </button>

              <button
                className="carousel-button right"
                onClick={nextSlide}
                style={{
                  position: "absolute",
                  right: "20px",
                  top: "50%",
                  width: "41px",
                  transform: "translateY(-50%)",
                  background: "white",
                  color: "black",
                  border: "none",
                  padding: "12px",
                  cursor: "pointer",
                  borderRadius: "50%",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                }}
              >
                ❯
              </button>

              {/* Close Button */}
              <div
                onClick={toggle}
                className="button-test"
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "white",
                  color: "black",
                  border: "none",
                  padding: "12px",
                  cursor: "pointer",
                  borderRadius: "50%",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                }}
              >
                ✖
              </div>
            </>
          ) : (
            <p style={{ textAlign: "center", fontSize: "18px", fontWeight: "bold" }}>
              No images available
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ModalComponentt;