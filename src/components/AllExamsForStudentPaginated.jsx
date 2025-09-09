import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";

function AllExamsForStudentPaginated({ allExams }) {
  // console.log(allExams);
  const [showExams, setShowExams] = useState([]); // placeholder to only store 10list at a time
  const [pageNo, setPageNo] = useState(1); //initialy starting at 1
  const [maxPageCount, setMaxPageCount] = useState();
  const pageSize = 5
  //logic wise slicing and adding 10 to the placeholder
  const paginationLogic = (number) => {
       const startIndex = (number - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setShowExams(allExams?.slice(startIndex, endIndex));
  };

  //this is mostly bcz of how miui library work they give value as number in pagination with event of nchange. see jsx below to understand
  const handlePageChhange = (event, value) => {
    // console.log("Page clicked:", value);
    setPageNo(value);
  };

  //this is to triger when pagechnage so that content of placeholder to change
  useEffect(() => {
    paginationLogic(pageNo);
  }, [pageNo, allExams]);

  useEffect(() => {
    setMaxPageCount(Math.floor(allExams.length / 5));
  }, [allExams]);

  return <div> <div className="load flex flex-col overflow-auto">
      <div className="datas ">
        <div className="head grid text-lg  grid-cols-[1fr_1fr_1fr_1fr] mb-5 font-semibold">
          <div className="id">ID</div>
          <div className="name">Name</div>
          <div className="email">Result</div>
          <div className="status">Take Exam</div>
        </div>
        {showExams?.map((exam) => (
          <div key={exam._id} className="wraper mb-5">
            <div className="stdWrapper border-b border-gray-400 p-2 grid grid-cols-[1fr_1fr_1fr_1fr] gap-5">
              <div className="name">{exam.subjectName}</div>
              <div className="email">{exam.email}</div>
              <div className="id">{exam.Result[0]}</div>
              <div className="status">no</div>
            </div>
          </div>
        ))}
      </div>
      <div className="pageTabs flex justify-center">
        <Stack spacing={2}>
          <Pagination
            count={maxPageCount}
            color="primary"
            onChange={handlePageChhange}
          />
        </Stack>
      </div>
    </div></div>;
}

export default AllExamsForStudentPaginated;
