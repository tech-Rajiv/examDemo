import useFetchAllTest from "../../hooks/student/useFetchAllTest";
import SingleShowExamComp from "../../components/SingleShowExamComp";
import { useNavigate } from "react-router-dom";
import QuizIcon from "@mui/icons-material/Quiz";
import { useDispatch, useSelector } from "react-redux";
import {
  settingExamStatus,
  settingStudentInALlExamsIsAtPageNo,
} from "../../features/studentSlice";
import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import AutorenewIcon from "@mui/icons-material/Autorenew";

//this comp has one job to show all exams and let user  interact
function StudentDashboard() {
  const { data, loading, error, throtleCheckAndFetch } = useFetchAllTest();
  const [showExams, setShowExams] = useState(); //this will hold sliced data with sync of pageno

  //now the paginations states
  //this is a logic which solves a problem that is when we change page and go to a comp suppose in page5 gone to see its result then when we press age page starts from 1, so to solve this problem and make user resume from page number they were i create a store state and logic
  const pageNoFromReduxIntial = useSelector(
    (state) => state.student.studentInAllExamsIsAtPageNo
  );
  const [pageNo, setPageNo] = useState(pageNoFromReduxIntial); //initialy starting at 1
  const [maxPageCount, setMaxPageCount] = useState(); //it is last number of pageination
  const listPerPage = 5; // items that can be paginated per page
  
  //few dispatches
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //just to set the data to showExams state when i get the data.
  useEffect(() => {
    paginationLogic(pageNo); //if data is there then this paginated logic will decide how much to show
    dispatch(settingStudentInALlExamsIsAtPageNo(pageNo));
  }, [data, pageNo]);

  //logic wise slicing and adding 10 to the placeholder
  const paginationLogic = (number) => {
    setShowExams(data?.slice(number, number + listPerPage)); //slicing 5items per page number
  };

  //this useefect can be used in above useefect but that has pagenum as dependency which will triger everytime page change so i had to make seprate useefect here
  useEffect(() => {
    setMaxPageCount(Math.floor(data?.length / listPerPage));
  }, [data]);

  // just in case i get an error so
  if (error) {
    // console.log(error);
    return "something went wrong.";
  }
  //i used the concept of delegation rather than assigning eventListner to all test for btns clicked which is roughly 700+ tests so i use tagName or could have used className  to get the targeted elemnt
  const handleTestClicked = (e) => {
    const element = e.target;
    if (element.tagName !== "BUTTON") return; //early exit if not clicked the. givexam btn

    const examId = element.dataset.exam_id; //this will be necessay to give exam to fetch questions
    const subject = element.dataset.subject; //used below to store in state. not necessay but i did
    if (element.classList.contains("giveTheExam")) {
      dispatch(
        settingExamStatus({
          submittedExam: false,
          apperingExam: true,
          selectedSubject: subject,
        })
      ); //just keeping values in store for future purpose maybe used in somewhere
      startTheExamFn(examId);
    }

    if (element.classList.contains("showTheResult")) showTheResultFn(examId); //as there are two btns in each one was take exam second is view result so this will trigger when clicked viewResult btn
  };

  //this just navigates to an exam paper comp
  const startTheExamFn = (examId) => {
    navigate(`/student/exam/${examId}`);
  };

  //this also navigates to a component which has result
  const showTheResultFn = (examId) => {
    navigate(`/student/exam-result/${examId}`);
  };

  //this is mostly bcz of how miui library work they give value, which when on change i am setting pageNo, which will start a useefect to slice from above
  const handlePageChange = (event, value) => {
    setPageNo(value);
  };

  //this will be helpfull when user clicks this button after giving test as result may take few time to reflect so that he can refresh in few sec to get latest data, which has result
  const handleRefresh = () => {
    throtleCheckAndFetch();
  };




  return (
    <div className="max-w-7xl mx-auto py-5">
      <div className="main w-full">
        <h2 className="py-2  font-semibold text-lg mb-5 flex items-center justify-center gap-2">
          All EXAMS <QuizIcon />
        </h2>
        <div className="refresh flex justify-end ">
          <button
            onClick={handleRefresh}
            className="btnRefresh text-gray-800 active:text-gray-400 py-2 px-2 flex items-center gap-2 cursor-pointer"
          >
            <AutorenewIcon />
            refresh
          </button>
        </div>
        {loading ? (
          "loading..."
        ) : (
          <div className="wrapper">
            <div
              onClick={handleTestClicked}
              className="allExamsDiv rounded-2xl overflow-hidden shadow"
            >
              {showExams?.map((test) => {
                return <SingleShowExamComp key={test._id} test={test} />;
              })}
            </div>
            <div className="pages flex justify-center gap-2 mt-5">
              <Stack spacing={2}>
                <Pagination
                  count={maxPageCount}
                  color="primary"
                  page={pageNoFromReduxIntial}
                  onChange={handlePageChange}
                />
              </Stack>
         
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
