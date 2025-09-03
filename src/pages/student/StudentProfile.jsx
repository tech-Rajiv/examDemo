import { useEffect, useState } from "react";
import api from "../../services/APIs";
import { useDispatch, useSelector } from "react-redux";
import { settingUser } from "../../features/authSlice";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import toast from "react-hot-toast";
function StudentProfile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [localName, setLocalName] = useState(""); //this is to control input which we will set whle use is typing
  const [name, setName] = useState(""); //this is only called once and has value and will not change and this wil basically do comparision of where name and local name are diferent then only call putreq
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  //this will run in refresh bcz in baseStudentLayout iam calling a function that updates redux state so this user state from redux will trigger this useeffect to rerun
  useEffect(() => {
    setName(user.name);
    setLocalName(user.name);
    setEmail(user.email);
  }, [user]);

  //only when user changed name and clicked to update. this will basically validate a change then process or stop req
  const handleNameChange = async () => {

    //if the value is empty so early exit
    if (!localName.trim()) {
      setError("please provide a valid name");
      return;
    }

    //if no change then exit here
    if (localName.trim() === name) {
      setError("please change name and then save");
      return;
    }

    //if everything is fine then proceed
    setLoading(true);
    const payload = {
      name: localName,
    };

    //call main put fn
    fetchAndUpdateName(payload);
  };


  //main fn that will do a put req
  const fetchAndUpdateName = async (payload) => {
    try {
      const res = await api.put("student/studentProfile", payload);
      if (res.data?.statusCode === 200) {
        dispatch(settingUser({ ...user, name: localName }));
        toast.success("name updated successfully!");
      }
    } catch (error) {
      toast.error("failed to change name!");
      setLocalName(name);
    } finally {
      setLoading(false);
    }
  };

  //incase i donot have details stored in store then probably show this.
  if (!user.name) {
    return "something went wrong";
  }

  return (
    <div className="flex py-10 justify-center">
      <div className="wrapper max-w-xl mx-auto bg-white rounded-2xl shadow p-10">
        <h2 className="mb-10 text-lg font-semibold flex justify-center items-center gap-2">
          <AccountCircleOutlinedIcon /> Profile
        </h2>
        <div className="main flex flex-col  mx-auto gap-4 mb-3">
          <div className="logo flex items-center gap-5">
            <span>Email</span>: <span>{email}</span>
          </div>
          <div className="logo flex items-center gap-5">
            <span>Role</span>:<span>Student</span>
          </div>
          <div className="name flex gap-2">
            <input
              type="text"
              placeholder="name"
              className="p-2 rounded border"
              value={localName}
              onChange={(e) => {
                setError("");
                setLocalName(e.target.value);
              }}
            />
            {loading ? (
              <div className="btnPrimary text-center">please wait...</div>
            ) : (
              <button onClick={handleNameChange} className="btnPrimary">
                Change Name
              </button>
            )}
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
