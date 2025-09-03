import api from "../../services/APIs";
import {
  settingAllActiveStudentsArray,
  settingAllStudentsArray,
  settingCreatedExam,
} from "../../features/teacherSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import toast from "react-hot-toast";
import useLogoutAndRedirect from "../auth/useLogoutAndRedirect";

function useFetchHookForTeacher() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const { logoutClearStateAndRedirect } = useLogoutAndRedirect();

  const fetchingAllCreateExamForTecher = async () => {
    // console.log("fetchse");
    setLoading(true);
    try {
      const res = await api.get("/dashboard/Teachers/viewExam");
      // console.log(res.data);
      if (res.data.statusCode === 401) {
        toast.error("your Login session is expiered please Login again");
        logoutClearStateAndRedirect();
      }
      if (res.data.statusCode === 200) {
        const reverse = res.data?.data?.reverse();
        dispatch(settingCreatedExam(reverse));
      }
    } catch (error) {
      // console.log("error h bha");
     setError(error.message);
    } finally {
      // console.log("finally run");
      setLoading(false);
    }
  };

  const fetchAllStudentsToShow = async (url) => {
    setLoading(true);
    try {
      const res = await api(url);
      dispatch(settingAllStudentsArray(res.data?.data));
      const activeData = res.data.data.filter(
        (list) => list.status == "Active"
      );
      dispatch(settingAllActiveStudentsArray(activeData));
    } catch (error) {
      setError("something went wrong..");
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchingAllCreateExamForTecher,
    fetchAllStudentsToShow,
    loading,
    error,
  };
}

export default useFetchHookForTeacher;
