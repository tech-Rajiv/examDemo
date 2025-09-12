import React, { useEffect, useState } from "react";
import SingleQuestionForm from "./SingleQuestionForm";
import { Box, CircularProgress, Pagination, Stack } from "@mui/material";
import createExamValidations from "../utils/teacher/createExamValidations";

function CreateExamParentComp({
  questions,
  setQuestions,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  totalQuestions,
  handleAllQuestions,
  loading,
}) {
  const [isCurrentQuestionValid, setIsCurrentQuestionValid] = useState(false); //this is from child to let me know wether to allow user click next or not

  //just to start the boiler plate of questions and errors as empty
  //what i am doing is there are 15 question and for each question i am adding a error indexed, so when nav to prev and next question i can show the revalent errors
  const [errors, setErrors] = useState({
    mainErrorMsg: null, //this is mostly i didnot use, may be i will aftersometimes
    allQuestionsError: Array(totalQuestions)
      .fill(null)
      .map((_, i) => ({
        questionError: null,
        optionError: null,
        answerError: null,
      })),
  });

  //these are the three fn that will help to set error onchange
  const { questionValidation, optionsValidations, answerValidations } =
    createExamValidations();

  useEffect(() => {
    //this is simply if no error then make the next,submit button not disable, note:the error will only be seted on onchange, so first load without any changes will make this variable isValid true, so this will cause trouble
    //and that will be handeled by next click btn below
    const errorOfThisQuestion = errors.allQuestionsError[currentQuestionIndex];
    if (
      errorOfThisQuestion?.questionError ||
      errorOfThisQuestion?.optionError ||
      errorOfThisQuestion?.answerError
    ) {
      setIsCurrentQuestionValid(false);
    } else {
      setIsCurrentQuestionValid(true);
    }
  }, [errors, currentQuestionIndex]); //this is depency which says if error chnage or index change then rerun this logic and decide to show next btn or not

  //this runs when user types a questions and it also does two thing as above(handleAnswerChange) 1.to let user do, 2.to show errors of what he did
  const handleQuestionOnChange = (newValue) => {
    let updated;
    if (newValue) {
      updated = structuredClone(questions); //this is basic js logic, not react friendly style but this situation need this style as i want updated ques and to compare it at same time
      updated[currentQuestionIndex].question = newValue;
      setQuestions(updated);
    }
    const error = questionValidation(
      newValue ? updated : questions,
      newValue,
      currentQuestionIndex
    );
    settingQuesError(error);
  };

  //staright forward as last wo, do let user add option and show error
  const handleOptionOnChange = (newValue, optIndex) => {
    let updated;
    if (newValue) {
      updated = structuredClone(questions); //same js logic for same reason as above questionOnChang
      updated[currentQuestionIndex].options[optIndex].value = newValue;
    }
    const error = optionsValidations(
      newValue
        ? updated[currentQuestionIndex].options
        : questions[currentQuestionIndex].options
    );
    settingOptError(error);
    setQuestions(updated);
  };

  const handleAnswerOnChange = (optIndex) => {
    const updated = structuredClone(questions);
    updated[currentQuestionIndex].options = updated[
      currentQuestionIndex
    ].options.map((opt, i) => ({
      ...opt,
      isAnswer: i === optIndex,
    }));
    const error = answerValidations(updated[currentQuestionIndex].options);
    settingAnsError(error);
    setQuestions(updated);
  };

  //handelNext and previous are fairly easy.
  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    //this will do check first that fields have value and if not then return false and set error
    const validToNext = clickedNextWithoutAnyInput();
    if (!validToNext) return;
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  //this job is to just send allQuestion when validated, to parent comp, cz i will be using ain create exam and edit exam both have this question in comman
  const handleSubmitExam = () => {
    if (loading) {
      return;
    }
    //same logic as above when clicked next
    const validToSubmit = clickedNextWithoutAnyInput();
    if (!validToSubmit) return;

    const formated = questions.map(transformQuestion); //formating based on BE
    // console.log("Final Exam Data:", formated);
    handleAllQuestions(formated); ///main fn call
  };

  const transformQuestion = (q) => {
    return {
      question: q.question,
      options: q.options?.map((opt) => opt.value), // extract just the values
      answer: q.options?.find((opt) => opt.isAnswer)?.value, // find the one marked as answer
    };
  };

  //this is fn that will run when clicked next but the logic inside will set error based onn oly empty fields,
  const clickedNextWithoutAnyInput = () => {
    let isValid = true;

    //the idea is basically check if questions has no values then call the settingError fn with particular eror
    if (!questions[currentQuestionIndex].question) {
      isValid = false;
      settingQuesError("question cannot be empty");
    }
    questions[currentQuestionIndex].options.map((opt) => {
      if (!opt.value) {
        isValid = false;
        settingOptError("all option fields are required");
      }
    });
    const hasAns = questions[currentQuestionIndex].options.some(
      (opt) => opt.isAnswer
    );
    if (!hasAns) {
      settingAnsError("select an answer");
      isValid = false;
    }
    if (!isValid) {
      setErrors((prev) => ({
        ...prev,
        mainErrorMsg: "please fill all the fields",
      }));
    }
    console.log(isValid, "isVal");
    return isValid;
  };

  const settingQuesError = (errmsg) => {
    setErrors((prev) => ({
      ...prev,
      allQuestionsError: prev.allQuestionsError.map((err, idx) => {
        if (idx === currentQuestionIndex) {
          return {
            ...err,
            questionError: errmsg,
          };
        }
        return err;
      }),
    }));
  };

  //below fns are just setting error based on messages recieved
  const settingOptError = (errmsg) => {
    setErrors((prev) => ({
      ...prev,
      allQuestionsError: prev.allQuestionsError.map((err, idx) => {
        if (idx === currentQuestionIndex) {
          return { ...err, optionError: errmsg };
        }
        return err;
      }),
    }));
  };
  const settingAnsError = (errmsg) => {
    setErrors((prev) => ({
      ...prev,
      allQuestionsError: prev.allQuestionsError.map((err, idx) => {
        if (idx === currentQuestionIndex) {
          return { ...err, answerError: errmsg };
        }
        return err;
      }),
    }));
  };
  return (
    <div className="max-w-2xl mx-auto">
      <SingleQuestionForm
        question={questions[currentQuestionIndex]}
        index={currentQuestionIndex}
        {...{
          handleQuestionOnChange,
          handleOptionOnChange,
          handleAnswerOnChange,
        }}
        error={errors.allQuestionsError[currentQuestionIndex]}
        loading={loading}
      />

      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrev}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 bg-blue-50 cursor-pointer text-blue-500 rounded disabled:opacity-50"
        >
          Previous
        </button>

        {currentQuestionIndex === totalQuestions - 1 ? (
          <button
            onClick={handleSubmitExam}
            disabled={!isCurrentQuestionValid}
            className="px-4 py-2 text-white cursor-pointer flex gap-2 items-center bg-green-500 rounded disabled:opacity-50"
          >
            {loading ? (
              <div className="p flex items-center gap-2">
                <CircularProgress color="white" size={"18px"} />
                please wait...
              </div>
            ) : (
              "  Submit"
            )}
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!isCurrentQuestionValid}
            className="px-4 py-2 bg-blue-500 cursor-pointer text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}

export default CreateExamParentComp;
