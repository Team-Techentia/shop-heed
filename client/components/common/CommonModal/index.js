import React, { useEffect, useState, useRef } from "react";
import { Modal } from "reactstrap";

const ModalComponent = ({ modal, selectedImageIndex, setModal, images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Touch handling state
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [initialPinchDist, setInitialPinchDist] = useState(null);
  const [lastZoom, setLastZoom] = useState(1);

  const toggle = () => {
    setModal(!modal);
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  const nextSlide = () => {
    if (images.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setZoomLevel(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  const prevSlide = () => {
    if (images.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      setZoomLevel(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  const selectSlide = (index) => {
    setCurrentIndex(index);
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  const zoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.5, 5));
  const zoomOut = () => {
    const newZoom = Math.max(zoomLevel - 0.5, 1);
    setZoomLevel(newZoom);
    if (newZoom === 1) setPosition({ x: 0, y: 0 });
  };

  // --- MOUSE EVENTS (Desktop) ---
  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoomLevel > 1) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      updatePosition(newX, newY);
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // --- TOUCH EVENTS (Mobile) ---
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      // Pinch Start
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setInitialPinchDist(dist);
      setLastZoom(zoomLevel);
    } else if (e.touches.length === 1) {
      // Single Touch
      if (zoomLevel > 1) {
        // Drag Start
        setIsDragging(true);
        setDragStart({
          x: e.touches[0].clientX - position.x,
          y: e.touches[0].clientY - position.y
        });
      } else {
        // Swipe Start
        setTouchEnd(null);
        setTouchStart(e.touches[0].clientX);
      }
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && initialPinchDist) {
      // Pinch Zooming
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = dist / initialPinchDist;
      const newZoom = Math.min(Math.max(lastZoom * ratio, 1), 5);
      setZoomLevel(newZoom);
      if (newZoom === 1) setPosition({ x: 0, y: 0 });
    } else if (e.touches.length === 1) {
      if (zoomLevel > 1 && isDragging) {
        // Panning when zoomed
        const newX = e.touches[0].clientX - dragStart.x;
        const newY = e.touches[0].clientY - dragStart.y;
        updatePosition(newX, newY);
      } else {
        // Swipe recording
        setTouchEnd(e.touches[0].clientX);
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setInitialPinchDist(null);

    // Swipe Detection (only if zoomed out)
    if (zoomLevel === 1 && touchStart && touchEnd) {
      const distance = touchStart - touchEnd;
      const minSwipeDistance = 50;
      if (distance > minSwipeDistance) nextSlide(); // Left Swipe
      if (distance < -minSwipeDistance) prevSlide(); // Right Swipe
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  const updatePosition = (newX, newY) => {
    const container = document.querySelector('.image-container');
    if (container) {
      const containerRect = container.getBoundingClientRect();
      const imgElement = container.querySelector('img');
      const imgRect = imgElement.getBoundingClientRect();

      // Calculate limits (roughly)
      // Note: imgRect depends on current transform, so using fixed dimensions is safer
      // Simplified boundary check: allow panning up to (zoom - 1) * dimension / 2
      const maxX = (containerRect.width * zoomLevel - containerRect.width) / 2;
      const maxY = (containerRect.height * zoomLevel - containerRect.height) / 2;

      // Ensure positive limit
      const limitX = Math.max(0, maxX);
      const limitY = Math.max(0, maxY);

      setPosition({
        x: Math.min(Math.max(newX, -limitX), limitX),
        y: Math.min(Math.max(newY, -limitY), limitY)
      });
    }
  };

  useEffect(() => {
    setCurrentIndex(selectedImageIndex);
  }, [selectedImageIndex]);

  const refStyles = {
    floatingControls: {
      position: "absolute",
      top: "20px",
      right: "20px",
      display: "flex",
      gap: "10px",
      zIndex: 1010
    },
    circleButton: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      background: "#fff",
      border: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      color: "#000",
      fontSize: "20px",
      fontWeight: "bold",
      boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
    }
  };

  return (
    <Modal
      isOpen={modal}
      toggle={toggle}
      centered={false}
      size="xl"
      className="image-modal fullscreen-modal"
      contentClassName="fullscreen-modal-content"
    >
      <style jsx>{`
        .fullscreen-modal .modal-dialog {
          margin: 0 !important;
          max-width: none !important;
          width: 100vw !important;
          height: 100vh !important;
        }
        .fullscreen-modal-content {
          width: 100% !important;
          height: 100% !important;
          margin: 0 !important;
          background-color: #000 !important;
          border: none !important;
          border-radius: 0 !important;
          overflow: hidden !important;
        }
      `}</style>

      {/* Floating Header Controls */}
      <div style={refStyles.floatingControls}>
        <button
          style={refStyles.circleButton}
          onClick={zoomOut}
          disabled={zoomLevel <= 1}
          title="Zoom Out"
        >
          <i className="fa fa-minus" style={{ fontSize: "16px" }}></i>
        </button>
        <button
          style={refStyles.circleButton}
          onClick={zoomIn}
          disabled={zoomLevel >= 5}
          title="Zoom In"
        >
          <i className="fa fa-plus" style={{ fontSize: "16px" }}></i>
        </button>
        <button
          style={refStyles.circleButton}
          onClick={toggle}
          title="Close"
        >
          <i className="fa fa-times" style={{ fontSize: "18px" }}></i>
        </button>
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: "#000000",
        position: 'relative',
        height: '100%',
        width: '100%'
      }}>
        {images.length > 0 ? (
          <>
            {/* Main Image Container */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                width: '100%',
                height: '100%',
                touchAction: 'none' // Important for custom touch handling
              }}
              // Mouse Events
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              // Touch Events
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="image-container"
                style={{
                  display: "inline-block",
                  cursor: zoomLevel > 1 ? (isDragging ? "grabbing" : "grab") : "default",
                  position: "relative"
                }}
              >
                <img
                  src={images[currentIndex]}
                  alt={`Slide ${currentIndex}`}
                  style={{
                    maxHeight: "85vh",
                    maxWidth: "100vw",
                    objectFit: "contain",
                    transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
                    transition: isDragging || initialPinchDist ? "none" : "transform 0.3s ease",
                  }}
                  draggable={false}
                />
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div
              style={{
                height: '100px',
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                overflowX: "auto",
                padding: "10px",
                background: "#000",
                zIndex: 1000,
                alignItems: 'center'
              }}
            >
              {images.map((img, idx) => (
                <div key={idx} style={{ position: "relative", flexShrink: 0 }}>
                  <img
                    src={img}
                    alt={`Thumb ${idx}`}
                    onClick={() => selectSlide(idx)}
                    style={{
                      height: "70px",
                      width: "auto",
                      cursor: "pointer",
                      border: idx === currentIndex ? "2px solid #fff" : "2px solid transparent",
                      opacity: idx === currentIndex ? 1 : 0.6,
                      transition: "all 0.2s"
                    }}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ color: 'white', display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            No images
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ModalComponent;