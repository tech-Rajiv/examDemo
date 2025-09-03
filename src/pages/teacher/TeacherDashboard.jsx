import { useEffect, useState } from "react";
import QuizIcon from "@mui/icons-material/Quiz";
import { useSelector } from "react-redux";
import TeacherExamCreatedRowWithButtons from "../../components/TeacherExamCreatedRowWithButtons";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import useFetchHookForTeacher from "../../hooks/teacher/useFetchHookForTeacher";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import Skeleton from "../../components/ui/Skeleton";
function TeacherDashboard() {
  //getting fn that fetches the data and manage loading and i will call it only once during first render
  const { fetchingAllCreateExamForTecher, loading } = useFetchHookForTeacher();
  //this above hook is specially chache type made for this specific comp only so i wound recomnd doing it more, after this i will be creating comman hooks

  //state from store that will automatically be filled when the above fn fetchs
  const allCreatedExams = useSelector((state) => state.teacher.allCreatedExams);

  //fetching only one time when mount and storing value in store, so next time no need to fetch again
  useEffect(() => {
    //condion to block if store already has fetched data, just like simple cache
    if (allCreatedExams.length <= 0) {
      fetchingAllCreateExamForTecher();
    }
  }, []);

  //gave a refresh btn so that when techer creates new exam , to hard refresh by click this btn, otherwiese the chached data will be shown which will not have recent added test if not refresed
  const refreshFetchedCreatedExams = () => {
      fetchingAllCreateExamForTecher();
  }
  return (
    <div className="max-w-4xl mx-auto py-5 relative">
      <div className="wrapper">
        <h2 className="  font-semibold text-lg mb-5 flex items-center justify-center gap-2">
          All CREATED EXAMS <QuizIcon />
        </h2>
        <div className="flex items-center justify-end  mb-2"><button onClick={refreshFetchedCreatedExams} className=" cursor-pointer active:text-gray-500">refresh <AutorenewIcon /></button></div>
        {loading && <Skeleton />}
        {!loading && allCreatedExams?.length <= 0 ? (
          <p className="flex gap-2 items-center text-gray-400">
            No Exams created till now! <SentimentVeryDissatisfiedIcon />
          </p>
        ) : (
          <div className="maps w-full ">
            {!loading && allCreatedExams.map((exam,index) => (
              <TeacherExamCreatedRowWithButtons key={exam._id} index={index} exam={exam} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherDashboard;
