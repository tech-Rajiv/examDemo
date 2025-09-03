import { useState } from "react";
import api from "../../services/APIs";
import toast from "react-hot-toast";
import AddExamComp from "./AddExamComp";
import { useNavigate } from "react-router-dom";
import useFetchHookForTeacher from "../../hooks/teacher/useFetchHookForTeacher";

//after everything done by child comp, this parent comp handels actual post req
function TeacherAddExam() {
  const [loading, setLoading] = useState(false); //for submitting exam
  const [error, setError] = useState(false); //any error while submiting like network or failed to submit type
  const navigate = useNavigate();
  const { fetchingAllCreateExamForTecher } = useFetchHookForTeacher();

  //this is how the backend takes payload so made it, 
  const createPayload = (questions, subjectName, note) => {
    return {
      subjectName,
      questions,
      notes: ['10am exam',note ? note : "best paper"],
    };
  };
  //this fn is triggered by child as iam sending this fn via props it gives formated questions only after vakidting all errors
  const handleSubmitCreatedExam = async (ques, subjectName, note) => {
    if (loading) {
      // this helps bcz this function of api call and be triggered many times per sec if clicked multiple times, so making sure if already loading thne donot do anything already button was clicked
      return 
    }
    const payload = createPayload(ques, subjectName, note);
    // console.log(" paylod", payload);
    setLoading(true); //so by above code this becomes necessay as they both depend on each other, like if no loading means no btn clicked till now so make loaing true, to stop further clicks
    setError("");
    makeApiCallWithPayload(payload);
  };

  //main api call that actually post requests with all questions
  const makeApiCallWithPayload = async (payload) => {
  // console.log("trying");
    try {
      const res = await api.post("dashboard/Teachers/Exam", payload);
      if (res.data.statusCode == 200) {
        toast.success("exam create Successfully.")
        setTimeout(() => {
        toast.success("please refresh if recently created exam is not showing.")
          
        }, 2000);
        fetchingAllCreateExamForTecher()
        navigate("/teacher");
      }
      if (res.data.statusCode == 500) {
        //this is the status backend sent so i just used it
        toast.error("exam already exists");
        setError("exam already exists, please try changin subject name");
      }
    } catch (error) {
      setError("something went wrong, please after some time");
      toast.error("failed to add exam");
      // console.log(error);
    } finally {
      setLoading(false);
      // console.log('fetch done');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {
        <AddExamComp
          handleSubmitParent={handleSubmitCreatedExam}
          loading={loading}
        />
      }
      {error && <div className="forErr text-center text-red-500">{error}</div>}
    </div>
  );
}

export default TeacherAddExam;
