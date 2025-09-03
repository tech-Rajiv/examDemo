function helperFunctionsForTeacher() {
  const editQuestionOfExamPaper = (value, quesIndex, allQuestion) => {
     const updatedQuestions = allQuestion.map((q, i) =>
      i === quesIndex ? { ...q, question: value } : q
    );


    return updatedQuestions.map((q, i) => {
      const hasDuplicate = updatedQuestions.some(
        (otherQ, j) =>
          j !== i &&
          otherQ.question.trim().toLowerCase() === q.question.trim().toLowerCase() && otherQ.question.trim()
      );
      return {
        ...q,
        questionError: hasDuplicate ? "two questions cannot be same" : "",
      };
    });
  };

  const editOptionsOfExamPaper = (value, quesIndex, optIndex, allQuestion) => {
    return allQuestion.map((q, i) => {
      if (i !== quesIndex) return q;

      const newOptions = q.options.map((opt, j) =>
        j === optIndex ? value : opt
      );

      const found = findingSimilarOptions(newOptions);

      return {
        ...q,
        options: newOptions,
        optionError: found ? "two options cannot be same" : "",
      };
    });
  };

  const editAnswerOfExamPaper = (value, quesIndex, allQuestion) => {
    return allQuestion.map((q, i) =>
      i === quesIndex ? { ...q, answer: value } : q
    );
  };

  const checkIfNoError = (allQuestions) => {
    return allQuestions.every(q => !q.questionError && !q.optionError);
  };

 
  const findingSimilarOptions = (options) => {
    const seen = new Set();
    for (let opt of options) {
      if (seen.has(opt) && opt) return true;
      seen.add(opt);
    }
    return false;
  };


  const checkAllFieldsAreValid = (allQuestions) => {
    allQuestions.forEach((element,index) => {
      if(!element.question){
        element.errorMessage = 'question is empty'
      }else{
        element.errorMessage = ''
      }
      element.options.forEach((opt,i) => {
        if(!opt){
        element.errorMessage = 'option is empty'
        }
      })

    })
    return allQuestions
  }


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

  const validateQuestionEdit = (value, quesIndex, allQuestion) => {
    let error =''
    const updatedQuestions = allQuestion.map((q, i) =>
      i === quesIndex ? { ...q, question: value } : q
    );
    
  }
  const validateOptionEdit = (value, quesIndex, allQuestion) => {
    let error =''
    const updatedQuestions = allQuestion.map((q, i) =>
      i === quesIndex ? { ...q, question: value } : q
    );
    
  }


  return {
    editOptionsOfExamPaper,
    editQuestionOfExamPaper,
    checkIfNoError,
    editAnswerOfExamPaper,
    checkAllFieldsAreValid,
    validateSubjectName,
    validateNotes,
    validateQuestionEdit,
    validateOptionEdit
  };
}

export default helperFunctionsForTeacher;
