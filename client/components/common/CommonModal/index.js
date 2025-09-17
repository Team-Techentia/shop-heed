import React, { useEffect, useState } from "react";
import { Modal } from "reactstrap";

const ModalComponent = ({ modal, selectedImageIndex, setModal, images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const toggle = () => { 
    setModal(!modal);
    // Reset zoom and position when closing modal
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  const nextSlide = () => {
    if (images.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      // Reset zoom and position when changing images
      setZoomLevel(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  const prevSlide = () => {
    if (images.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      // Reset zoom and position when changing images
      setZoomLevel(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  const selectSlide = (index) => {
    setCurrentIndex(index);
    // Reset zoom and position when changing images
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  const zoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 5));
  };

  const zoomOut = () => {
    const newZoom = Math.max(zoomLevel - 0.5, 1);
    setZoomLevel(newZoom);
    // Reset position if zooming back to 1
    if (newZoom === 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };
useEffect(()=>{
  setCurrentIndex(selectedImageIndex);
},[selectedImageIndex])
  const handleMouseMove = (e) => {
    if (isDragging && zoomLevel > 1) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      // Calculate boundaries to prevent dragging beyond image edges
      const container = document.querySelector('.image-container');
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const imgElement = container.querySelector('img');
        const imgRect = imgElement.getBoundingClientRect();
        
        const maxX = Math.max(0, (imgRect.width * zoomLevel - containerRect.width) / 2);
        const maxY = Math.max(0, (imgRect.height * zoomLevel - containerRect.height) / 2);
        
        setPosition({
          x: Math.min(Math.max(newX, -maxX), maxX),
          y: Math.min(Math.max(newY, -maxY), maxY)
        });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <Modal
      isOpen={modal}
      toggle={toggle}
      centered
      size="xl"
      className="theme-modal image-modal"
      style={{ backgroundColor: "white" }}
    >
      <div className="modal-header" style={{ borderBottom: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="zoom-controls">
          <button className="btn btn-sm btn-outline-secondary me-2" onClick={zoomOut} disabled={zoomLevel <= 1}>
            <i className="fas fa-search-minus"></i>
          </button>
          <span className="zoom-percentage">{Math.round(zoomLevel * 100)}%</span>
          <button className="btn btn-sm btn-outline-secondary ms-2" onClick={zoomIn} disabled={zoomLevel >= 5}>
            <i className="fas fa-search-plus"></i>
          </button>
          {zoomLevel > 1 && (
            <button className="btn btn-sm btn-outline-secondary ms-2" onClick={resetZoom}>
              Reset
            </button>
          )}
        </div>
        <button className="btn-close" onClick={toggle}></button>
      </div>

      <div className="modal-body" style={{ textAlign: "center", position: "relative", overflow: "hidden" }}>
        {images.length > 0 ? (
          <>
            {/* Main Image Container */}
            <div 
              className="image-container"
              style={{ 
                overflow: "hidden", 
                display: "inline-block",
                cursor: zoomLevel > 1 ? (isDragging ? "grabbing" : "grab") : "default",
                maxWidth: "90%",
                maxHeight: "70vh"
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img
                src={images[currentIndex]}
                alt={`Slide ${currentIndex}`}
                style={{
                  maxWidth: "100%",
                  maxHeight: "70vh",
                  objectFit: "contain",
                  borderRadius: "5px",
                  transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
                  transition: isDragging ? "none" : "transform 0.3s ease",
                }}
              />
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="nav-button prev-button"
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(255, 255, 255, 0.8)",
                border: "none",
                borderRadius: "50%",
                padding: "12px 16px",
                cursor: "pointer",
                boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                zIndex: 10,
              }}
            >
              ❮
            </button>
            <button
              onClick={nextSlide}
              className="nav-button next-button"
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(255, 255, 255, 0.8)",
                border: "none",
                borderRadius: "50%",
                padding: "12px 16px",
                cursor: "pointer",
                boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                zIndex: 10,
              }}
            >
              ❯
            </button>

            {/* Thumbnail Strip */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "15px",
                gap: "10px",
                overflowX: "auto",
                padding: "5px 0",
              }}
            >
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumb ${idx}`}
                  onClick={() => selectSlide(idx)}
                  style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "cover",
                    cursor: "pointer",
                    border: idx === currentIndex ? "3px solid #007bff" : "2px solid #dee2e6",
                    borderRadius: "5px",
                    opacity: idx === currentIndex ? 1 : 0.7,
                    transition: "all 0.2s ease",
                  }}
                />
              ))}
            </div>
          </>
        ) : (
          <p style={{ fontSize: "18px", fontWeight: "bold" }}>No images available</p>
        )}
      </div>
    </Modal>
  );
};

export default ModalComponent;