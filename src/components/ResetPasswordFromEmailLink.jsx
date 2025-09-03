import { TextField } from "@mui/material";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/APIs";
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";

function ResetPasswordFromEmailLink() {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [changedSuccessFully, setChangedSuccessfully] = useState(false); //this is only for ui to show yes password chnged

  //now to get token from url
  const [urlSearchParam, setUrlSearchParam] = useSearchParams();
  const token = urlSearchParam.get("token");

  //trigered by click listener
  const handleChangePassword = () => {
    const validInputs = validateFn(password, confirmPassword);  //job is to return true if valid
    if (!validInputs) {  
      return;
    }
    if(loading){ //simple exit if the update btn already clicked and stop fn here
      return 
    }
    setError("")
    setLoading(true);
    const payload = {
      Password: password,
      ConfirmPassword: confirmPassword,
    };
    makeApiRequestToChangePassword(payload);    //main fn that make request
  };

  //validation fn which at checks lenght or falsy value
  const validateFn = (pass, confirmPass) => {
    if (!pass.trim() || !confirmPass.trim() ||   pass.length < 5) {
      setError("invalid inputs");
      return false;
    }
    if (pass !== confirmPass) {     //if pass and conformPass not match then return
      setError("password donot match");
      return false;
    }
    return true;
  };

  //main fn that make request
  const makeApiRequestToChangePassword = async (payload) => {
    if (!token || !payload) {     //just security check if anything is missing.
      return;   
    }
    try {
      const res = await api.post(
        `/users/ForgotPassword/Verify?token=${token}`,
        payload
      );
      // console.log(res);
      if (res.data.statusCode !== 200) {
        throw new Error(res.data.message);
      }
      setChangedSuccessfully(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center bg-gray-50 items-center h-screen p-2">
      {changedSuccessFully ? (
       <div className="wrap p-10 -m-30 flex gap-2 items-center bg-green-50  text-green-500 ">
            <VerifiedUserIcon />
        Changed password successfully...
        </div>
      ) : (
        <div className="wrapper flex flex-col gap-5 bg-white shadow p-10 rounded-2xl ">
          <h2 className="text-center font-semibold text-lg">
            <LockResetOutlinedIcon /> Set Password
          </h2>

          <TextField
            type="password"
            label="password"
            variant="outlined"
            value={password}
            onChange={(e) => {setPassword(e.target.value),setError("")}}
          />
          <TextField
            type="password"
            label="confirm password"
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => {setConfirmPassword(e.target.value),setError('')}}
          />
          {loading ? (
            <div className="btnPrimary text-center">please wait...</div>
          ) : (
            <button className="btnPrimary" onClick={handleChangePassword}>
              set password
            </button>
          )}
          {error && (
            <p className="text-sm text-red-500 text-center -m-2 max-w-50 flex items-center justify-center">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default ResetPasswordFromEmailLink;
