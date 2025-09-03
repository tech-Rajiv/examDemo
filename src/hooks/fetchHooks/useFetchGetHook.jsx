import React, { useEffect, useState } from "react";
import api from "../../services/APIs";

function useFetchGetHook(url) {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  async function getFetchResult(url) {
    setLoading(true);
    try {
      const res = await api(url);
      if (res.data?.statusCode !== 200) {
        throw new Error(res.data?.message);
      }
      setData(res.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if(!url){
      return
    }
    getFetchResult(url);
  }, [url]);
  return {
    data,
    loading,
    error,
  };
}

export default useFetchGetHook;
