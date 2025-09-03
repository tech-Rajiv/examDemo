import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { settingAllExams } from "../../features/studentSlice";
import api from "../../services/APIs";
import toast from "react-hot-toast";
import useLogoutAndRedirect from "../auth/useLogoutAndRedirect";

function useFetchAllTest() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState();
  const dispatch = useDispatch();

  //tring throtle for 8sec
  const throttleDelayTimeMs = 8000;
  const [oldFetchCalled, setOldFetchCalled] = useState(Date.now()); //

  const dataInRedux = useSelector((state) => state.student?.allExams);
  const { logoutClearStateAndRedirect } = useLogoutAndRedirect();

  async function fetchAllTests() {
    if (loading) return;
    // console.log("in actual fetch of all exams");
    setLoading(true);
    try {
      const res = await api.get("/student/studentExam");
      setData(res.data?.data);
      dispatch(settingAllExams(res.data?.data));
    } catch (error) {
      toast.error("your login session was expired");
      setError("something went wrong");
      logoutClearStateAndRedirect();
    } finally {
      // console.log("finally run");
      setLoading(false);
    }
  }

  const throtleCheckAndFetch = () => {
    const currDifference = Date.now() - oldFetchCalled;
    if (currDifference < throttleDelayTimeMs) {
      // console.log("inthrotle timezone so no fetch");
      const toWaitFor = (
        Math.ceil(throttleDelayTimeMs - currDifference) / 1000
      ).toFixed(0);
      toast.error(`cannot refresh please wait for ${toWaitFor}sec`);
      return;
    }
    setOldFetchCalled(Date.now());
    fetchAllTests();
  };
  useEffect(() => {
    if (dataInRedux?.length <= 0) {
      fetchAllTests();
    } else {
      setData(dataInRedux);
      // console.log("alreadyin redux");
    }
  }, []);

  return {
    loading,
    data,
    error,
    throtleCheckAndFetch,
  };
}

export default useFetchAllTest;
