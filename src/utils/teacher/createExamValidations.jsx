

  const validateSubjectName = (value) => {
    let error = ''
    if(!value){
      error = "please provide a subject name"
    }
    return { result: value, error };
  }
  
  const validateNotes = (value) => {
    let error = ''
    if(!value){
      error = "give a note here"
    }
    return { result: value, error };
  }



const validateAllQuestions = (questions) => {
  const normalized = questions.map(q => (q?.question ?? "").trim().toLowerCase());

  // build counts of each question text (ignore empty for duplicates)
  const counts = normalized.reduce((map, q) => {
    if (q) map[q] = (map[q] || 0) + 1;
    return map;
  }, {});

  return normalized.map(q => {
    if (!q) return "Question cannot be empty";
    if (counts[q] > 1) return "Duplicate question found";
    return null;
  });
};






const validateOptionEdit = (options) => {
  const seen = new Set();

  for (const option of options) {
    if (!option || option.trim() === "") {
      return "options cannot be empty";
    }
    if (seen.has(option.trim().toLowerCase())) {
      return "options cannot be same";
    }
    seen.add(option.trim().toLowerCase());
  }

  return ""; // no errors
};




  const validateAnswerEdit = (value, indexQues,indeOption,allQuestions) => {
return{
        result:value,
        error:"answer is empty"
    }
  }


  
const checkOverAllErrors = (errors) => {
  // check subject + notes + mainMessage
  if (errors.subjectError) return true;
  if (errors.notesError) return true;
  if (errors.mainMessage) return true;

  // check each questionError object
  if (Array.isArray(errors.questionError)) {
    for (const qErr of errors.questionError) {
      if (qErr?.question || qErr?.option || qErr?.answer) {
        return true;
      }
    }
  }

  return false; // no errors found
};

function createExamValidations() {
  return {
    validateNotes,
    validateSubjectName,
    validateOptionEdit,
    validateAnswerEdit,
    validateAllQuestions,
    checkOverAllErrors
  }
}

export default createExamValidations;
