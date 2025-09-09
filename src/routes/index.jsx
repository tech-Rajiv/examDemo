import LandingPage from "../pages/home/LandingPage";
import ErrorPage from "../pages/error/ErrorPage";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import PrivateRoute from "../middlewares/PrivateRoute";
import { createBrowserRouter } from "react-router-dom";
import TeacherBaseLayout from "../layouts/TeacherBaseLayout";
import StudentBaseLayout from "../layouts/StudentBaseLayout";
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import StudentDashboard from "../pages/student/StudentDashboard";
import TeacherProfile from "../pages/teacher/TeacherProfile";
import StudentProfile from "../pages/student/StudentProfile";
import VerifyComp from "../components/VerifyComp";
import ExamPaperComponent from "../pages/student/ExamPaperComponent";
import StudentResetPassword from "../pages/student/StudentResetPassword";
import StudentExamResults from "../pages/student/StudentExamResults";
import ResetPasswordFromEmailLink from "../components/ResetPasswordFromEmailLink";
import EmailForgetPassword from "../components/EmailForgetPassword";
import TeacherAddExam from "../pages/teacher/TeacherAddExam";
import ShowAllStudents from "../pages/teacher/ShowAllStudents";
import ViewExamByTeacher from "../pages/teacher/ViewExamByTeacher";
import StudentResultViewByTeacher from "../components/StudentResultViewByTeacher";
import PrivateAuthRedirectRoute from "../middlewares/PrivateAuthRedirectRoute";
import TeacherEditExam from "../pages/teacher/TeacherEditExam";
import RootPage from "../pages/home/BlankPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "newPassword", element: <ResetPasswordFromEmailLink /> },
      { path: "verify", element: <VerifyComp /> },
      {
        path: "signup",
        element: (
          <PrivateAuthRedirectRoute>
            {" "}
            <Signup />{" "}
          </PrivateAuthRedirectRoute>
        ),
      },
      {
        path: "login",
        element: (
          <PrivateAuthRedirectRoute>
            {" "}
            <Login />{" "}
          </PrivateAuthRedirectRoute>
        ),
      },
      { path: "email-to-reset-password", element: <EmailForgetPassword /> },
      {
        path: "teacher",
        element: (
          <PrivateRoute role={"teacher"}>
            <TeacherBaseLayout />
          </PrivateRoute>
        ),
        children: [
          { index: true, element: <TeacherDashboard /> },
          { path: "profile", element: <TeacherProfile /> },
          { path: "add-exam", element: <TeacherAddExam /> },
          { path: "view-exam", element: <ViewExamByTeacher /> },
          { path: "editexam/:id", element: <TeacherEditExam /> },
          { path: "show-all-students", element: <ShowAllStudents /> },
          {
            path: "show-all-students/student-details/:id",
            element: <StudentResultViewByTeacher />,
          },
          { path: "reset-password", element: <StudentResetPassword /> },
        ],
      },
      {
        path: "student",
        element: (
          <PrivateRoute role={"student"}>
            <StudentBaseLayout />
          </PrivateRoute>
        ),
        children: [
          { index: true, element: <StudentDashboard /> },
          { path: "profile", element: <StudentProfile /> },
          { path: "reset-password", element: <StudentResetPassword /> },
          { path: "exam-result/:id", element: <StudentExamResults /> },
          { path: "exam/:id", element: <ExamPaperComponent /> },
        ],
      },
    ],
  },
]);

export default router;
