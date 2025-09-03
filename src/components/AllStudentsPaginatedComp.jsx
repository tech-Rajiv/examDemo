import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { settingParticularStudentResult } from "../features/teacherSlice";
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
function AllStudentsPaginatedComp({allStudents }) {

  const [showStudents, setShowStudents] = useState([]); // placeholder to only store 10list at a time
  const [pageNo, setPageNo] = useState(1); //initialy starting at 1
  const [maxPageCount ,setMaxPageCount] = useState() //just last count of pagination

const dispatch = useDispatch()
  const navigate = useNavigate()

  //logic wise slicing and adding 10 to the placeholder
  const paginationLogic = (number) => {
    setShowStudents(allStudents?.slice(number, number + 10));
  };

  //this is mostly bcz of how miui library work they give value as number in pagination with event of nchange. see jsx below to understand
  const handlePageChhange = (event, value) => {
    setPageNo(value);
  };

  //this is to triger when pagechnage so that content of placeholder to change
  useEffect(() => {
    paginationLogic(pageNo);
  }, [pageNo, allStudents]);
  
  //counting setting last pageNumber
  useEffect(()=>{
    setMaxPageCount(Math.floor(allStudents.length/10))
  },[allStudents])

  //this to fetch all details of a particula student if he has any result
  const handelDetailShowOfStudent = (id) => {
    // cachedResultToStoreFirst(id)
     navigate(`./student-details/${id}`)
  }

  const cachedResultToStoreFirst = (id) =>{
      dispatch(settingParticularStudentResult({id,result:[]}))
  }
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
        {showStudents?.map((student,index) => (
          <div key={student._id} className="wraper mb-5">
            <div className="stdWrapper border-b border-gray-400 p-2 grid grid-cols-[1fr_1.5fr_1fr_.5fr] gap-5">
              {/* <div className="id">{student._id}</div> */}
             
              <div className="name">{student.name}</div>
              <div className="email">{student.email}</div>
              <div className="status">{student.status}</div>
              <div onClick={()=>handelDetailShowOfStudent(student._id)} className="details cursor-pointer underline flex items-center">viewDetails<ArrowOutwardIcon /></div>
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
    </div>
  );
}

export default AllStudentsPaginatedComp;
