'use client';
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
  Form,
  FormGroup,
  Badge,
  Spinner
} from "reactstrap";
import toast from "react-hot-toast";

export default function AdminReviewDashboard() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [emailModal, setEmailModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [emailData, setEmailData] = useState({
    subject: "Thank you for your review!",
    emailMessage: "",
  });

  // Fixed API URL - make sure this matches your backend
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3110/api";

  // Fetch all reviews
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
      
      const response = await fetch(`${API_URL}review/get-all-reviews`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        setReviews(result.data);
      } else {
        toast.error(result.message || "Failed to fetch reviews");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Approve review
  const handleApprove = async (id, isApproved) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
      
      const response = await fetch(
        `${API_URL}/review/approve-review/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isApproved }),
        }
      );

      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
        fetchReviews();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error approving review:", error);
      toast.error("Failed to update review");
    }
  };

  // Publish review
  const handlePublish = async (id, isPublished) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
      
      const response = await fetch(
        `${API_URL}/review/update-review/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isPublished }),
        }
      );

      const result = await response.json();
      if (result.success) {
        toast.success("Review publication status updated");
        fetchReviews();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error publishing review:", error);
      toast.error("Failed to update review");
    }
  };

  // Delete review
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
      
      const response = await fetch(
        `${API_URL}/review/delete-review/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      if (result.success) {
        toast.success("Review deleted successfully");
        fetchReviews();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    }
  };

  // Send email
  const handleSendEmail = async () => {
    if (!selectedReview) return;

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
      
      const response = await fetch(
        `${API_URL}review/send-email/${selectedReview._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(emailData),
        }
      );

      const result = await response.json();
      if (result.success) {
        toast.success("Email sent successfully!");
        setEmailModal(false);
        setEmailData({
          subject: "Thank you for your review!",
          emailMessage: "",
        });
        fetchReviews();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email");
    }
  };

  // Open email modal
  const openEmailModal = (review) => {
    setSelectedReview(review);
    setEmailData({
      subject: "Thank you for your review!",
      emailMessage: `Hello ${review.name},\n\nThank you for your ${review.rating}-star review! We truly appreciate your feedback.\n\nYour review helps us improve our services and assists other customers in making informed decisions.\n\nBest regards,\nThe Team`,
    });
    setEmailModal(true);
  };

  // Open view modal
  const openViewModal = (review) => {
    setSelectedReview(review);
    setViewModal(true);
  };

  // Render star rating
  const renderStars = (rating) => {
    return "⭐".repeat(rating);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h2>Review Management</h2>
        <Button color="primary" onClick={fetchReviews}>
          Refresh
        </Button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spinner color="primary" />
        </div>
      ) : (
        <Table responsive bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Email Sent</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No reviews found
                </td>
              </tr>
            ) : (
              reviews.map((review, index) => (
                <tr key={review._id}>
                  <td>{index + 1}</td>
                  <td>{review.name}</td>
                  <td>{review.email}</td>
                  <td>{renderStars(review.rating)}</td>
                  <td>
                    <Badge color={review.isApproved ? "success" : "warning"}>
                      {review.isApproved ? "Approved" : "Pending"}
                    </Badge>
                    <br />
                    <Badge color={review.isPublished ? "info" : "secondary"}>
                      {review.isPublished ? "Published" : "Unpublished"}
                    </Badge>
                  </td>
                  <td>
                    {review.emailSent ? (
                      <Badge color="success">Sent</Badge>
                    ) : (
                      <Badge color="secondary">Not Sent</Badge>
                    )}
                  </td>
                  <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                      <Button
                        size="sm"
                        color="info"
                        onClick={() => openViewModal(review)}
                      >
                        View
                      </Button>
                      
                      {!review.isApproved ? (
                        <Button
                          size="sm"
                          color="success"
                          onClick={() => handleApprove(review._id, true)}
                        >
                          Approve
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          color="warning"
                          onClick={() => handleApprove(review._id, false)}
                        >
                          Unapprove
                        </Button>
                      )}

                      {review.isApproved && (
                        <Button
                          size="sm"
                          color={review.isPublished ? "secondary" : "primary"}
                          onClick={() =>
                            handlePublish(review._id, !review.isPublished)
                          }
                        >
                          {review.isPublished ? "Unpublish" : "Publish"}
                        </Button>
                      )}

                      <Button
                        size="sm"
                        color="info"
                        onClick={() => openEmailModal(review)}
                      >
                        Send Email
                      </Button>

                      <Button
                        size="sm"
                        color="danger"
                        onClick={() => handleDelete(review._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}

      {/* View Review Modal */}
      <Modal isOpen={viewModal} toggle={() => setViewModal(false)} size="lg">
        <ModalHeader toggle={() => setViewModal(false)}>
          Review Details
        </ModalHeader>
        <ModalBody>
          {selectedReview && (
            <div>
              <p><strong>Name:</strong> {selectedReview.name}</p>
              <p><strong>Email:</strong> {selectedReview.email}</p>
              <p><strong>Phone:</strong> {selectedReview.number}</p>
              <p><strong>Rating:</strong> {renderStars(selectedReview.rating)} ({selectedReview.rating}/5)</p>
              <p><strong>Message:</strong></p>
              <p style={{ whiteSpace: "pre-wrap", backgroundColor: "#f5f5f5", padding: "10px", borderRadius: "5px" }}>
                {selectedReview.message}
              </p>
              <p><strong>Submitted:</strong> {new Date(selectedReview.createdAt).toLocaleString()}</p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setViewModal(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

      {/* Send Email Modal */}
      <Modal isOpen={emailModal} toggle={() => setEmailModal(false)}>
        <ModalHeader toggle={() => setEmailModal(false)}>
          Send Email to {selectedReview?.name}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="subject">Email Subject</Label>
              <Input
                type="text"
                id="subject"
                value={emailData.subject}
                onChange={(e) =>
                  setEmailData({ ...emailData, subject: e.target.value })
                }
              />
            </FormGroup>
            <FormGroup>
              <Label for="emailMessage">Email Message</Label>
              <Input
                type="textarea"
                id="emailMessage"
                rows="8"
                value={emailData.emailMessage}
                onChange={(e) =>
                  setEmailData({ ...emailData, emailMessage: e.target.value })
                }
              />
            </FormGroup>
            <div style={{ backgroundColor: "#f0f8ff", padding: "10px", borderRadius: "5px", marginTop: "10px" }}>
              <small><strong>Note:</strong> The email will include the customer's review details (rating and message) automatically.</small>
            </div>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSendEmail}>
            Send Email
          </Button>
          <Button color="secondary" onClick={() => setEmailModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}