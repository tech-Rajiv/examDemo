import React, { useEffect, useState } from "react";
import SingleQuestionForm from "./SingleQuestionForm";
import { Box, CircularProgress, Pagination, Stack } from "@mui/material";

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

  //few useEffects
  //when loading this comp with new index i want to check first if question ,option , answer is valid so use ese effect
  useEffect(() => {
    checkValidQuestion(questions[currentQuestionIndex]?.question); //when we render this comp as back next i will send to check if this has error
    checkValidOptions(questions[currentQuestionIndex]?.options);
    checkValidAnswer(questions[currentQuestionIndex]?.options);
  }, [questions, currentQuestionIndex]);

  //-------------------------------------------VALIDATION_PORTIONS-----------------------------------

  //this basicaly does check the question and gives error on first render and whenevr question is edited.
  const checkValidQuestion = (value) => {
    //returns true if the in all question of 15 found same question, which is not same index mean not same question
    const isDuplicate = questions.some(
      (q, i) => q.question === value && i !== currentQuestionIndex
    );
    //this is just the way to leave every error same , and just change questionError acc to the above duplicate value
    setErrors((prev) => ({
      ...prev,
      allQuestionsError: prev.allQuestionsError.map((err, idx) => {
        if (idx === currentQuestionIndex) {
          return {
            ...err,
            questionError:
              isDuplicate && value //i have two conditions one if duplicate 2nd when dont have any value
                ? "question already exists"
                : value
                ? ""
                : "question cannot be empty",
          };
        }
        return err;
      }),
    }));
  };

  //this fn job is to check give a array of options if an option is repeated or if any option is empty
  const checkValidOptions = (options) => {
    const seen = [];
    let error = ""; //error as empty
    //this is norml js logic to trace every option one by one and push in seen[] and conclue if anyone is duplicate or empty
    options?.forEach((opt) => {
      if (!opt.value) {
        //this empty basicaly runs for every opt and will set error of empty
        error = "all option fields are required";
      }
      if (seen.includes(opt.value) && opt.value.trim()) {
        error = "option has duplicate values"; //this will set error as duplicate, note: if any option is empty and any one is duplicate also, then empty error from above will be over ridden by duplicate error, as this has more priority
      } else {
        seen.push(opt.value);
      }
    });
    //whetever the error value is just set it to optionError leving all else same
    setErrors((prev) => ({
      ...prev,
      allQuestionsError: prev.allQuestionsError.map((err, idx) => {
        if (idx === currentQuestionIndex) {
          return { ...err, optionError: error };
        }
        return err;
      }),
    }));
  };

  //this fn job is to find answer , if found then no error if not then set error
  const checkValidAnswer = (options) => {
    const hasAnswer = options?.some((opt) => opt.isAnswer) ?? false; //basic js logic to find an answer
    //setting error based on wheter found or not
    setErrors((prev) => ({
      ...prev,
      allQuestionsError: prev.allQuestionsError.map((err, idx) => {
        if (idx === currentQuestionIndex) {
          return {
            ...err,
            answerError: hasAnswer ? "" : "please select an answer",
          };
        }
        return err;
      }),
    }));
  };

  //this job to only check that is question fully valid now so that it can check and valid to show next button or not
  useEffect(() => {
    //the reason im doing this when indexofQues change is suppose when use goes back and make errorness opt then iam letting stop to go forward as , any error will block the next btn
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

  //-------------------------------------------EDIT_PORTIONS-----------------------------------

  //this runs when user clicks any ans then i will do two thing 1let the use do the chnages 2.to show the error acc to the changes he made
  const handleAnswerChange = (index) => {
    const updated = structuredClone(questions); //this logic of editing is more of js friendly approch, more reactfriendly would be to use setALlQuestion(),but at this point this was more simpler so i did this, will change to react type in future

    // reset all isAnswer to false, set only the selected one to true, based on index that we are reciving from the arguments
    updated[currentQuestionIndex].options = updated[
      currentQuestionIndex
    ].options.map((opt, i) => ({
      ...opt,
      isAnswer: i === index,
    }));
    checkValidAnswer(updated[currentQuestionIndex].options); //this is the validation call fn, role is to just set errors, as discussed above
    setQuestions(updated);
  };

  //this runs when user types a questions and it also does two thing as above(handleAnswerChange) 1.to let user do, 2.to show errors of what he did
  const handleQuestionChange = (value) => {
    const updated = structuredClone(questions); //same as above the logic type is js friendly
    updated[currentQuestionIndex].question = value;

    // Check duplicate question
    checkValidQuestion(value); //same does the job of only showing error
    setQuestions(updated);
  };

  //staright forward as last wo, do let user add option and show error
  const handleOptionChange = (newValue, optIndex) => {
    const updated = structuredClone(questions); //again js type logic, will be changing to react type sometime

    updated[currentQuestionIndex].options[optIndex].value = newValue;
    checkValidOptions(updated[currentQuestionIndex].options);
    setQuestions(updated);
  };

  //handelNext and previous are fairly easy.
  const handlePrev = () => {
    //if i have previous ques then set curIndex to -1,  else disable will be applied from another useefect
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      // handlePageChhange("empty",currentQuestionIndex-1)
    }
  };
  const handleNext = () => {
    //if i have next ques then set curIndex to +1,  else disable will be applied from another useefect
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      // handlePageChhange("empty",currentQuestionIndex+1)
    }
  };

  //this job is to just send allQuestion when validated, to parent comp, cz i will be using ain create exam and edit exam both have this question in comman
  const handleSubmitExam = () => {
    if (loading) {
      return 
    }
    //this is to check if current is valid then only let proced bcz if he is in final submit everything till now would be validate thats how he reached here, so validating last now
    if (!isCurrentQuestionValid) {
      // console.log("hass error");
      return;
    }
    const formated = questions.map(transformQuestion); //formating based on BE
    // console.log("Final Exam Data:", formated);
    handleAllQuestions(formated); ///main fn call
  };

  //bcz of i have used different datastructure, i need to transform to structure backend needs to changing it to the way it works
  const transformQuestion = (q) => {
    return {
      question: q.question,
      options: q.options?.map((opt) => opt.value), // extract just the values
      answer: q.options?.find((opt) => opt.isAnswer)?.value, // find the one marked as answer
    };
  };

  // { question: "ques0", options: ["a","fd","c","d"], answer: "d" }
  const handlePageChhange = (e, value) => {
    setCurrentQuestionIndex(value - 1);
  };
  return (
    <div className="max-w-2xl mx-auto">
      <SingleQuestionForm
        question={questions[currentQuestionIndex]}
        index={currentQuestionIndex}
        // handleQuestionChange={handleQuestionChange}
        // handleOptionChange={handleOptionChange}
        // handleAnswerChange={handleAnswerChange}
        {...{ handleQuestionChange, handleOptionChange, handleAnswerChange }}
        error={errors.allQuestionsError[currentQuestionIndex]}
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
      {/* <hr className="my-5 text-gray-300" /> */}
      <div
        className={`pageTabs text-sm hidden justify-center ${
          isCurrentQuestionValid ? "" : "pointer-events-none opacity-25"
        }`}
      >
        <Stack spacing={2}>
          <Pagination
            count={totalQuestions}
            color="primary"
            onChange={handlePageChhange}
          />
        </Stack>
        <p className="text-center mt-2">
          for dev purpuse only(will be removed soon)
        </p>
      </div>
    </div>
  );
}

export default CreateExamParentComp;
