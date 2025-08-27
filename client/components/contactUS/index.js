import React, { useState } from "react";
import {  Input, Button, Form, FormFeedback } from "reactstrap";
import Api from "../Api";
import toast from 'react-hot-toast';
import Link from "next/link";
function ContactUsForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    message: '',
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
    if (!formData.name) errors.name = "Name is required.";
    if (!formData.email) errors.email = "Email is required.";
    if (!formData.number) errors.number = "Number is required.";
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
     const  {name,email , number,message} = formData
    try {
      const res = await Api.contactUs({name:name , email:email , message:message , phone:number})
    
      toast.success("Form submitted successfully")
    
      setFormData({
        name: '',
        email: '',
        number: '',
        message: '',
      });
      setErrors({});
      return 
    } catch (error) {
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
      
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
              <Button
                style={{ width: "fit-content" }}
                type="submit"
                className="btn btn-solid"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>

              <Link href="/bulk-enquiry">
              <Button
                style={{ width: "fit-content" }}
                type="button"
                className="btn btn-solid"
                // disabled={isSubmitting}
              >
                Bulk Enquiry
              </Button>
              </Link>
            </div>
      </Form>
    

  );
}

export default ContactUsForm;
