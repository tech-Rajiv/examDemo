import { CircularProgress, TextField } from "@mui/material";
import React, { useState } from "react";
import api from "../services/APIs";
import toast from "react-hot-toast";
import SystemSecurityUpdateGoodIcon from "@mui/icons-material/SystemSecurityUpdateGood";
import { useNavigate } from "react-router-dom";
function EmailForgetPassword() {
  const [email, setEmail] = useState();
  const [loading, setLoading] = useState(false);
  const [linkSendAlready, setLinkSendAlready] = useState(false);
  const [error, setError] = useState();

  const handleSendResetLinkInEmail = () => {
    setError("");
    const isEmailFieldValid = validateEmailFIeld(email);
    if (!isEmailFieldValid) {
      return setError("please provide a valid email");
    }
    const payload = {
      email,
    };
    setLoading(true);
    sendResetLinkToEmail(payload);
  };

  const navigate = useNavigate();
  const sendResetLinkToEmail = async (payload) => {
    try {
      const payload = { email };
      const res = await api.post("/users/ForgotPassword", payload);
      // console.log(res);
      if (res.data?.statusCode === 200) {
        toast.success("check email : pasword rest link sent to email");
        setLinkSendAlready(true);
      }
      if (res.data.statusCode === 500) {
        setError("Email not found");
        throw new Error("email | user not found");
      }
    } catch (error) {
      toast.error("password reset link could not sent");
      setError("something went wrong, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const validateEmailFIeld = (email) => {
    //simple validation which only does trim, check @uincludes and length
    if (!email || !email.trim() || !email.includes("@") || email.length <= 4) {
      return false;
    }
    return true;
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
      <div className="wrapper flex flex-col max-w-80   gap-4 bg-white shadow p-10 rounded-2xl">
        <TextField
          type="email"
          label="email"
          variant="outlined"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value), setError("");
          }}
        />
        {error && (
          <p className="-m-2 w-full text-red-500 text-sm text-center">
            {error}
          </p>
        )}

        {loading && (
         <div className="p flex items-center gap-2 bg-black justify-center text-white py-3 rounded"><CircularProgress color="white" size={'18px'}/>please wait...</div>
        )}
        {!loading && !linkSendAlready && (
          <button className="btnPrimary" onClick={handleSendResetLinkInEmail}>
            Send Link
          </button>
        )}
        {linkSendAlready && (
          <p className="bg-green-50 p-2 rounded text-green-500 text-center">
            <SystemSecurityUpdateGoodIcon /> check the email
          </p>
        )}
        <hr />
        <div className=" flex justify-center gap-2">
          {" "}
          Done?...{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-400 cursor-pointer"
          >
            login
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmailForgetPassword;
