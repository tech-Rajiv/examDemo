import React from "react";
import LogoutIcon from '@mui/icons-material/Logout';
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

import { useNavigate } from "react-router-dom";
import useLogoutAndRedirect from "../hooks/auth/useLogoutAndRedirect";
function Header() {
  //commn fn that redirectsAndLogout when user clicks logout btn
   const  { logoutClearStateAndRedirect} = useLogoutAndRedirect()

    const handleSignout = () => {
     logoutClearStateAndRedirect()
    }
  return (
    <div className="navs flex justify-between py-5 sm:px-10 px-2 shadow bg-white sticky z-1 top-0 w-full ">
      <div className="logo text-xl font-semibold">ExamDemo</div>
       <div className="menu md:hidden bg-gray-50 ">
          <MenuOutlinedIcon sx={{ fontSize: 30 }} />
        </div>
      <button onClick={handleSignout} className="hidden sm:flex avatar cursor-pointer  items-center gap-2">Logout<LogoutIcon fontSize="medium"/></button>
    </div>
  );
}

export default Header;
