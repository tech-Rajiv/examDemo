import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ListAltIcon from "@mui/icons-material/ListAlt";
import useFetchGetHook from "../../hooks/fetchHooks/useFetchGetHook";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch } from "react-redux";
import { settingSelectedExamToEdit } from "../../features/teacherSlice";
import BackButton from "../../components/ui/BackButton";
import LinearDeterminate from "../../components/ui/LinearProgress";

function ViewExamByTeacher() {

  const [allQuestions, setAllQuestions] = useState();
  //i would have to fetch questions to display here so id is needed
  const [searchParams] = useSearchParams();
  const id = searchParams.get("Qid");
  const subject = searchParams.get("subject");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //custom hook to just get error loading and data
  const { data, loading, error } = useFetchGetHook(
    `dashboard/Teachers/examDetail?id=${id}`
  );

  //running useEffect to setAllQuestion once data is loaded from fetch
  useEffect(() => {
    setAllQuestions(data?.data.questions);
  }, [data]);

  //incase of any external errors
  if (error) {
    return "something went wrong.. please try after some time";
  }

  //it is just to keep track of option
  const label = {
    1: "A",
    2: "B",
    3: "C",
    4: "D",
  };

  //just did besause the api needed this type of payload to putreq so while updating ques with later i will use this payload from store
  const handleEdit = () => {
    dispatch(
      settingSelectedExamToEdit({
        _id: id,
        notes: ["10am exam"],
        subjectName: subject,
      })
    );
    navigate(`/teacher/editexam/${id}`);
  };

  return (
    <div className="mx-auto max-w-3xl py-5">
      <BackButton />
      <h2 className="text-lg font-semibold text-center">
        Exam Questions <ListAltIcon />
      </h2>
      <div className="wrapper  mt-5 min-h-screen bg-white p-2 sm:p-10 rounded-2xl shadow">
        <div className="h2 mb-10 flex justify-between ">
          <div className="head font-semibold">All Questions</div>
          <button
            onClick={handleEdit}
            className="editButton cursor-pointer flex gap-2 items-center"
          >
            Edit <EditIcon sx={{ fontSize: "18px" }} />
          </button>
        </div>
        {loading && "Loading..."}
        <div className="wrapAllQues mt-10 flex flex-col gap-10">
          {allQuestions &&
            allQuestions?.map((question, quesIndex) => (
              <div key={quesIndex} className="wrapper mb-5">
                <div className="ques">
                  {quesIndex + 1}. {question.question}
                </div>
                {question.options.map((option, optIndex) => {
                  return (
                    <div key={optIndex} className="options mt-2 flex gap-2 items-center">
                      {label[optIndex + 1]}.{" "}
                      <p
                        className={` rounded-lg p-2 w-full ${
                          question.answer == option
                            ? "text-green-500 bg-green-50"
                            : "bg-gray-50"
                        }`}
                      >
                        {option}
                      </p>
                    </div>
                  );
                })}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default ViewExamByTeacher;
