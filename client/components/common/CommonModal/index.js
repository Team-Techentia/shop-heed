import React, { useEffect, useState } from "react";
import { Modal } from "reactstrap";

const ModalComponent = ({ modal, selectedImageIndex, setModal, images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [fade, setFade] = useState(false);

  const toggle = () => { 
    setModal(!modal);
    // Reset zoom and position when closing modal
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  const nextSlide = () => {
    if (images.length > 0) {
      setFade(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setZoomLevel(1);
        setPosition({ x: 0, y: 0 });
        setFade(false);
      }, 200);
    }
  };

  const prevSlide = () => {
    if (images.length > 0) {
      setFade(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        setZoomLevel(1);
        setPosition({ x: 0, y: 0 });
        setFade(false);
      }, 200);
    }
  };

  const selectSlide = (index) => {
    setFade(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setZoomLevel(1);
      setPosition({ x: 0, y: 0 });
      setFade(false);
    }, 200);
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

  useEffect(() => {
    setCurrentIndex(selectedImageIndex);
  }, [selectedImageIndex]);

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

  // Premium styling variables
  const premiumStyles = {
    modalDialog: {
      margin: 0,
      maxWidth: 'none',
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    modalContent: {
      width: '100%',
      height: '100%',
      margin: 0,
      backgroundColor: "#000000",
      border: "none",
      borderRadius: 0,
      boxShadow: "none",
      overflow: "hidden",
      display: 'flex',
      flexDirection: 'column'
    },
    header: {
      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      padding: "1rem 1.5rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: "rgba(0, 0, 0, 0.9)",
      flexShrink: 0,
      zIndex: 1000
    },
    closeButton: {
      color: "#fff",
      background: "rgba(255, 255, 255, 0.1)",
      border: "none",
      borderRadius: "50%",
      width: "32px",
      height: "32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontSize: "18px",
      fontWeight: "bold"
    },
    zoomButton: {
      background: "rgba(255, 255, 255, 0.1)",
      border: "none",
      borderRadius: "8px",
      color: "#fff",
      width: "40px",
      height: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "all 0.2s ease",
      margin: "0 4px",
      fontSize: "18px",
      fontWeight: "bold"
    },
    navButton: {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      background: "rgba(0, 0, 0, 0.7)",
      border: "none",
      borderRadius: "50%",
      width: "50px",
      height: "50px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.5)",
      zIndex: 10,
      color: "#fff",
      fontSize: "20px",
      transition: "all 0.3s ease"
    },
    thumbnail: {
      width: "60px",
      height: "60px",
      objectFit: "cover",
      cursor: "pointer",
      borderRadius: "8px",
      transition: "all 0.3s ease",
      border: "2px solid transparent"
    },
    mainBody: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: "#000000",
      position: 'relative',
      overflow: 'hidden'
    }
  };

  return (
    <Modal
      isOpen={modal}
      toggle={toggle}
      centered={false}
      size="xl"
      className="image-modal fullscreen-modal"
      style={{ 
        margin: 0,
        maxWidth: 'none',
        height: '100vh'
      }}
      contentClassName="fullscreen-modal-content"
    >
      <style jsx>{`
        .fullscreen-modal .modal-dialog {
          margin: 0 !important;
          max-width: none !important;
          width: 100vw !important;
          height: 100vh !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .fullscreen-modal-content {
          width: 100% !important;
          height: 100% !important;
          margin: 0 !important;
          background-color: #000000 !important;
          border: none !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          overflow: hidden !important;
          display: flex !important;
          flex-direction: column !important;
        }
      `}</style>
      
      <div style={premiumStyles.header}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <button 
            style={premiumStyles.zoomButton} 
            onClick={zoomOut} 
            disabled={zoomLevel <= 1}
            onMouseOver={(e) => e.target.style.background = "rgba(255, 255, 255, 0.2)"}
            onMouseOut={(e) => e.target.style.background = "rgba(255, 255, 255, 0.1)"}
          >
            −
          </button>
          <span style={{ 
            margin: "0 12px", 
            color: "#fff", 
            fontWeight: "500",
            minWidth: "60px",
            textAlign: "center"
          }}>
            {Math.round(zoomLevel * 100)}%
          </span>
          <button 
            style={premiumStyles.zoomButton} 
            onClick={zoomIn} 
            disabled={zoomLevel >= 5}
            onMouseOver={(e) => e.target.style.background = "rgba(255, 255, 255, 0.2)"}
            onMouseOut={(e) => e.target.style.background = "rgba(255, 255, 255, 0.1)"}
          >
            +
          </button>
          {zoomLevel > 1 && (
            <button 
              style={{
                ...premiumStyles.zoomButton,
                marginLeft: "12px",
                borderRadius: "20px",
                width: "auto",
                padding: "0 16px"
              }} 
              onClick={resetZoom}
              onMouseOver={(e) => e.target.style.background = "rgba(255, 255, 255, 0.2)"}
              onMouseOut={(e) => e.target.style.background = "rgba(255, 255, 255, 0.1)"}
            >
              Reset
            </button>
          )}
        </div>
        <button 
          style={premiumStyles.closeButton}
          onClick={toggle}
          onMouseOver={(e) => {
            e.target.style.background = "rgba(255, 255, 255, 0.2)";
            e.target.style.transform = "rotate(90deg)";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "rgba(255, 255, 255, 0.1)";
            e.target.style.transform = "rotate(0deg)";
          }}
        >
          ×
        </button>
      </div>

      <div style={premiumStyles.mainBody}>
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
                padding: '20px'
              }}
            >
              <div 
                className="image-container"
                style={{ 
                  overflow: "hidden", 
                  display: "inline-block",
                  cursor: zoomLevel > 1 ? (isDragging ? "grabbing" : "grab") : "default",
                  maxWidth: "100%",
                  maxHeight: "100%",
                  borderRadius: "8px",
                  boxShadow: "0 10px 25px rgba(255, 255, 255, 0.1)",
                  transition: "all 0.3s ease"
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
                    maxWidth: "calc(100vw - 40px)",
                    maxHeight: "calc(100vh - 200px)",
                    objectFit: "contain",
                    borderRadius: "8px",
                    transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
                    transition: isDragging ? "none" : "transform 0.3s ease, opacity 0.2s ease",
                    opacity: fade ? 0 : 1
                  }}
                />
              </div>

              {/* Navigation Buttons */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    style={{
                      ...premiumStyles.navButton,
                      left: "20px"
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = "rgba(255, 255, 255, 0.15)";
                      e.target.style.transform = "translateY(-50%) scale(1.1)";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = "rgba(0, 0, 0, 0.7)";
                      e.target.style.transform = "translateY(-50%) scale(1)";
                    }}
                  >
                    ❮
                  </button>
                  <button
                    onClick={nextSlide}
                    style={{
                      ...premiumStyles.navButton,
                      right: "20px"
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = "rgba(255, 255, 255, 0.15)";
                      e.target.style.transform = "translateY(-50%) scale(1.1)";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = "rgba(0, 0, 0, 0.7)";
                      e.target.style.transform = "translateY(-50%) scale(1)";
                    }}
                  >
                    ❯
                  </button>
                </>
              )}

              {/* Image Counter */}
              {images.length > 1 && (
                <div style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  background: "rgba(0, 0, 0, 0.7)",
                  color: "#fff",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  fontSize: "14px",
                  fontWeight: "500"
                }}>
                  {currentIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "12px",
                overflowX: "auto",
                padding: "15px 20px",
                background: "rgba(0, 0, 0, 0.8)",
                borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                flexShrink: 0
              }}
            >
              {images.map((img, idx) => (
                <div key={idx} style={{ position: "relative", flexShrink: 0 }}>
                  <img
                    src={img}
                    alt={`Thumb ${idx}`}
                    onClick={() => selectSlide(idx)}
                    style={{
                      ...premiumStyles.thumbnail,
                      border: idx === currentIndex ? "2px solid #6366f1" : "2px solid rgba(255, 255, 255, 0.2)",
                      opacity: idx === currentIndex ? 1 : 0.7,
                      transform: idx === currentIndex ? "scale(1.1)" : "scale(1)"
                    }}
                    onMouseOver={(e) => {
                      if (idx !== currentIndex) {
                        e.target.style.opacity = "0.9";
                        e.target.style.transform = "scale(1.05)";
                      }
                    }}
                    onMouseOut={(e) => {
                      if (idx !== currentIndex) {
                        e.target.style.opacity = "0.7";
                        e.target.style.transform = "scale(1)";
                      }
                    }}
                  />
                  {idx === currentIndex && (
                    <div style={{
                      position: "absolute",
                      bottom: "-5px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#6366f1",
                      boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.3)"
                    }}></div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: "rgba(255, 255, 255, 0.7)"
          }}>
            <div style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px"
            }}>
              <span style={{ fontSize: "30px" }}>🖼️</span>
            </div>
            <p style={{ fontSize: "18px", fontWeight: "500", margin: 0 }}>No images available</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ModalComponent;