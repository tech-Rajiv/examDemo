import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CreateExamParentComp from "../../components/CreateExamParentComp";
import useFetchGetHook from "../../hooks/fetchHooks/useFetchGetHook";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../../services/APIs";
import BackButton from '../../components/ui/BackButton'
import EditSquareIcon from '@mui/icons-material/EditSquare';

function TeacherEditExam() {
  const [allQuestions, setAllQuestions] = useState([]); //localplaceholder to getQues and let user update and then put request with this new ques
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [updateLoader , setUpdateLoader] = useState(false)
  const { id } = useParams();
  const navigate = useNavigate()
  const [totalQuestions , setTotalQuestions] = useState(15)

  //fetching result based on id parameter
  const { data, loading, error } = useFetchGetHook(
    `/dashboard/Teachers/examDetail?id=${id}`
  );

  const selectedExamToEdit = useSelector(
    (state) => state.teacher.selectedExamToEdit
  );

  // useEffect(() => {
  //   const questions = data?.data?.questions
  //   if(questions){
  //     formatQuestions(questions)//special type of structure i used
  //   }
  //   // setAllQuestions(data?.data?.questions);
  //   setTotalQuestions(data?.data?.questions.length)
  //   console.log(data);
  // }, [data]);

useEffect(() => {
  const questions = data?.data?.questions;
  if (questions) {
    const formatted = formatQuestions(questions);
    setAllQuestions(formatted); // set your special structure
    setTotalQuestions(formatted.length);
  }
}, [data]);


const formatQuestions = (questions) => {
  return questions.map(q => ({
    question: q.question,
    options: q.options.map(opt => ({
      value: opt,
      isAnswer: opt === q.answer
    }))
  }));
};

  const handleAllQuestions = (allQuestions) => {
    const payload = createPayload(allQuestions)
    handleUpdateQuestion(payload)
  }
    const createPayload = (allQuestions) => {
    return {
      subjectName: selectedExamToEdit.subjectName,
      questions:allQuestions,
      notes: selectedExamToEdit.notes,
    };
  };

  const handleUpdateQuestion = async(payload) => {
    if(updateLoader){
        return
    }
    setUpdateLoader(true);
    try {
      const res = await api.put(
        `dashboard/Teachers/editExam?id=${id}`,
        payload
      );
      // console.log(res);
      if(!res.data.statusCode){
        throw new Error(res.data.message)
      }
      toast.success("updated successfully");
      navigate("/teacher");
    } catch (error) {
      toast.error("something went wrong");
      // console.log(error.message);
    } finally {
      setUpdateLoader(false);
    }
  }
  
  return <div className="mx-auto max-w-2xl py-5">
    <BackButton />
    <div className="head mt-5 justify-center font-semibold text-lg mb-5 flex gap-2">Edit Question<EditSquareIcon /></div>
    {
        loading && "loading..."
    }
    {
        !loading && allQuestions && !error &&
      <CreateExamParentComp
        questions={allQuestions}
        setQuestions={setAllQuestions}
        currentQuestionIndex={currentQuestionIndex}
        setCurrentQuestionIndex={setCurrentQuestionIndex}
        totalQuestions={totalQuestions}
        handleAllQuestions={handleAllQuestions}
        loading={updateLoader}
      />
    }
    {
        error && 'something went wrong'
    }
  </div>;
}

export default TeacherEditExam;
