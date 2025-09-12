import InputComp from "./ui/InputComp";

function SingleQuestionForm({
  index,
  question,
  error,
  handleAnswerOnChange,
  handleQuestionOnChange,
  handleOptionOnChange,
  loading,
}) {
  const handleQuestion = (name, value, index) => {
    handleQuestionOnChange(value);
  };
  const handleOption = (name, value, optIndex) => {
    handleOptionOnChange(value, optIndex);
  };

  return (
    <div
      className={`${
        loading ? "pointer-events-none" : ""
      } p-8 bg-white  rou nded-2xl mt-2`}
    >
      <h2 className="font-semibold mb-2">Question {index + 1}</h2>

      <InputComp
        type={"text"}
        value={question?.question ?? ""}
        name={`Ques${index + 1}`}
        placeholder={"enter question"}
        onChangeFn={(name, value) => handleQuestion(name, value, index)}
        error={error?.questionError}
        classes={"w-full"}
      />

      <div className="space-y-2 my-5">
        {question?.options.map((opt, optIndex) => (
          <div key={optIndex} className="flex items-center space-x-3">
            <input
              type="radio"
              name={`answer-${index}`}
              checked={opt.isAnswer}
              onChange={() => handleAnswerOnChange(optIndex)}
            />
            {/* <InputComp
              name={`answer-${index}`}
              type="radio"
              checked={opt.isAnswer}
              onChangeFn={(name, value) => handleAnswerOnChange(name, value, optIndex)}
            /> */}
            <InputComp
              type={"text"}
              name={`option${optIndex + 1}`}
              placeholder={`option${optIndex + 1}`}
              value={opt.value}
              onChangeFn={(name, value) => handleOption(name, value, optIndex)}
              classes={"w-full"}
            />
            {/* <input
              type="text"
              value={opt.value}
              onChange={(e) => handleOptionChange(e.target.value, optIndex)}
              className="flex-1 p-2 border border-gray-400 rounded"
              placeholder={`Option ${optIndex + 1}`}
            /> */}
          </div>
        ))}
      </div>
      {error?.optionError && (
        <p className="text-red-500 text-sm">{error.optionError}</p>
      )}
      {error?.answerError && (
        <p className="text-red-500 text-sm">{error.answerError}</p>
      )}
    </div>
  );
}

export default SingleQuestionForm;
