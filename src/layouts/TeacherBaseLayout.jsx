import { NavLink, Outlet } from "react-router-dom";
import Header from "../components/Header";
import { Home } from "@mui/icons-material";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import CoPresentIcon from '@mui/icons-material/CoPresent';

import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import { Toaster } from "react-hot-toast";
import useFetchAuth from "../hooks/auth/useFetchAuth";
import ScrollToTop from "../components/ScrollToTop";
function TeacherBaseLayout() {
  // useFetchAuth();

  return (
    <div>
      <Toaster position="top-center" />
      <Header />
      <div className="partitionsOfSidebarAndOutlet min-h-screen flex flex-col sm:flex-row">
        <div className="sideBar w-96 hidden md:h-screen md:fixed md:block">
          <div className="lists h-full flex flex-col">
            <NavLink
              className="px-10 py-5 flex items-center"
              to={"/teacher"}
              end
            >
              <Home sx={{ fontSize: 25 }} className="mr-5" />
              Home
            </NavLink>
            <NavLink
              className="px-10 py-5 flex items-center"
              to={"/teacher/add-exam"}
            >
              <PostAddOutlinedIcon sx={{ fontSize: 25 }} className="mr-5" />
              Add Exam
            </NavLink>

            <NavLink
              className="px-10 py-5 flex items-center"
              to={"/teacher/show-all-students"}
            >
              <CoPresentIcon sx={{ fontSize: 22 }} className="mr-5" />
              show all Students
            </NavLink>
            <NavLink
              className="px-10 py-5 flex items-center"
              to={"/teacher/reset-password"}
            >
              <LockResetOutlinedIcon sx={{ fontSize: 25 }} className="mr-5" />
              Reset Password
            </NavLink>
          </div>
        </div>
        <div className="outletSpace min-h-screen md:ml-96 w-full mx-auto p-2 bg-gray-50">
          <Outlet />
          <ScrollToTop />
        </div>
      </div>
    </div>
  );
}

export default TeacherBaseLayout;
