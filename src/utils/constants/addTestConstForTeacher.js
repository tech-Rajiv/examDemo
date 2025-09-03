const allQuestionToMake = Array(15).fill(null).map((item, i) => ({
   
    question: `ques${i+1}`,
    options: ["a", "b", "c", "d"],
    answer: "a",
}))
export default allQuestionToMake