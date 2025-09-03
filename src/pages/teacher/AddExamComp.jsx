import React, { useState } from "react";
import CreateExamParentComp from "../../components/CreateExamParentComp";
import { Pagination, Stack } from "@mui/material";

function AddExamComp({ handleSubmitParent, loading }) {
  //initial settep
  const totalQuestions = 15; //hardcoded as backend expect this number only
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [subjectName, setSubjectName] = useState("");
  const [notes, setNotes] = useState("");

  //just to start the boiler plate of questions and errors as empty
  const [error, setErrors] = useState({
    subjectError: null,
    mainErrorMsg:null
  });

  //this is the data structure that i choosed for this particualr problem of mcq type creation, bcz this structure will make it less vunurable to error,
  //earlier i used different structure which caused manybugs so on 25-08-2000 dusring last time i changed the structure, next time i think a lot before comming to conclusion of selecting a structure
  const [questions, setQuestions] = useState(
    Array(totalQuestions)
      .fill(null)
      .map((element, i) => ({
        question: ``,
        options: [
          { value: "", isAnswer: false },
          { value: "", isAnswer: false },
          { value: "", isAnswer: false },
          { value: "", isAnswer: false },
        ],
      }))
  );

  //this is last func that comes after all question is added and clicked submit from child,and at last checks subjectname and sends the data to parent function
  const handleAllQuestions = (allQuestions) => {
    if ( !subjectName.trim()) {
      setErrors((prev) => ({
        ...prev,
        subjectError: "subject name is required",
      }));
      return;
    }
    //this check is not needed i think, so in future after checking i would remove this,
    if (allQuestions.length !== totalQuestions) {
      return;
    }
    // console.log(allQuestions);
    const checkAllValid = checkingAllQuestions(allQuestions)
    if(!checkAllValid){
      // console.log('no some questions are missing');
      setErrors(prev => ({...prev,mainErrorMsg:'some questions are not filled/valid check all questions once again'}))
      return
    }


    //parent fn call with necessary payload
    handleSubmitParent(allQuestions, subjectName, notes);
  };

  //by the structure and logic iam going i will have blocked the next btn if error in cuurent ques, so mostly never does this func will be called with wrong value, but there can be exception that i currently dont know so im adding this check.
  const checkingAllQuestions = (allQues) =>{
    //this logic return true if all questions, have truthy value on question,options,n answer
    const everythingGood = allQues.every(ques => ques.question && ques.answer && ques.options.every(opt => opt))
    // console.log('every',everythingGood);
    return everythingGood
  }

  return (
    <div>
      {" "}
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Create Exam</h1>
        <div className="subs flex flex-col gap-2 mb-10">
          <input
            type="text"
            placeholder="subjectname"
            value={subjectName}
            onChange={(e) => {
              setSubjectName(e.target.value), setErrors({});
            }}
            className="border p-2 w-full rounded"
          />
          {error.subjectError && (
            <div className="e text-red-500 text-sm">{error.subjectError}</div>
          )}
          <input
            type="text"
            placeholder="notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>
        <p>
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </p>

        <CreateExamParentComp
          questions={questions}
          setQuestions={setQuestions}
          currentQuestionIndex={currentQuestionIndex}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
          totalQuestions={totalQuestions}
          handleAllQuestions={handleAllQuestions}
          loading={loading}
        />
        {
          error.mainErrorMsg && <div className="e text-red-200 mt-1 text-center">dev-purpose-error-{error.mainErrorMsg}</div>
        }
      </div>
    </div>
  );
}

export default AddExamComp;
