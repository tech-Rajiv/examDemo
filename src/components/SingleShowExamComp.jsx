import React from "react";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";

function SingleShowExamComp({ test }) {
  return (
    <div className="p-5   bg-white  border-b border-gray-300">
      <div className="top flex  flex-col sm:flex-row  justify-between gap-2 sm:items-center">
        <div className="sub mt-2">
          Subject : <span className=" font-semibold">{test.subjectName}</span>
        </div>
        <div className="note mt-1 ">by-Teacher : {test.email}</div>

        <div className="btn">
          {test.Result.length >= 1 ? (
            <button
              data-exam_id={test._id}
              className="showTheResult bg-blue-50 py-2 px-5 text-blue-500 hover:bg-blue-100/70 cursor-pointer rounded-full"
            >
              Show Result <ArrowOutwardIcon sx={{ fontSize: 25 }} />
            </button>
          ) : (
            <button
              data-exam_id={test._id}
              data-subject={test.subjectName}
              className="giveTheExam bg-black hover:bg-black/80 rounded-full py-2 px-5  cursor-pointer text-white flex items-center gap-2"
            >
              Start Exam <ArrowOutwardIcon sx={{ fontSize: 25 }} />
            </button>
          )}
        </div>
      </div>

      <div className="note hidden mt-1">
        note :{" "}
        {test.notes.map((note, i) => (
          <div key={i}> - {note}</div>
        ))}
      </div>
    </div>
  );
}

export default SingleShowExamComp;
