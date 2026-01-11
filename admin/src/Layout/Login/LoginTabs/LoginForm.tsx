import { useAppSelector } from "@/Redux/Hooks";
import Cookies from "js-cookie";
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

const LoginForm = () => {
  const {} = useAppSelector((store) => store.LangReducer);

  const [showPassWord, setShowPassWord] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const handleUserValue = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const formSubmitHandle = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await Api.adminLogin(formValues);

      if (response?.data?.success) {
        Cookies.set("token", response.data.token, {
          expires: 7,
          path: "/",
        });

        localStorage.setItem(
          "admin",
          JSON.stringify(response.data.data)
        );

        toast.success("Login successful");

        setTimeout(() => {
          window.location.href = "/en/dashboard";
        }, 500);
      } else {
        toast.error("Invalid email or password");
        setLoading(false);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "An error occurred during login"
      );
      setLoading(false);
    }
  };

  return (
    <Form className="form-horizontal auth-form" onSubmit={formSubmitHandle}>
       <FormGroup>
          <Label htmlFor="adminEmail">Email Address</Label>
          <Input 
            required 
            onChange={handleUserValue} 
            type="email" 
            name="email" 
            value={formValues.email} 
            placeholder="admin@example.com" 
            id="adminEmail"
            disabled={loading}
          />
        </FormGroup>

      <FormGroup>
        <InputGroup>
          <Input
            required
            onChange={handleUserValue}
            type={showPassWord ? "text" : "password"}
            name="password"
            value={formValues.password}
            placeholder="Password"
          />
          <InputGroupText
            style={{ cursor: "pointer" }}
            onClick={() => setShowPassWord(!showPassWord)}
          >
            {showPassWord ? <Eye /> : <EyeOff />}
          </InputGroupText>
        </InputGroup>
      </FormGroup>

      <div className="form-button">
        {loading ? (
          <Button color="primary" disabled>
            <Spinner size="sm" /> Logging in...
          </Button>
        ) : (
          <Button color="primary" type="submit">
            Login
          </Button>
        )}
      </div>
    </Form>
  );
};

export default LoginForm;
