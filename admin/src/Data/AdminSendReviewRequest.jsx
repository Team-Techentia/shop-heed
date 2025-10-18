// AdminSendReviewRequest.jsx (JavaScript version - no TypeScript errors)
'use client';
import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
  Form,
  FormGroup,
  Card,
  CardBody,
  CardHeader
} from "reactstrap";
import toast from "react-hot-toast";

export default function AdminSendReviewRequest() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    customMessage: "",
  });

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3110/api";

  const toggle = () => setIsOpen(!isOpen);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();

    if (!formData.clientName || !formData.clientEmail) {
      toast.error("Please fill in client name and email!");
      return;
    }

    setIsSending(true);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
      
      const response = await fetch(`${API_URL}review/send-review-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Review request email sent successfully! 📧");
        setFormData({
          clientName: "",
          clientEmail: "",
          customMessage: "",
        });
        setIsOpen(false);
      } else {
        toast.error(result.message || "Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email. Please try again!");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <h4>Send Review Request to Client</h4>
        </CardHeader>
        <CardBody>
          <p>Send an email to your client with a link to submit their review.</p>
          <Button color="primary" onClick={toggle}>
            📧 Send Review Request
          </Button>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} toggle={toggle} size="lg">
        <ModalHeader toggle={toggle}>
          Send Review Request Email
        </ModalHeader>
        <Form onSubmit={handleSendEmail}>
          <ModalBody>
            <FormGroup>
              <Label for="clientName">Client Name *</Label>
              <Input
                type="text"
                id="clientName"
                value={formData.clientName}
                onChange={handleChange}
                placeholder="Enter client's name"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="clientEmail">Client Email *</Label>
              <Input
                type="email"
                id="clientEmail"
                value={formData.clientEmail}
                onChange={handleChange}
                placeholder="client@example.com"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="customMessage">Custom Message (Optional)</Label>
              <Input
                type="textarea"
                id="customMessage"
                value={formData.customMessage}
                onChange={handleChange}
                placeholder="Add a personal message to your client..."
                rows="5"
              />
              <small className="text-muted">
                Leave blank to use the default message
              </small>
            </FormGroup> 

            <div style={{ backgroundColor: "#e7f3ff", padding: "15px", borderRadius: "5px", marginTop: "15px" }}>
              <strong>📧 Email Preview:</strong>
              <p style={{ marginTop: "10px", fontSize: "14px" }}>
                The client will receive an email with a button linking to your review form. 
                Once they submit their review, it will appear in your admin dashboard.
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button 
              color="primary" 
              type="submit"
              disabled={isSending}
            >
              {isSending ? "Sending..." : "Send Email"}
            </Button>
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </div>
  );
}