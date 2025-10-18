// ==================== Data/ReviewForm.jsx (FULL VERSION) ====================
'use client';
import React, { useState } from "react";
import { Input, Button, Form, FormFeedback, Label, Card, CardBody } from "reactstrap";
import toast from "react-hot-toast";

function ReviewForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    rating: 5,
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // API URL
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3110/api";

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
    // Clear error when typing
    if (errors[id]) {
      setErrors({
        ...errors,
        [id]: ""
      });
    }
  };

  // Handle rating change
  const handleRatingChange = (rating) => {
    setFormData({
      ...formData,
      rating,
    });
    if (errors.rating) {
      setErrors({
        ...errors,
        rating: ""
      });
    }
  };

  // Validation
  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters.";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    
    if (!formData.number.trim()) {
      newErrors.number = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.number.replace(/\D/g, ''))) {
      newErrors.number = "Phone number must be exactly 10 digits.";
    }
    
    if (!formData.message.trim()) {
      newErrors.message = "Review message is required.";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Review must be at least 10 characters.";
    }
    
    if (!formData.rating) {
      newErrors.rating = "Please select a rating.";
    }
    
    return newErrors;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fill all required fields correctly!");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("📤 Submitting review to:", `${API_URL}review/submit-review`);
      console.log("📝 Form Data:", formData);

      const response = await fetch(`${API_URL}review/submit-review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log("📨 Response:", result);

      if (result.success) {
        toast.success("🎉 Thank you! Your review has been submitted successfully!", {
          duration: 4000,
          position: 'top-center',
        });
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          number: "",
          rating: 5,
          message: "",
        });
        setErrors({});

        // Additional success message
        setTimeout(() => {
          toast.success("✅ We'll review your feedback soon!");
        }, 1500);
      } else {
        toast.error(result.message || "❌ Something went wrong. Please try again!");
      }
    } catch (error) {
      console.error("❌ Error submitting review:", error);
      toast.error("Failed to submit. Please check your connection and try again!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <Form onSubmit={handleSubmit}>
        {/* Name Field */}
        <div style={{ marginBottom: "25px" }}>
          <Label for="name" style={{ fontWeight: "600", fontSize: "15px", marginBottom: "8px", display: "block" }}>
            Full Name <span style={{ color: "red" }}>*</span>
          </Label>
          <Input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            invalid={!!errors.name}
            placeholder="Enter your full name"
            style={{ 
              padding: "12px 15px", 
              fontSize: "15px",
              borderRadius: "8px",
              border: "2px solid #e0e0e0"
            }}
          />
          {errors.name && <FormFeedback style={{ fontSize: "13px" }}>{errors.name}</FormFeedback>}
        </div>

        {/* Email Field */}
        <div style={{ marginBottom: "25px" }}>
          <Label for="email" style={{ fontWeight: "600", fontSize: "15px", marginBottom: "8px", display: "block" }}>
            Email Address <span style={{ color: "red" }}>*</span>
          </Label>
          <Input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            invalid={!!errors.email}
            placeholder="your.email@example.com"
            style={{ 
              padding: "12px 15px", 
              fontSize: "15px",
              borderRadius: "8px",
              border: "2px solid #e0e0e0"
            }}
          />
          {errors.email && <FormFeedback style={{ fontSize: "13px" }}>{errors.email}</FormFeedback>}
        </div>

        {/* Phone Number Field */}
        <div style={{ marginBottom: "25px" }}>
          <Label for="number" style={{ fontWeight: "600", fontSize: "15px", marginBottom: "8px", display: "block" }}>
            Phone Number <span style={{ color: "red" }}>*</span>
          </Label>
          <Input
            type="text"
            id="number"
            value={formData.number}
            onChange={handleChange}
            invalid={!!errors.number}
            placeholder="Enter 10 digit mobile number"
            maxLength={10}
            style={{ 
              padding: "12px 15px", 
              fontSize: "15px",
              borderRadius: "8px",
              border: "2px solid #e0e0e0"
            }}
          />
          {errors.number && <FormFeedback style={{ fontSize: "13px" }}>{errors.number}</FormFeedback>}
          <small style={{ color: "#666", display: "block", marginTop: "5px", fontSize: "13px" }}>
            Enter your 10-digit mobile number without country code
          </small>
        </div>

        {/* Rating Field */}
        <div style={{ marginBottom: "25px" }}>
          <Label style={{ fontWeight: "600", fontSize: "15px", marginBottom: "12px", display: "block" }}>
            How would you rate your experience? <span style={{ color: "red" }}>*</span>
          </Label>
          
          <Card style={{ 
            backgroundColor: "#f8f9fa", 
            border: errors.rating ? "2px solid #dc3545" : "2px solid #e0e0e0",
            borderRadius: "10px",
            padding: "20px"
          }}>
            <CardBody style={{ padding: "10px" }}>
              <div style={{ display: "flex", gap: "15px", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <div key={star} style={{ textAlign: "center" }}>
                    <span
                      onClick={() => handleRatingChange(star)}
                      style={{
                        fontSize: "48px",
                        cursor: "pointer",
                        color: star <= formData.rating ? "#FFD700" : "#ddd",
                        transition: "all 0.3s ease",
                        transform: star <= formData.rating ? "scale(1.1)" : "scale(1)",
                        display: "inline-block",
                        textShadow: star <= formData.rating ? "0 2px 4px rgba(255,215,0,0.3)" : "none"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "scale(1.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = star <= formData.rating ? "scale(1.1)" : "scale(1)";
                      }}
                    >
                      ★
                    </span>
                  </div>
                ))}
              </div>
              
              <div style={{ textAlign: "center", marginTop: "15px" }}>
                <span style={{ 
                  fontSize: "20px", 
                  fontWeight: "700", 
                  color: formData.rating >= 4 ? "#28a745" : formData.rating >= 3 ? "#ffc107" : "#dc3545",
                  backgroundColor: "white",
                  padding: "8px 20px",
                  borderRadius: "25px",
                  display: "inline-block"
                }}>
                  {formData.rating}/5 Stars
                </span>
              </div>

              <div style={{ textAlign: "center", marginTop: "10px" }}>
                <small style={{ color: "#666", fontSize: "14px" }}>
                  {formData.rating === 5 && "⭐ Excellent!"}
                  {formData.rating === 4 && "👍 Very Good!"}
                  {formData.rating === 3 && "😊 Good"}
                  {formData.rating === 2 && "😐 Fair"}
                  {formData.rating === 1 && "😔 Poor"}
                </small>
              </div>
            </CardBody>
          </Card>
          
          {errors.rating && (
            <div style={{ color: "#dc3545", fontSize: "13px", marginTop: "8px" }}>
              {errors.rating}
            </div>
          )}
        </div>

        {/* Message Field */}
        <div style={{ marginBottom: "25px" }}>
          <Label for="message" style={{ fontWeight: "600", fontSize: "15px", marginBottom: "8px", display: "block" }}>
            Share Your Experience <span style={{ color: "red" }}>*</span>
          </Label>
          <Input
            type="textarea"
            id="message"
            value={formData.message}
            onChange={handleChange}
            invalid={!!errors.message}
            placeholder="Tell us what you liked or what we can improve..."
            rows="6"
            style={{ 
              padding: "15px", 
              fontSize: "15px",
              borderRadius: "8px",
              border: "2px solid #e0e0e0",
              lineHeight: "1.6"
            }}
          />
          {errors.message && <FormFeedback style={{ fontSize: "13px" }}>{errors.message}</FormFeedback>}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
            <small style={{ color: "#666", fontSize: "13px" }}>
              Minimum 10 characters required
            </small>
            <small style={{ 
              color: formData.message.length >= 10 ? "#28a745" : "#999", 
              fontSize: "13px",
              fontWeight: "600"
            }}>
              {formData.message.length} characters
            </small>
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ marginTop: "35px" }}>
          <Button
            color="success"
            type="submit"
            disabled={isSubmitting}
            style={{
              width: "100%",
              padding: "16px",
              fontSize: "18px",
              fontWeight: "700",
              borderRadius: "10px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
              border: "none"
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
            }}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Submitting Your Review...
              </>
            ) : (
              <>
                📝 Submit Review
              </>
            )}
          </Button>
        </div>

        {/* Info Message */}
        <div style={{ 
          marginTop: "25px", 
          padding: "15px",
          backgroundColor: "#e7f3ff",
          borderLeft: "4px solid #2196F3",
          borderRadius: "5px"
        }}>
          <p style={{ 
            margin: 0, 
            fontSize: "14px", 
            color: "#555",
            lineHeight: "1.6"
          }}>
            <strong>💡 Note:</strong> Your review will be reviewed by our team before being published. 
            We may contact you via email or phone for any clarifications.
          </p>
        </div>
      </Form>
    </div>
  );
}

export default ReviewForm;