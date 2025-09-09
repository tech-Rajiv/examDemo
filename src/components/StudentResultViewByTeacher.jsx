import React, { useEffect, useState } from "react";
import useFetchGetHook from "../hooks/fetchHooks/useFetchGetHook";
import { useParams } from "react-router-dom";
import BackButton from "./ui/BackButton";
import { useDispatch, useSelector } from "react-redux";
import { settingParticularStudentResult } from "../features/teacherSlice";

function StudentResultViewByTeacher() {
  const [email, setEmail] = useState();
  const [name, setName] = useState();
  const [result, setResult] = useState();

  const { id } = useParams();
  const dispatch = useDispatch();

  const cachedResultInStore = useSelector(
    (state) => state.teacher.particularStudentResult
  );
  const shouldFetch = !(
    cachedResultInStore.result && cachedResultInStore.id == id
  );

  // console.log(shouldFetch,"cached res",id,cachedResultInStore.id);
  const { data, loading, error } = useFetchGetHook(
    shouldFetch ? `/dashboard/Teachers/viewStudentDetail?id=${id}` : ""
  );

  useEffect(() => {
    if (shouldFetch) {
      // console.log('not cached actulaly fetched');
      setName(data?.data[0]?.name);
      setEmail(data?.data[0]?.email);
      setResult(data?.data[0]?.Result);
      dispatch(
        settingParticularStudentResult({
          id,
          result: data?.data[0]?.Result,
          name: data?.data[0]?.name,
          email: data?.data[0]?.email,
        })
      );
    } else {
      // console.log('from cache');
      setResult(cachedResultInStore.result);
      setEmail(cachedResultInStore.email);
      setName(cachedResultInStore.name);
    }
  }, [data, shouldFetch]);

  // console.log(result);
  if (error) {
    return "something went wrong.";
  }
  return (
    <div className="max-w-2xl mx-auto ">
      <BackButton />
      {loading && "loading..."}
      {result && (
        <div className="main p-2">
          <h2 className="mt-2">Name: {name}</h2>
          <h2 className="mt-2">Email: {email}</h2>
          <div className="res mt-5">
            {result?.length > 0 ? (
              <div className="wrappers ">
                {result.map((res, i) => (
                  <div key={i} className="single bg-white p-5 rounded-2xl mb-5">
                    <div className="sub">Subject: {res.subjectName}</div>
                    <div className="rank">Rank : {res.rank}</div>
                    <div className="rank">Score : {res.score}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">no result for this student.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentResultViewByTeacher;
