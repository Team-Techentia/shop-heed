import React, { useState } from "react";
import { Input, Button, Form, FormFeedback } from "reactstrap";
// import Api from "../Api";
import toast from "react-hot-toast";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import Api from "../../components/Api";
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

  const handleChange = (e) => {
    const { id, value } = e.target;
    console.log("id", id);

    console.log("value", value);

    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const validate = () => {
    const errors = {};
    if (!formData.name) errors.name = "Name is required.";
    if (!formData.orderId) errors.orderId = "Order Id is required.";
    if (!formData.email) errors.email = "Email is required.";
    if (!formData.number) errors.number = "Number is required.";
    if (!formData.type) errors.type = "Type is required.";
    if (!formData.message) errors.message = "Message is required.";
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

    //  const  {name,email , number,message} = formData
    try {
      //   const res = await Api.contactUs({name:name , email:email , message:message , phone:number})

      await Api.returnAndExchange(formData);
      toast.success("Form submitted successfully");
      setFormData({
        name: "",
        orderId: "",
        email: "",
        number: "",
        message: "",
      });
      setErrors({});
      return;
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRadioChange = (e) => {
    setFormData({ ...formData, type: e.target.value });
    console.log("Selected type:", e.target.value);
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
          <FormControlLabel value="return" control={<Radio />} label="Return" />
        </RadioGroup>
        {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
      </FormControl>

      <Input
        type="textarea"
        name="message"
        defaultValue={formData.message}
        onChange={(e) => setFormData({...formData, message: e.target.value})}
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
