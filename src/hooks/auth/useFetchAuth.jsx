import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../services/APIs";
import { settingUser } from "../../features/authSlice";
import toast from "react-hot-toast";
import useLogoutAndRedirect from "./useLogoutAndRedirect";

//this hook is in baseLayout or rootlayout which will run once on everytime this app render basically refresh and i did it to bascaly have store the state on refresh

function useFetchAuth(url) {
  const [loading, setLoading] = useState(false);
  const {logoutClearStateAndRedirect} = useLogoutAndRedirect()
  const dispatch = useDispatch();
//the function to fetch auth details
  const getUserDetails = async () => {
    setLoading(true);
    // console.log("statrted fetch details");
    try {
      const res = await api.get(url);
      if (res.data?.statusCode === 200) {
        // console.log("gotres");
        dispatch(settingUser(res.data?.data));
      }
      if(res.data?.statusCode === 401) {
        // console.log("jwt exp");
        logoutClearStateAndRedirect()
      }
    } catch (error) {
      toast.error("something went wrong");
    } finally {
      // console.log('finally');
      setLoading(false);
    }
    return;
  };

  //calling when rootlayout gets mounted thats only once
  useEffect(() => {
    getUserDetails();
  }, [url]);

  return {
    loading,
    getUserDetails,
  };
}

export default useFetchAuth;
