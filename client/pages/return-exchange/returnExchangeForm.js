import React, { useState } from "react";
import { Input, Button, Form, FormFeedback } from "reactstrap";
import toast from "react-hot-toast";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

function ReturnExchangeForm() {
  const [formData, setFormData] = useState({
    name: "",
    orderId: "",
    email: "",
    number: "",
    type: "exchange",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Your Google Apps Script Web App URL
  const SPREADSHEET_URL =
    "https://script.google.com/macros/s/AKfycbwsCo_72Jv3M4MVuIywciqHU-DFmF1Wy-c3xE0b8XrmYrUsjq4AtcioHd2lam2OHyzi/exec";

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Handle radio changes
  const handleRadioChange = (e) => {
    setFormData({ ...formData, type: e.target.value });
  };

  // Simple validation
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.orderId.trim()) newErrors.orderId = "Order ID is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.number.trim()) newErrors.number = "Number is required.";
    if (!formData.type.trim()) newErrors.type = "Type is required.";
    if (!formData.message.trim()) newErrors.message = "Message is required.";
    return newErrors;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataPayload = new FormData();
      formDataPayload.append("name", formData.name);
      formDataPayload.append("orderId", formData.orderId);
      formDataPayload.append("email", formData.email);
      formDataPayload.append("number", formData.number);
      formDataPayload.append("type", formData.type);
      formDataPayload.append("message", formData.message);

      const response = await fetch(SPREADSHEET_URL, {
        method: "POST",
        body: formDataPayload,
      });

      const result = await response.json();

      if (result.status === "success") {
        toast.success("Form submitted successfully!");
        setFormData({
          name: "",
          orderId: "",
          email: "",
          number: "",
          type: "exchange",
          message: "",
        });
        setErrors({});
      } else {
        toast.error("Something went wrong. Please try again!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit. Please try again later!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      style={{
        flexDirection: "column",
        gap: "10px",
        width: "100%",
        paddingBottom: "20px",
      }}
      className="subscribe-form"
    >
      <Input
        type="text"
        id="orderId"
        value={formData.orderId}
        onChange={handleChange}
        invalid={!!errors.orderId}
        placeholder="Enter your Order Id"
        style={{ width: "100%" }}
      />
      {errors.orderId && <FormFeedback>{errors.orderId}</FormFeedback>}

      <Input
        type="text"
        id="name"
        value={formData.name}
        onChange={handleChange}
        invalid={!!errors.name}
        placeholder="Enter your Name"
        style={{ width: "100%" }}
      />
      {errors.name && <FormFeedback>{errors.name}</FormFeedback>}

      <Input
        type="email"
        id="email"
        value={formData.email}
        onChange={handleChange}
        invalid={!!errors.email}
        placeholder="Enter your Email"
        style={{ width: "100%" }}
      />
      {errors.email && <FormFeedback>{errors.email}</FormFeedback>}

      <Input
        type="text"
        id="number"
        value={formData.number}
        onChange={handleChange}
        invalid={!!errors.number}
        placeholder="Enter your Number"
        style={{ width: "100%" }}
      />
      {errors.number && <FormFeedback>{errors.number}</FormFeedback>}

      <FormControl component="fieldset" error={!!errors.type}>
        <FormLabel component="legend">Select an Option</FormLabel>
        <RadioGroup
          style={{ marginLeft: "10px" }}
          name="type"
          value={formData.type}
          onChange={handleRadioChange}
        >
          <FormControlLabel
            value="exchange"
            control={<Radio />}
            label="Exchange"
          />
          <FormControlLabel
            value="return"
            control={<Radio />}
            label="Return"
          />
        </RadioGroup>
        {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
      </FormControl>

      <Input
        type="textarea"
        id="message"
        value={formData.message}
        onChange={handleChange}
        invalid={!!errors.message}
        placeholder="Message"
        style={{ width: "100%" }}
      />
      {errors.message && <FormFeedback>{errors.message}</FormFeedback>}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "10px",
        }}
      >
        <Button
          style={{ width: "fit-content" }}
          type="submit"
          className="btn btn-solid"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </Form>
  );
}

export default ReturnExchangeForm;
