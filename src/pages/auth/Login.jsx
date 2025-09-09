import { CircularProgress, TextField } from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import { settingUser } from "../../features/authSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/APIs";
import authInputValidation from "../../utils/auth/authInputValidation";
import InputComp from "../../components/ui/InputComp";
function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: null,
    password: null,
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  //fields that will be maped by custom input
  const inputFields = [
    {
      type: "text",
      name: "email",
      placeholder: "email",
      error: errors?.email,
      value: formData.email,
    },
    {
      type: "password",
      name: "password",
      placeholder: "password",
      error: errors?.password,
      value: formData.password,
    },
  ];

  //this is validtion logics that will help to get validation done
  const { validationRootFn } = authInputValidation();

  //comman validation that was said to create
  const validationOnChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    const { error } = validationRootFn(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    let valid = true;
    Object.keys(formData).forEach((key) => {
      const { isValid, error } = validationRootFn(key, formData[key]);
      if (!isValid) {
        valid = false;
        setErrors((prev) => ({ ...prev, [key]: error }));
      }
    });
    return valid;
  };

  //now this is when user clicks login btn so first checking all errors to be null empty and then only proceed
  const handleSubmitLogin = () => {
    if (loading) return; //these are all early exits

    const isValid = validateForm();
    if (!isValid) {
      return;
    }
    const payload = {
      email: formData.email,
      password: formData.password,
    };
    setLoading(true);
    makePostLoginRequest(payload);
  };

  //main req that does http post req
  const makePostLoginRequest = async (payload) => {
    try {
      const res = await api.post("/users/Login", payload);
      console.log(res);
      if (res.data.statusCode !== 200) {
        throw new Error();
      }
      extractDataAndRedirect(res.data?.data); //this is only if staus of login is 200 so
    } catch (error) {
      console.log("err also");
      setErrors({ message: "Email or Password is wrong" });
      toast.error("something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // here just exract necessay data from payload of backend and redirect to particular page
  const extractDataAndRedirect = (data) => {
    console.log("here extract", data);
    localStorage.setItem("token", data?.token);
    localStorage.setItem("role", data?.role);
    localStorage.setItem("email", data?.email);
    dispatch(settingUser(data)); // this is necessay as i need few fields as id,role etc
    toast.success("welcome back");

    //navigating based on their role with their data
    if (data?.role == "student") {
      return navigate("/student");
    }
    navigate("/teacher");
  };

  return (
    <div className="flex justify-center items-center h-screen p-2">
      <div className="wrapper flex flex-col gap-5 shadow p-10 rounded-2xl border">
        <h2 className="text-center font-semibold text-xl"> Login</h2>

        {inputFields.map((field) => (
          <InputComp
            key={field.name}
            type={field.type}
            value={field.value}
            name={field.name}
            onChangeFn={validationOnChange}
            placeholder={field.placeholder}
            error={field.error}
          />
        ))}

        <button
          disabled={loading}
          className={`btnPrimary cursor-pointer`}
          onClick={handleSubmitLogin}
        >
          {loading ? "please wait..." : " Login"}
        </button>

        {errors?.message && (
          <p className="-m-2 text-red-500 text-sm text-center">
            {errors.message}
          </p>
        )}
        <div className="resetPassword ">
          <button
            onClick={() => navigate("/email-to-reset-password")}
            className="btn underline  text-blue-500 ml-2 cursor-pointer"
          >
            forgot password
          </button>
        </div>
        <div>
          don't have an account?
          <button
            onClick={() => navigate("/signup")}
            className="btn underline text-blue-500 ml-2 cursor-pointer"
          >
            Signup
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
