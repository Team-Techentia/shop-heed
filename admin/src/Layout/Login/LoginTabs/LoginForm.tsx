import { useAppSelector } from "@/Redux/Hooks";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { Eye, EyeOff } from "react-feather";
import { toast } from "react-toastify";
import { Button, Form, FormGroup, Input, InputGroup, InputGroupText, Label, Spinner } from "reactstrap";
import SocialMediaIcons from "./SocialMediaIcons";
import Api from "@/Components/Api";

const LoginForm = () => {
  const { i18LangStatus } = useAppSelector((store) => store.LangReducer);
  const [showPassWord, setShowPassWord] = useState(false);
  const [formValues, setFormValues] = useState({
    emailOrPhone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false); // State to manage loading

  const { emailOrPhone, password } = formValues;
  const router = useRouter();

  const handleUserValue = (event: ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [event.target.name]: event.target.value });
  };

  const formSubmitHandle = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true); // Start loading

    try {
      const response = await Api.loginUser(formValues);
      console.log(response.data);

      if (emailOrPhone === formValues.emailOrPhone && password === formValues.password) {
        Cookies.set("token", response.data.token);
        router.push('/en/dashboard');
        toast.success("Login successful");
      } else {
        toast.error("Please enter valid email or password");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message || "An error occurred during login.");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <Form className="form-horizontal auth-form" onSubmit={formSubmitHandle}>
      <FormGroup>
        <Input required onChange={handleUserValue} type="email" name="emailOrPhone" value={formValues.emailOrPhone} placeholder="Username" id="exampleInputEmail1" />
      </FormGroup>
      <FormGroup>
        <InputGroup onClick={() => setShowPassWord(!showPassWord)}>
          <Input required onChange={handleUserValue} type={showPassWord ? "text" : "password"} name="password" value={formValues.password} placeholder="Password" />
          <InputGroupText>{showPassWord ? <Eye /> : <EyeOff />}</InputGroupText>
        </InputGroup>
      </FormGroup>
      <div className="form-terms">
        <div className="custom-control custom-checkbox me-sm-2">
          <Label className="d-block">
            {/* <Input className="checkbox_animated" id="chk-ani2" type="checkbox" />
            Remember Me
            <span className="pull-right">
              <Button color="transparent" className="forgot-pass p-0">
                Lost your password
              </Button>
            </span> */}
          </Label>
        </div>
      </div>
      <div className="form-button">
        {loading ? (
     <Spinner>
        Loading...
     </Spinner>
        ) : (
          <Button color="primary" type="submit">
            Login
          </Button>
        )}
      </div>
      {/* <div className="form-footer">
        <span>Or login with social platforms</span>
        <SocialMediaIcons />
      </div> */}
    </Form>
  );
};

export default LoginForm;
