import React, { useEffect, useState } from "react";
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import {  useNavigate } from "react-router-dom";
function ExamSubmiitedSuccessfully() {

  return (
    <div className="flex h-screen justify-center items-center ">
      <div className="wrap p-10 -m-30 flex gap-2 items-center bg-green-50  text-green-500 ">
            <AssignmentTurnedInIcon />
        Done. Exam submitted successfully...
        </div>
    </div>
  );
}

export default ExamSubmiitedSuccessfully;
