import React from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { resetStudentSlice } from "../../features/studentSlice";
import { useDispatch } from "react-redux";
import { resetTeacherSlice } from "../../features/teacherSlice";
import { resetUserSlice } from "../../features/authSlice";

function useLogoutAndRedirect() {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  
  //this fn has two main useCase one to delete when clicks logout and when jwt is expired
  const logoutClearStateAndRedirect = async () => {
    localStorage.clear("token");
    localStorage.clear("role");
    dispatch(resetStudentSlice())
    dispatch(resetTeacherSlice())
    dispatch(resetUserSlice())
    toast.error("your have been logged out");
    // setTimeout(() => {
    //   toast.error("please login again");
    // }, 1000);
    return navigate("/");
  };
  return {
    logoutClearStateAndRedirect,
  };
}

export default useLogoutAndRedirect;
