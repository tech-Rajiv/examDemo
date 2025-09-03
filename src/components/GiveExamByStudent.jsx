import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";

function GiveExamByStudent({ allQuestions, submitTheExam }) {    

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(); //here idid not do, allQuestions[currentIndex] bcz its from props and is fetched in parent comp and that takes 2 sec aprox
  const [answers, setAnswers] = useState(); //will by be loaded will quesion id, ansswer as "" bcz when user goes in between i should submit empty answer
  const [loading, setLoading] = useState(false);    //this is when user clicks submit exam paper
  const [error, setError] = useState(false);
  const { selectedSubject } = useSelector((state) => state.student.examStatus);



  //has one job that is to create currentques sync with index
  useEffect(() => {
    setCurrentQuestion(allQuestions?.[currentIndex]);
  }, [currentIndex, allQuestions]);


//this is basically adding answer to currentindex to the value got from radio
  const handleAnswer = (quesId, answer) => {
    setError("");
    setAnswers((prev) =>
      prev.map((que, index) => {
        if (index == currentIndex) {      //only change answer of current index
          return { question: quesId, answer };
        }
        return que;
      })
    );
  };

  //this will basically validate the array pass the arry to parent
  const handleSubmitAnswer = () => {
    if (loading) {
      return;
    }
    setError("");
    const validate = validatingAnswers(answers)   //just return true  if all fields are valid
    if (!validate) {
      return setError("please answer all the questions")
    }
    setLoading(true);
    submitTheExam(answers);   // this is parents function which iam calling with values
  };


  //this is just to make sure the fields have proper answers and not empty
  const validatingAnswers = (answers) => {
   const valid = answers.every((elem, index) => {
      if (!elem.question || !elem.answer) {
        return false;
      }
      return true;
    });
    return valid
  }


  //this will run once i get all questions, and do create a array of answers with properties which backend expects so this will help when submitting exxam as now i donot need to format while sending to BE
  useEffect(() => {
    const dummyAnswer = Array(allQuestions?.length)
      .fill({ question: '', answer: "" })
    setAnswers(dummyAnswer);
  }, [allQuestions]);

  return (
    <div className="max-w-xl mx-auto   bg-white rounded-2xl p-2 sm:p-10">
      <p className="text-sm">
        {" "}
        Question {currentIndex + 1} of {allQuestions?.length}
      </p>

      <h2 className=" mb-5 flex gap-3">
        subject : <span className="font-semibold">{selectedSubject}</span>
      </h2>

      <div className="text-xl mt-10">{currentQuestion?.question}</div>
      <div className="options py-5">
        {currentQuestion?.options.map((opt, i) => (
          <label key={i} className=" block mb-2 cursor-pointer">
            <input
              type="radio"
              name={`question-${currentQuestion._id}`}
              value={opt}
              checked={answers[currentIndex].answer === opt}
              onChange={() => handleAnswer(currentQuestion._id, opt)}
              className="mr-2"
            />
            {`${opt}is${currentIndex}`}
          </label>
        ))}
      </div>
      <hr />
      {error && (
        <div className="err">
          <p className="text-red-500">Cannot Submit: {error}</p>
        </div>
      )}

      <div className="flex justify-between mt-10">
        <button
          onClick={() => setCurrentIndex((i) => i - 1)}
          disabled={currentIndex === 0}
          className="px-4 py-3 bg-gray-200 hover:bg-gray-200/70 rounded cursor-pointer disabled:opacity-50"
        >
          Prev
        </button>

        {currentIndex < allQuestions?.length - 1 ? (
          <button
            onClick={() => setCurrentIndex((i) => i + 1)}
            className=" bg-blue-50 py-2 px-5 text-blue-500 hover:bg-blue-100/70 cursor-pointer rounded "
          >
            Next
          </button>
        ) : (
          <button onClick={handleSubmitAnswer} className="btnPrimary ">
            {loading ? "please wait..." : "Submit"}
          </button>
        )}
      </div>
    </div>
  );
}

export default GiveExamByStudent;
