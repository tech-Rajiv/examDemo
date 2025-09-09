import React, { useEffect, useState } from "react";

function SingleQuestionForm({
  index,
  question,
  error,
  handleAnswerChange,
  handleQuestionChange,
  handleOptionChange,
  loading,
}) {
  return (
    <div
      className={`${
        loading ? "pointer-events-none" : ""
      } p-8 bg-white  rounded-2xl mt-2`}
    >
      <h2 className="font-semibold mb-2">Question {index + 1}</h2>
      <input
        type="text"
        value={question?.question ?? ""}
        onChange={(e) => handleQuestionChange(e.target.value)}
        className="w-full p-2 border border-gray-400 rounded mb-2"
        placeholder="Enter question"
      />
      {error?.questionError && (
        <p className="text-red-500 text-sm">{error?.questionError}</p>
      )}

      <div className="space-y-2 my-2">
        {question?.options.map((opt, optIndex) => (
          <div key={optIndex} className="flex items-center space-x-3">
            <input
              type="radio"
              name={`answer-${index}`}
              checked={opt.isAnswer}
              onChange={() => handleAnswerChange(optIndex)}
            />
            <input
              type="text"
              value={opt.value}
              onChange={(e) =>
                handleOptionChange(
                  e.target.value,
                  optIndex,
                  question?.answer === opt
                )
              }
              className="flex-1 p-2 border border-gray-400 rounded"
              placeholder={`Option ${optIndex + 1}`}
            />
          </div>
        ))}
      </div>
      {error?.optionError && (
        <p className="text-red-500 text-sm">{error.optionError}</p>
      )}
      {error?.answerError && (
        <p className="text-red-500 text-sm">{error.answerError}</p>
      )}
      {error?.mainErrorMsg && (
        <p className="text-red-500 text-sm">{error.mainErrorMsg}</p>
      )}
    </div>
  );
}

export default SingleQuestionForm;
