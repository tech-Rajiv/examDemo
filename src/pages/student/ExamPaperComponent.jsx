import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GiveExamByStudent from "../../components/GiveExamByStudent";
import api from "../../services/APIs";
import toast from "react-hot-toast";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AssignmentIcon from "@mui/icons-material/Assignment";
import useFetchGetHook from "../../hooks/fetchHooks/useFetchGetHook";
import BackButton from '../../components/ui/BackButton'

function ExamPaperComponent({}) {
  const [allQuestions, setAllQUestions] = useState(); //local placeholder for exams questions
  const { id } = useParams(); //will fetch this question
  const naviagte = useNavigate();

  const { data, loading, error } = useFetchGetHook(
    `student/examPaper?id=${id}`
  );

//when get the questions from backend the placeholder will have the questions
  useEffect(() => {
    setAllQUestions(data?.data);
  }, [data]);


  //this will be triggered by child component when they fill all questions correctly and press final summit.
  const submitTheExam = async (payload) => {
    try {
      const res = await api.post(`student/giveExam?id=${id}`, payload);
      if (res.data.statusCode !== 200) {
        throw new Error("exam submit failed.");
      }
      toast.success("exam submiited successfully");
      setTimeout(
        () => toast.success("Refresh, as it may take few seconds to reflect"),
        2000
      ); //just to look good
      naviagte("/student");
    } catch (error) {
      toast.error("someting went wrong");
      somethingErrorAndRedirect("someting went wrong");
    }
  };

  //this is called when catch error while getting exam ques or submitted exam answers
  const somethingErrorAndRedirect = (message) => {
    toast.error(message);
    naviagte("/student");
  };

  return (
    <div className="max-w-xl mx-auto">
      <BackButton />
      <div className="main py-5">
        <h2 className="text-xl font-semibold py-5 flex gap-2 justify-center">
          <AssignmentIcon />
          Exam Paper.
        </h2>
        {
          loading && !error && <p className="text-center mt-5">loading...</p>
        }
        {
          !loading && !error &&  <GiveExamByStudent
            allQuestions={allQuestions}
            submitTheExam={submitTheExam}
          />
        }
        {
          error && !loading && <p className="mt-5 flex justify-center items-center gap-2"><ErrorOutlineIcon />something went wrong</p>
        }
      </div>
    </div>
  );
}

export default ExamPaperComponent;
