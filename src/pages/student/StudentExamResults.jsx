import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import VerifiedIcon from '@mui/icons-material/Verified';
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import BackButton from "../../components/ui/BackButton";

function StudentExamResults() {
  //need to fetch result so this id is needed
  const { id } = useParams();
  const navigate = useNavigate()
  //this is what is stored when main student/ is called. so this state is always available. it has 700+ exams
  const allExamsForThisStudent = useSelector(
    (state) => state.student?.allExams
  );

//getting then paritcular exam by finiding it with id
  const examResultThanMatchedId = allExamsForThisStudent.find(
    (exam) => exam._id == id
  );

  //this is the good to have func which lets show error when the id is not found, so to handle that error i early exited this comp
  if(!examResultThanMatchedId){     
    return 'Something went wrong.'
  }
  //when everything is good
  const result = examResultThanMatchedId?.Result[0];


  return (
    <div className="py-10 max-w-md mx-auto">
         <BackButton />
      <div className=" bg-white shadow-md rounded-lg   p-6 border border-gray-200">
        <h2 className="mb-10 text-lg font-semibold flex justify-center items-center gap-2">
          <VerifiedIcon /> Result
        </h2>

        <div className="space-y-2">
          <p className="text-gray-600">
            <span className="font-medium">Subject:</span>{" "}
            <span className=" font-semibold text-gray-800 mb-4">
              {result?.subjectName}
            </span>
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Score:</span> {result?.score}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Rank:</span> {result?.rank}
          </p>
          <p className="text-gray-600 flex gap-2">
            <span className="font-medium">Result Status:</span>
            {result?.resultStatus}
          </p>
        </div>
      </div>
    </div>
  );
}

export default StudentExamResults;
