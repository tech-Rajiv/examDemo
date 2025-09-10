const questionValidation = (questions, value, currentQuestionIndex) => {
  let error;
  //returns true if the in all question of 15 found same question, which is not same index mean not same question
  const isDuplicate = questions.some(
    (q, i) =>
      q?.question?.toLowerCase() === value?.toLowerCase() &&
      i !== currentQuestionIndex
  );
  return isDuplicate && value
    ? "question already exists"
    : value?.trim()
    ? ""
    : "question cannot be empty";
};

const optionsValidations = (options) => {
  const seen = [];
  let error = "";
  options?.forEach((opt) => {
    if (!opt.value.trim()) {
      error = "all option fields are required";
    }
    if (seen.includes(opt.value.trim()) && opt.value.trim()) {
      error = "option has duplicate values";
    } else {
      seen.push(opt.value);
    }
  });
  return error;
};

const answerValidations = (options) => {
  const hasAnswer = options?.some((opt) => opt.isAnswer) ?? false;
  return !hasAnswer;
};

function createExamValidations() {
  return {
    questionValidation,
    optionsValidations,
    answerValidations,
  };
}

export default createExamValidations;
