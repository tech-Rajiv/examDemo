import { useEffect, useState } from "react";
import AllStudentsPaginatedComp from "../../components/AllStudentsPaginatedComp";
import CoPresentIcon from "@mui/icons-material/CoPresent";
import { useSelector } from "react-redux";
import AutorenewIcon from '@mui/icons-material/Autorenew';

import useFetchHookForTeacher from "../../hooks/teacher/useFetchHookForTeacher";
import Skeleton from "../../components/ui/Skeleton";

function ShowAllStudents() {
  const [activeOnly, setActiveOnly] = useState(false); //will be used to render different comp based on boolen
  const [searchValue, setSearchValue] = useState("")
  //this is value that is stored as allStudents propbably has 1100+ so i donot want to refresh on comp mount bcz it doesnt matter that deep that one student is less or more so
  const allStudentsAreadyInStore = useSelector(
    (state) => state.teacher.allStudentsArray
  );

  //this is done at time getting all students just filter active to new variable and will be shown based on variable activeOnly
  const allStudentsActiveOnly = useSelector(
    (state) => state.teacher.allActiveStudentsArray
  );

  //here iam getting function not calling, which will dispatch a event and setallStudents data
  const { fetchAllStudentsToShow, loading, error } = useFetchHookForTeacher();

  useEffect(() => {
    // before calling iam checking if i already have stored the data, cache
    if (!allStudentsAreadyInStore || allStudentsAreadyInStore?.length == 0) {
      fetchAllStudentsToShow("dashboard/Teachers");
    }
  }, []);

  const handleRefresh = () => {
      fetchAllStudentsToShow("dashboard/Teachers");
  }
  //this feature is incomplete now as i stoped working on dvelopment form 29th aug
  const handleSearch = ()=>{
    // console.log(searchValue);
  }
  return (
    <div className="max-w-7xl mx-auto py-5 ">
      <div className="wrapper flex flex-col gap-10">
        <div className="text-center flex  justify-between items-center text-xl">
          <div className="normal flex gap-2 items-center  underline-offset-12">
            All Studenst data <CoPresentIcon sx={{ fontSize: 22 }} />
          </div>
          <div className="btns flex gap-5 items-center">
        <button onClick={handleRefresh} className="refresh cursor-pointer active:text-gray-500">
          refresh<AutorenewIcon />
        </button>

          <button
            onClick={() => setActiveOnly((prev) => !prev)}
            className={`filtered ${
              activeOnly ? "bg-black" : "bg-gray-300"
            }  cursor-pointer text-white px-2 rounded-full`}
          >
            Active only
          </button>
          </div>
        </div>
        {/* <div className="inp flex gap-2 items-center">
          <input type="search" value={searchValue} onChange={(e)=>setSearchValue(e.target.value)}  className="p-2 border rounded-lg min-w-90" /> <button onClick={handleSearch} className="bg-gray-200 p-2 rounded-lg cursor-pointer active:bg-gray-300">Search</button>
        </div> */}
        {loading && <Skeleton />}
        {error && (
          <div className="err">
            Something went wrong. please try after sometimes
          </div>
        )}
        {!loading && activeOnly && (
          <AllStudentsPaginatedComp allStudents={allStudentsActiveOnly} />
        )}
        {!loading && !activeOnly && (
          <AllStudentsPaginatedComp allStudents={allStudentsAreadyInStore} />
        )}
      </div>
    </div>
  );
}

export default ShowAllStudents;
