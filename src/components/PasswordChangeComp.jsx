import React, { useState } from "react";
import api from "../services/APIs";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import SystemSecurityUpdateGoodIcon from "@mui/icons-material/SystemSecurityUpdateGood";
import { jwtDecode } from "jwt-decode";
function PasswordChangeComp() {
  //there is lot of states basic this comp does two thing 1.to update password 2.get reset link in email. so the states are more here
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [localOldPassword, setLocalOldPassword] = useState("");
  const [localPassword, setLocalPassword] = useState("");
  const [localConfirmPassword, setLocalConfirmPassword] = useState("");
  const [paswordLinkSent, setPasswordlinkSent] = useState(false); //this one is for btn send me link
  const email = localStorage.getItem("email");

  //main fn which will be trigered when pressed update btn
  const resetPasswordFn = async () => {
    setError("");
    if (loading) {
      return  //if loading is true then this must be clicked before so exit
    }
    const validInputFileds = validateInputs(); //early exit if field is missing or bad value
    if (!validInputFileds) {
      return;
    }

    //creating payload with keys that is expetced from backend
    const payload = {
      oldPassword: localOldPassword,
      Password: localPassword,
      ConfirmPassword: localConfirmPassword,
    };

    //main fn that will call put req
    setLoading(true); //will block other clicks till this is true
    fetchResetPassword(payload);
  };

  //work is to just reset input fields and loadingState
  const resetInputValues = () => {
    setLoading(false);
    setLocalConfirmPassword("");
    setLocalOldPassword("");
    setLocalPassword("");
  };

  //used above in mainFn to just validate and return true if all good or false
  const validateInputs = () => {
    if (!localConfirmPassword || !localOldPassword || !localPassword) {
      setError("please fill the inputs correctly");
      return false;
    }
    if (localConfirmPassword !== localPassword) {
      setError("password and confirm password did not matched");
      return false;
    }
    return true;
  };

  //this is main fn of api
  const fetchResetPassword = async (payload) => {
    // console.log("start ");
    try {
      const res = await api.post("/users/ResetPassword", payload);
      if (res.data?.statusCode === 500) {
        //this is basically how. backend send status for inavlid password
        throw new Error(res.data?.message); //basicaly use error or password update as both are at similar place to show so it will not matter.
        return;
      }
      if (res.data?.statusCode === 200) {
        toast.success("password reset succesfully");
        return;
      }
    } catch (error) {
      console.log(error);
      setError(error.message); //basicaly use error or password update as both are at similar place to show so it will not matter.
      toast.error("Failed to change password");
    } finally {
      // console.log("end");
      resetInputValues(); //this is to atleast clear the input values whether success or error
    }
  };

  //this will trigered when clicked the send me link btn
  const resetPasswordLink = async () => {
    setResetLoading(true); //had to create seperate loading
    try {
      const payload = { email }; //got by store auth
      const res = await api.post("/users/ForgotPassword", payload);
      // console.log(res);
      if (res.data?.statusCode === 200) {
        toast.success("check email : pasword rest link sent to email");
        setPasswordlinkSent(true);
      }
    } catch (error) {
      toast.error("password reset link could not sent");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="wrapper p-10 bg-white rounded-2xl  shadow">
      <h2 className="font-semibold mb-5 flex justify-center items-center gap-2">
        <LockResetOutlinedIcon /> Password Reset
      </h2>
      <div className="resetPassword flex min-w-60 flex-col gap-2">
        <input
          type="password"
          className="p-2 rounded border"
          placeholder="old password"
          value={localOldPassword}
          onChange={(e) => {
            setLocalOldPassword(e.target.value), setError("");
          }}
        />
        <input
          type="password"
          className="p-2 rounded border"
          placeholder="new password"
          value={localPassword}
          onChange={(e) => {
            setLocalPassword(e.target.value), setError("");
          }}
        />
        <input
          type="password"
          className="p-2 rounded border"
          placeholder="confirm password"
          value={localConfirmPassword}
          onChange={(e) => {
            setLocalConfirmPassword(e.target.value), setError("");
          }}
        />
        {error && (
          <p className="text-red-400 max-w-60 text-sm text-center mb-2">
            {error}
          </p>
        )}

        {loading ? (
          <div className="btnPrimary text-center">please wait...</div>
        ) : (
          <button className="btnPrimary" onClick={resetPasswordFn}>
            Update Password
          </button>
        )}

        {email && (
          <div className="forget flex items-center gap-2 mt-2">
            {paswordLinkSent ? (
              <p className="flex justify-center w-full gap-1">
                <SystemSecurityUpdateGoodIcon />
                Done. please check email...
              </p>
            ) : (
              <div className="link flex gap-2 items-center">
                Forgot password:
                {resetLoading ? (
                  <div className="text-center text-blue-400 cursor-pointer ml-2">
                    sending...
                  </div>
                ) : (
                  <button
                    onClick={resetPasswordLink}
                    className="text-center text-blue-400 cursor-pointer"
                  >
                    Get reset link
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PasswordChangeComp;
