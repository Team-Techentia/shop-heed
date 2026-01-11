import { Href } from "@/Constants";
import { ChangeEvent, FormEvent, useState } from "react";
import { Eye, EyeOff } from "react-feather";
import { toast } from "react-toastify";
import {
  Button,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Spinner,
} from "reactstrap";
import Api from "@/Components/Api";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const AdminRegisterForm = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const {
      name,
      email,
      phoneNumber,
      password,
      confirmPassword,
      agreeTerms,
    } = formValues;

    if (!name || !email || !phoneNumber || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    const phoneRegex = /^[6789]\d{9,11}$/;
    if (!phoneRegex.test(phoneNumber)) {
      toast.error("Please enter a valid phone number");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    if (!agreeTerms) {
      toast.error("Please agree to the Terms & Conditions");
      return false;
    }

    return true;
  };

  const formSubmitHandle = async (event: FormEvent) => {
  event.preventDefault();

  if (!validateForm()) return;

  setLoading(true);

  try {
    // 🔓 token OPTIONAL (null for first admin)
    const token = Cookies.get("token") || null;

    const adminData = {
      name: formValues.name,
      email: formValues.email,
      phoneNumber: formValues.phoneNumber,
      password: formValues.password,
    };

    const response = await Api.createAdmin(adminData, token);

    if (response?.data?.success) {
      toast.success(
        response.data.message || "Admin created successfully!"
      );

      setFormValues({
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        agreeTerms: false,
      });
    } else {
      toast.error(response.data.message || "Failed to create admin");
    }
  } catch (error: any) {
    console.error("Admin registration error:", error);

    const message =
      error?.response?.data?.message ||
      "Failed to create admin account";

    toast.error(message);
  } finally {
    setLoading(false);
  }
};


  return (
    <Form className="form-horizontal auth-form" onSubmit={formSubmitHandle}>
      <FormGroup>
        <Label>Full Name *</Label>
        <Input
          name="name"
          value={formValues.name}
          onChange={handleInputChange}
          disabled={loading}
          placeholder="Enter full name"
        />
      </FormGroup>

      <FormGroup>
        <Label>Email *</Label>
        <Input
          type="email"
          name="email"
          value={formValues.email}
          onChange={handleInputChange}
          disabled={loading}
          placeholder="admin@example.com"
        />
      </FormGroup>

      <FormGroup>
        <Label>Phone Number *</Label>
        <Input
          type="tel"
          name="phoneNumber"
          value={formValues.phoneNumber}
          onChange={handleInputChange}
          disabled={loading}
          placeholder="9876543210"
          maxLength={12}
        />
      </FormGroup>

      <FormGroup>
        <Label>Password *</Label>
        <InputGroup>
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formValues.password}
            onChange={handleInputChange}
            disabled={loading}
          />
          <InputGroupText
            onClick={() => setShowPassword(!showPassword)}
            style={{ cursor: "pointer" }}
          >
            {showPassword ? <Eye /> : <EyeOff />}
          </InputGroupText>
        </InputGroup>
      </FormGroup>

      <FormGroup>
        <Label>Confirm Password *</Label>
        <InputGroup>
          <Input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formValues.confirmPassword}
            onChange={handleInputChange}
            disabled={loading}
          />
          <InputGroupText
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{ cursor: "pointer" }}
          >
            {showConfirmPassword ? <Eye /> : <EyeOff />}
          </InputGroupText>
        </InputGroup>
      </FormGroup>

      <Label className="d-block">
        <Input
          type="checkbox"
          name="agreeTerms"
          checked={formValues.agreeTerms}
          onChange={handleInputChange}
          disabled={loading}
        />{" "}
        I agree to <a href={Href}>Terms & Conditions</a>
      </Label>

      <Button color="primary" type="submit" block disabled={loading}>
        {loading ? <Spinner size="sm" /> : "Create Admin Account"}
      </Button>
    </Form>
  );
};

export default AdminRegisterForm;
