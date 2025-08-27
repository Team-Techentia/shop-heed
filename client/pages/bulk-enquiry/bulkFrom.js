import React, { useState } from "react";
import {
  Input,
  Button,
  Form,
  FormFeedback,
  Label,
  FormGroup,
  Row,
  Col,
} from "reactstrap";
import Api from "../../components/Api";
import toast from "react-hot-toast";

function BulkForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    natureOfBusiness: "",
    email: "",
    phoneNumber: "",
    preferredContact: "",
    productsInterested: "",
    quantityRequired: "",
    shippingAddress: "",
    deliveryDate: "",
    additionalInfo: "",
    priceRange: "",
    heardAboutUs: "",
    otherSource: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const validate = () => {
    const errors = {};
    if (!formData.fullName) errors.fullName = "Full Name is required.";
    if (!formData.email) errors.email = "Email is required.";
    if (!formData.phoneNumber) errors.phoneNumber = "Phone Number is required.";
    if (!formData.productsInterested)
      errors.productsInterested = "Products Interested In is required.";
    if (!formData.quantityRequired)
      errors.quantityRequired = "Quantity is required.";
    if (!formData.shippingAddress)
      errors.shippingAddress = "Shipping Address is required.";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await Api.BulkEnquiry(formData);
      toast.success("Form submitted successfully");
      setFormData({
        fullName: "",
        companyName: "",
        natureOfBusiness: "",
        email: "",
        phoneNumber: "",
        preferredContact: "",
        productsInterested: "",
        quantityRequired: "",
        shippingAddress: "",
        deliveryDate: "",
        additionalInfo: "",
        priceRange: "",
        heardAboutUs: "",
        otherSource: "",
      });
      setErrors({});
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form
    className="bulk-from"
      onSubmit={handleSubmit}
      style={{ width: "100%", paddingBottom: "20px", textAlign: "left" }}
    >
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="fullName">Full Name</Label>
            <Input
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={handleChange}
              invalid={!!errors.fullName}
              placeholder="Full Name"
            />
            {errors.fullName && <FormFeedback>{errors.fullName}</FormFeedback>}
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="companyName">
              Company/Organization Name (if applicable)
            </Label>
            <Input
              type="text"
              id="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Company/Organization Name"
            />
          </FormGroup>
        </Col>
      </Row>

      <FormGroup>
        <Label>Nature of Business</Label>
        <Input
          type="select"
          id="natureOfBusiness"
          value={formData.natureOfBusiness}
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option value="Retail Store">Retail Store</option>
          <option value="Re-Wholesaler / Supplier">
            Re-Wholesaler / Supplier
          </option>
          <option value="Others">Others</option>
        </Input>
      </FormGroup>

      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="email">Email Address</Label>
            <Input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              invalid={!!errors.email}
              placeholder="Enter your Email"
            />
            {errors.email && <FormFeedback>{errors.email}</FormFeedback>}
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="phoneNumber">Phone Number</Label>
            <Input
              type="number"
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              invalid={!!errors.phoneNumber}
              placeholder="Enter your Phone Number"
            />
            {errors.phoneNumber && (
              <FormFeedback>{errors.phoneNumber}</FormFeedback>
            )}
          </FormGroup>
        </Col>
      </Row>

      <FormGroup className="bulk-radio">
        <Label>Preferred Method of Contact</Label>
        <FormGroup check>
          <Label check>
            <Input
              type="radio"
              id="preferredContact"
              value="Email"
              checked={formData.preferredContact === "Email"}
              onChange={handleChange}
            />
            Email
          </Label>
        </FormGroup>
        <FormGroup check>
          <Label check>
            <Input
              type="radio"
              id="preferredContact"
              value="Phone"
              checked={formData.preferredContact === "Phone"}
              onChange={handleChange}
            />
            Phone
          </Label>
        </FormGroup>
      </FormGroup>
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="productsInterested">Products Interested In</Label>
            <Input
              type="text"
              id="productsInterested"
              value={formData.productsInterested}
              onChange={handleChange}
              invalid={!!errors.productsInterested}
              placeholder="e.g., T-shirts, Jeans, etc."
            />
            {errors.productsInterested && (
              <FormFeedback>{errors.productsInterested}</FormFeedback>
            )}
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="deliveryDate">Preferred Delivery Date</Label>
            <Input
              type="date"
              id="deliveryDate"
              value={formData.deliveryDate}
              onChange={handleChange}
            />
          </FormGroup>
        </Col>
      </Row>
      <FormGroup>
        <Label for="shippingAddress">Shipping Address</Label>
        <Input
          type="textarea"
          id="shippingAddress"
          value={formData.shippingAddress}
          onChange={handleChange}
          invalid={!!errors.shippingAddress}
        />
        {errors.shippingAddress && (
          <FormFeedback>{errors.shippingAddress}</FormFeedback>
        )}
      </FormGroup>

      <FormGroup>
        <Label for="quantityRequired">
          Quantity Required (Minimum Order: [Insert Minimum Quantity])
        </Label>
        <Input
          type="number"
          id="quantityRequired"
          value={formData.quantityRequired}
          onChange={handleChange}
          invalid={!!errors.quantityRequired}
        />
        {errors.quantityRequired && (
          <FormFeedback>{errors.quantityRequired}</FormFeedback>
        )}
      </FormGroup>

      <FormGroup>
        <Label for="additionalInfo">
          Any Additional Information / Specific Requirement
        </Label>
        <Input
          type="textarea"
          id="additionalInfo"
          value={formData.additionalInfo}
          onChange={handleChange}
        />
      </FormGroup>

      <FormGroup>
        <Label for="priceRange">
          Approximate Price Range of the Product (e.g., Under 500)
        </Label>
        <Input
          type="number"
          id="priceRange"
          value={formData.priceRange}
          onChange={handleChange}
        />
      </FormGroup>

      <FormGroup>
        <Label>How Did You Hear About Us?</Label>
        <Input
          type="select"
          id="heardAboutUs"
          value={formData.heardAboutUs}
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option value="Search Engine">Search Engine</option>
          <option value="Social Media">Social Media</option>
          <option value="Referral">Referral</option>
          <option value="Other">Other</option>
        </Input>
        {formData.heardAboutUs === "Other" && (
          <Input
            type="text"
            id="otherSource"
            value={formData.otherSource}
            onChange={handleChange}
            placeholder="Please specify"
          />
        )}
      </FormGroup>

      <Button className="btn-solid" type="submit"  disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </Form>
  );
}

export default BulkForm;
