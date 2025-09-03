import React, { useEffect, useState } from "react";
import api from "../services/APIs";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useFetchGetHook from "../hooks/fetchHooks/useFetchGetHook";
import toast from "react-hot-toast";
import createExamValidations from "../utils/teacher/createExamValidations";
 
function EditExamByTeacher() {
  const [allQuestions, setAllQuestions] = useState([]); //localplaceholder to getQues and let user update and then put request with this new ques
  const [updateLoader, setUpdateLoader] = useState(false);
  const [mainErrorMsg, setMainErrorMsg] = useState("");
  const [errors, setErrors] = useState({
    subjectError: null,
    notesError: null,
    questionError: [
      {
        question: null,
        option: null,
        answer: null,
      },
    ],
    mainMessage: null,
  });
  const { id } = useParams();
  const navigate = useNavigate();
  
    //fetching result based on id parameter
    const { data, loading, error } = useFetchGetHook(
      `/dashboard/Teachers/examDetail?id=${id}`
    );
  
    //when got the fetch result just updation local Question holder
    useEffect(() => {
      setAllQuestions(data?.data?.questions);
      // console.log(data);
    }, [data]);



  //helper functions which will handel question/option/answer update accoridng to the localPlace holder
  const {
    validateOptionEdit,
    validateAllQuestions,
    checkOverAllErrors,
  } = createExamValidations();

  const selectedExamToEdit = useSelector(
    (state) => state.teacher.selectedExamToEdit
  );



  if (loading) {
    return "Loading...";
  }
  if (error) {
    return "something went wrong";
  }

  //when child call basically by onChange event we just get value,index and call these fnc which will take care of validations and add field quesError if found any, and we just need to show it
  const validateQuestion = (value, indexQues) => {
    setMainErrorMsg("");
    // update question text
    const updatedQuestions = structuredClone(allQuestions);
    updatedQuestions[indexQues].question = value;
    // validate all questions
    const questionMsgs = validateAllQuestions(updatedQuestions);
    // update only the `question` field inside errors
    setErrors((prev) => ({
      ...prev,
      questionError: prev.questionError.map((err, i) => ({
        ...err,
        question: questionMsgs[i],
      })),
    }));
    setAllQuestions(updatedQuestions);
  };

  //same func as above this validates options and add extra field in updateQuestion as otionError with null or any error
  const validateOptions = (value, indexQues, optionIndex,isAnswer) => {
    setMainErrorMsg("");
    const updatedQuestions = structuredClone(allQuestions);
    updatedQuestions[indexQues].options[optionIndex] = value;
     if(isAnswer){
    updatedQuestions[indexQues].answer = value;
    }
    // Clone existing errors
    const updatedErrors = structuredClone(errors);
    // Run your validation
    const validationMessage = validateOptionEdit(
      updatedQuestions[indexQues].options
    );
    // Update the nested error for this specific option
    updatedErrors.questionError[indexQues] = {
      ...updatedErrors.questionError[indexQues],
      option: validationMessage,
    };
    setErrors(updatedErrors);
    setAllQuestions(updatedQuestions);
  };

  
 const validateAnswer = (value, indexQues) => {
    setMainErrorMsg("");
    const updatedQuestions = structuredClone(allQuestions);
    updatedQuestions[indexQues].answer = value;
    setAllQuestions(updatedQuestions)
  };



 const handleSubmit = () => {

    setErrors((prev) => ({
      ...prev,
      questionError: validateErrorForAnswers(allQuestions, prev.questionError),
    }));
    // now all the errors should be covered in the errors structure not  just check every filed if all errorrs are false then only ;let users proceed
    
    const hasErrors = checkOverAllErrors(errors);
    if (hasErrors ) {
      // console.log("has error");
      setMainErrorMsg("please fill the form correctly");
      return;
    }
    // console.log("all good");
    const payload = createPayload(allQuestions)
    updateTheChangesPostReq(payload)
    //submitTheFormatedQuestions(allQuestions)
  };
 const validateErrorForAnswers = (questions, prevErrors = []) => {
    return questions.map((q, i) => ({
      ...(prevErrors[i] || {}), 
      answer: !q.answer || q.answer.trim() === "" ? "Answer is required" : null,
    }));
  };


  //payload is just excluding error field as it was for ui purpose
  const createPayload = (allQuestions) => {
    return {
      subjectName: selectedExamToEdit.subjectName,
      questions:allQuestions,
      notes: selectedExamToEdit.notes,
    };
  };


  //main put req func that make api call and refllect changes
  const updateTheChangesPostReq = async (payload) => {
    // console.log(id, payload);
    setUpdateLoader(true);
    try {
      const res = await api.put(
        `dashboard/Teachers/editExam?id=${id}`,
        payload
      );
      // console.log(res);
      toast.success("updated successfully");
      navigate("/teacher");
    } catch (error) {
      toast.error("something went wrong");
      // console.log(error.message);
    } finally {
      setUpdateLoader(false);
    }
  };
  return (
    <div className="py-10 ">
      <div className="note text-center text-gray-400 mb-5 text-sm">
        note : once u go back , changes wont be saved.
      </div>
      <div className="wrapper bg-white sm:p-10 p-2 rounded-2xl max-w-2xl mx-auto">
        <h2 className="text-center">Edit Exam paper</h2>
        {allQuestions &&
          allQuestions.map((ques, quesIndex) => {
            return (
              <div key={quesIndex} className=" py-5">
                <div className="ques py-3">
                  Q{quesIndex + 1}.
                  <input
                    value={ques?.question}
                    onChange={(e) =>
                      validateQuestion(e.target.value, quesIndex)
                    }
                    type="text"
                    placeholder={` ${quesIndex + 1} Question`}
                    className="p-2 border border-gray-300 w-full rounded"
                  />
                </div>
                <div className="options grid grid-cols-2 gap-2">
                  {ques.options?.map((opt, optIndex) => {
                    return (
                      <div key={optIndex} className="options flex gap-2">
                        <input
                          type="radio"
                          name={`ques${quesIndex + 1}`}
                          onChange={(e) =>
                            validateAnswer(e.target.value, quesIndex)
                          }
                          value={opt}
                          checked={opt == ques.answer}
                        />
                        <input
                          type="text"
                          value={opt}
                          id={`ques${optIndex + 1}`}
                          onChange={(e) =>
                            validateOptions(
                              e.target.value,
                              quesIndex,
                              optIndex,
                              opt == ques.answer
                            )
                          }
                          placeholder={` ${optIndex + 1} options`}
                          className="p-2 border border-gray-300  w-full rounded"
                        />
                      </div>
                    );
                  })}
                </div>
                <p className="text-sm text-red-400 flex flex-col gap-1">
                {
                  errors.questionError && <p className="text-sm text-red-400 flex flex-col gap-1">
                  <p>{errors.questionError?.[quesIndex]?.question}</p>
                  <p>{errors.questionError?.[quesIndex]?.option}</p>
                  <p>{errors.questionError?.[quesIndex]?.answer}</p>
                </p>
                }
                </p>
              </div>
            );
          })}
        <div className="save text-center">
          <button
            onClick={handleSubmit}
            disabled={updateLoader}
            className="btnPrimary"
          >
            {updateLoader ? "please wait..." : "Update paper"}
          </button>
          {
            mainErrorMsg &&  <p className="text-sm text-red-400 flex flex-col gap-1 mt-2">{mainErrorMsg}</p>
          }
        </div>
      </div>
    </div>
  );
}

export default EditExamByTeacher;
