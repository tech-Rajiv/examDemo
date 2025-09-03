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

function Signup() {
  //few states as placeholder for inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  //to make ui better
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  //to naviagte to a route after done signup
  const navigate = useNavigate();

  //this is validtion logics that will help to get validation done
  const {
    emailValidation,
    passwordValidation,
    nameValidation,
    roleValidation,
  } = authInputValidation();

  //this gets value and email error. so this error is easy to set in errors
  const handleEmailChange = (value) => {
    const { result, error } = emailValidation(value);
    setEmail(result);
    setError((prev) => ({ ...prev, email: error, message: null })); //here message:null can be confusing but check the error after api cal it sets erros.message from backed as email or pass is invalid so after that if any one changes that i want to clear that message error
  };

  //this will validate and let me have error if found any
  const handlePasswordChange = (value) => {
    const { result, error } = passwordValidation(value);
    setPassword(result);
    setError((prev) => ({ ...prev, password: error, message: null }));
  };

  //will validate name and send error if any
  const handleNameChange = (value) => {
    const { result, error } = nameValidation(value);
    setName(result);
    setError((prev) => ({ ...prev, name: error, message: null })); //here message:null can be confusing but check the error after api cal it sets erros.message from backed as email or pass is invalid so after that if any one changes that i want to clear that message error
  };

  const handleRoleValidation = (value) => {
    const { result, error } = roleValidation(value);
    setRole(result);
    setError((prev) => ({ ...prev, role: error, message: null }));
  };

  const handleSignupSubmit = () => {
    if (loading) return; //these are all early exits
    const foundError = findingErrorAtSubmit();
    if (foundError) {
      return;
    }
    const payload = {
      //this is the structure expects so this works
      name,
      email,
      password,
      role,
    };
    setLoading(true); //loading true to stop multiple clicks and also for ui
    makeSignupPostRequest(payload); //main call
  };

  //will make post req and set errors if any and redirect verified page
  const makeSignupPostRequest = async (payload) => {
    try {
      const res = await api.post("users/SignUp", payload);
      if (res.data.statusCode !== 200) {
        throw new Error(res.data.message);
      }
      navigate("/verify");
    } catch (error) {
      // console.log(error);
      setError({ message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const findingErrorAtSubmit = () => {
    handleEmailChange(email);
    handleNameChange(name);
    handlePasswordChange(password);
    handleRoleValidation(role);
    if (
      error.password  ||
      error.email ||
      error.name ||
      error.role ||
      !email ||
      !password ||
      !role ||
      !name
    ) {
      setError((prev) => ({
        ...prev,
        message: "please fill all the fields correctly",
      }));
      return true;
    }

    return false;
  };
  return (
    <div className="flex justify-center items-center h-screen p-2">
      <div className="wrapper flex flex-col gap-5 shadow p-10 rounded-2xl border">
        <h2 className="text-center font-semibold text-xl">Signup</h2>
        <TextField
          label="username"
          required
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          variant="outlined"
        />
        {error?.name && (
          <p className="-m-2 max-w-50 text-red-500 text-sm text-center">
            {error.name}
          </p>
        )}
        <TextField
          label="email"
          required
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
          variant="outlined"
        />
        {error?.email && (
          <p className="-m-2 max-w-50 text-red-500 text-sm text-center">
            {error.email}
          </p>
        )}
        <TextField
          type="password"
          label="password"
          variant="outlined"
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
          required
        />
        {error?.password && (
          <p className="-m-2 text-red-500 text-sm flex flex-wrap">
            {error.password}
          </p>
        )}
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">role</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={role}
            label="Age"
            onChange={(e) => handleRoleValidation(e.target.value)}
            required
          >
            <MenuItem value={"student"}>Student</MenuItem>
            <MenuItem value={"teacher"}>Teacher</MenuItem>
          </Select>
        </FormControl>
        {error?.role && (
          <p className="-m-2 max-w-50 text-red-500 text-sm text-center">
            {error.role}
          </p>
        )}

        <button className="btnPrimary" onClick={handleSignupSubmit}>
          {loading ? "please wait..." : "Signup"}
        </button>
        {error?.message && (
          <p className="-m-2 text-red-500 text-sm text-center">
            {error.message}
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
