import React from "react";
import { useNavigate } from "react-router-dom";
import AnnouncementIcon from "@mui/icons-material/Announcement";
function VerifyComp() {
  const navigate = useNavigate();
  return (
    <div className="flex h-screen justify-center items-center ">
      <div className="wrapper p-10 border rounded-2xl">
        <div className="icons text-center flex gap-2 justify-center items-center mb-4">
          <div className="head text-lg font-semibold">Email Sent</div>
          <AnnouncementIcon  sx={{ fontSize: 20 }} />
        </div>
        <div className="head ">Please check your email for verifcation.</div>
        <div className="text-center mt-1">
          verified?
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

export default VerifyComp;
