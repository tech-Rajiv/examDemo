import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { settingParticularStudentResult } from "../features/teacherSlice";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
function AllStudentsPaginatedComp({ allStudents }) {
  const [showStudents, setShowStudents] = useState([]); // placeholder to only store 10list at a time

  //pagination states
  const [pageNo, setPageNo] = useState(1); //initialy starting at 1
  const [maxPageCount, setMaxPageCount] = useState(); //just last count of pagination
  const pageSize = 10;

  const navigate = useNavigate();

  //logic wise slicing and adding 10 to the placeholder
  const paginationLogic = (page) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setShowStudents(allStudents?.slice(startIndex, endIndex));
  };

  //this is mostly bcz of how miui library work they give value as number in pagination with event of nchange. see jsx below to understand
  const handlePageChange = (event, value) => {
    setPageNo(value);
    paginationLogic(value);
  };



  useEffect(() => {
    if (allStudents?.length) {
      setMaxPageCount(Math.ceil(allStudents.length / pageSize));
      paginationLogic(pageNo); // load current page data
    }
  }, [allStudents, pageNo]);

  //counting setting last pageNumber
  useEffect(() => {
    setMaxPageCount(Math.floor(allStudents.length / 10)); 
  }, [allStudents]);

  //this to fetch all details of a particula student if he has any result
  const handelDetailShowOfStudent = (id) => {
    navigate(`./student-details/${id}`);
  };

  return (
    <div className="load flex flex-col ">
      <div className="datas ">
        <div className="head grid text-lg  grid-cols-[1fr_1.5fr_1fr_.5fr] mb-5 font-semibold">
          {/* <div className="id">ID</div> */}
          <div className="name">Name</div>
          <div className="email">Email</div>
          <div className="status">Status</div>
          <div className="status">Details</div>
        </div>
        {showStudents?.map((student, index) => (
          <div key={student._id} className="wraper mb-5">
            <div className="stdWrapper border-b border-gray-400 p-2 grid grid-cols-[1fr_1.5fr_1fr_.5fr] gap-5">
              {/* <div className="id">{student._id}</div> */}

              <div className="name">{student.name}</div>
              <div className="email">{student.email}</div>
              <div className="status">{student.status}</div>
              {student.status == "Active" ? (
                <div
                  onClick={() => handelDetailShowOfStudent(student._id)}
                  className="details cursor-pointer underline flex items-center text-blue-400"
                >
                  View Result
                  <ArrowOutwardIcon />
                </div>
              ) : (
                "No Result"
              )}
              {/* <div onClick={()=>handelDetailShowOfStudent(student._id)} className="details cursor-pointer underline flex items-center">viewDetails<ArrowOutwardIcon /></div> */}
            </div>
          </div>
        ))}
      </div>
      <div className="pageTabs flex justify-center">
        <Stack spacing={2}>
          <Pagination
            count={maxPageCount}
            color="primary"
            onChange={handlePageChange}
          />
        </Stack>
      </div>
    </div>
  );
}

export default AllStudentsPaginatedComp;
