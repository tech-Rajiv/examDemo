import { CircularProgress, TextField } from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import { settingUser } from "../../features/authSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/APIs";
import authInputValidation from "../../utils/auth/authInputValidation";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  //just to naivagte and set values to store
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //handel login automaticaly if localStorage has token and role
  // const localToken = localStorage.getItem("token");
  // const localRole = localStorage.getItem("role");
  // if (localToken && localRole) {
  //   // console.log("yes u already have token so no need to login");
  //   return <Navigate to={`/${localRole}`} replace />; //replace to donot press back and get here again to login
  // }

  //this is validtion logics that will help to get validation done
  const { emailValidation, passwordValidation } = authInputValidation();

  //this gets value and email error. so this error is easy to set in errors
  const handleEmailChange = (value) => {
    const { result, error } = emailValidation(value);
    setEmail(result);
    setError((prev) => ({ ...prev, email: error, message: null })); //here message:null can be confusing but check the error after api cal it sets erros.message from backed as email or pass is invalid so after that if any one changes that i want to clear that message error
  };

  const handlePasswordChange = (value) => {
    const { result, error } = passwordValidation(value);
    setPassword(result);
    setError((prev) => ({ ...prev, password: error, message: null }));
  };

  //now this is when user clicks login btn so first checking all errors to be null empty and then only proceed
  const handleSubmitLogin = () => {
    if (loading) return; //these are all early exits
    if (error.password || error.email || !email || !password) {
      setError((prev) => ({
        ...prev,
        message: "please fill the fields correctly",
      }));
      return;
    }
    const payload = {
      //this is when fileds are valid and i need to make sure to send correct payload as BE expects
      email,
      password,
    };
    setLoading(true);
    makePostLoginRequest(payload);
  };

  //main req that does http post req
  const makePostLoginRequest = async (payload) => {
    // console.log("start logn");
    try {
      const res = await api.post("/users/Login", payload);
      if (res.data?.statusCode !== 200) {
        throw new Error();
      }
      extractDataAndRedirect(res.data?.data); //this is only if staus of login is 200 so
    } catch (error) {
      setError({ message: "Email or Password is wrong" });
      toast.error("something went wrong");
    } finally {
      // console.log("final logn");
      setLoading(false);
    }
  };

  // here just exract necessay data from payload of backend and redirect to particular page
  const extractDataAndRedirect = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("email", data.email);
    dispatch(settingUser(data)); // this is necessay as i need few fields as id,role etc
    toast.success("welcome back");

    //navigating based on their role with their data
    if (data.role == "student") {
      return navigate("/student");
    }
    // console.log("naviget to teacher");
    return navigate("/teacher");
  };

  return (
    <div className="flex justify-center items-center h-screen p-2">
      <div className="wrapper flex flex-col gap-5 shadow p-10 rounded-2xl border">
        <h2 className="text-center font-semibold text-xl"> Login</h2>
        <TextField
          label="email"
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
        />
        {error?.password && (
          <p className="-m-2 max-w-50 text-red-500 text-sm text-center">
            {error.password}
          </p>
        )}
        {loading ? (
          <div className="btnPrimary justify-center flex items-center gap-2">
            <CircularProgress color="white" size={"18px"} />
            please wait...
          </div>
        ) : (
          <button className="btnPrimary" onClick={handleSubmitLogin}>
            Login
          </button>
        )}
        {error?.message && (
          <p className="-m-2 text-red-500 text-sm text-center">
            {error.message}
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
