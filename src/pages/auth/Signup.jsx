import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authInputValidation from "../../utils/auth/authInputValidation";
import api from "../../services/APIs";
import InputComp from "../../components/ui/InputComp";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState({
    name: null,
    email: null,
    password: null,
    role: null,
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // validations from utils
  const { validationRootFn } = authInputValidation();

  // common validation function
  const validationOnChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    const { error } = validationRootFn(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // all input fields to map
  const inputFields = [
    {
      type: "text",
      name: "name",
      placeholder: "username",
      value: formData.name,
      error: errors?.name,
    },
    {
      type: "text",
      name: "email",
      placeholder: "email",
      value: formData.email,
      error: errors?.email,
    },
    {
      type: "password",
      name: "password",
      placeholder: "password",
      value: formData.password,
      error: errors?.password,
    },
  ];

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

  const handleSubmitSignup = () => {
    if (loading) return;
    const isValid = validateForm();
    if (!isValid) {
      return;
    }
    const payload = { ...formData };
    setLoading(true);
    makeSignupPostRequest(payload);
  };

  const makeSignupPostRequest = async (payload) => {
    try {
      const res = await api.post("/users/SignUp", payload);
      if (res.data.statusCode !== 200) {
        throw new Error(res.data.message);
      }
      navigate("/verify");
    } catch (error) {
      setErrors({ message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen p-2">
      <div className="wrapper flex flex-col gap-5 shadow p-10 rounded-2xl border">
        <h2 className="text-center font-semibold text-xl">Signup</h2>

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

        {/* thisis for select */}
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">role</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={formData.role}
            label="Age"
            onChange={(e) => validationOnChange("role", e.target.value)}
            required
          >
            <MenuItem value={"student"}>Student</MenuItem>
            <MenuItem value={"teacher"}>Teacher</MenuItem>
          </Select>
        </FormControl>
        {errors?.role && (
          <p className="-m-2 max-w-50 text-red-500 text-sm text-center">
            {errors?.role}
          </p>
        )}
        <button
          className="btnPrimary"
          onClick={handleSubmitSignup}
          disabled={loading}
        >
          {loading ? "please wait..." : "Signup"}
        </button>

        {errors?.message && (
          <p className="-m-2 text-red-500 text-sm text-center">
            {errors.message}
          </p>
        )}

        <div>
          already have an account?
          <button
            onClick={() => navigate("/login")}
            className="btn underline text-blue-500 ml-2 cursor-pointer"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;
