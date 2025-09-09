import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/APIs";
import Modal from "./ui/Modal";
import useFetchHookForTeacher from "../hooks/teacher/useFetchHookForTeacher";
import toast from "react-hot-toast";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { settingSelectedExamToEdit } from "../features/teacherSlice";
import { useDispatch } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function TeacherExamCreatedRowWithButtons({ exam, index }) {
  // this is funtion that fetches allexamcreate and i have this in here bcz when i delete below, then i need to refetch so
  const { fetchingAllCreateExamForTecher, loading } = useFetchHookForTeacher();

  const [shhowModalDelete, setShowModelDelete] = useState(false); //not needed just wanted to work with modal atleast one place in this demo
  const [idToDelete, setIdToDelete] = useState();
  const [localLoading, setLocalLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //delete exam with model, this will only set modal true and the fn that will triger original delete is from that yes Btn click from model
  const handleDeleteExam = async (id) => {
    setIdToDelete(id);
    setShowModelDelete(true);
  };

  //this will be triggerd when use clicks ok btn of shown modal basicaly confirm delete btn
  const deleteExamFinally = async () => {
    if (localLoading) {
      return; //basicaly this stops multiple delete clicks
    }
    //lodaing true and basic type check is i have id or not
    setLocalLoading(true);
    if (!idToDelete) {
      // console.log("no id to delete");
      return;
    }

    //axios call to delete
    try {
      const res = await api.delete(
        `/dashboard/Teachers/deleteExam?id=${idToDelete}`
      );
      toast.success("Exam deleted Successfully!");
    } catch (error) {
      // console.log(error);
    }
    //this is the func that i imported and job of this is to fetch, so iam calling this after delete as a refresh btn that will fetch the table after exam
    fetchingAllCreateExamForTecher();
    setShowModelDelete(false);
  };

  //triger when clicked view exam btn which will load a componet with just plain exam deails
  const handleViewExam = (id, subjectName) => {
    // navigate(`view-exam/Qid=${id}&subject=${subjectName}`)
    navigate(`view-exam?Qid=${id}&subject=${subjectName}`);
  };

  //this effect is only to bandage the loading conflict between local and loading that we get from fetching allCreatedExamn
  useEffect(() => {
    setLocalLoading(loading);
  }, [loading]);

  //redirecting based on id and setting what is expected as payload for updating a edit so this dispatch is only storing payload type syntx storing in store for future
  const handleEdit = (_id, subjectName, notes) => {
    dispatch(settingSelectedExamToEdit({ _id, notes, subjectName })); //bcz when updating with put request i will be needing this subName,notes etc which is not geteable by just id at the end, so preparing early.
    navigate(`/teacher/editexam/${_id}`);
  };
  return (
    <div
      className={`p-5 relative w-full rounded-xl bg-white shadow  mb-10 ${
        localLoading ? "opacity-30" : ""
      }`}
    >
      {shhowModalDelete && (
        <Modal
        btnAgree={localLoading ? "wait..." : "yes Delete"}
        btnDisagree={"go Back"}
        title={"Delete Exam"}
        content={
          "Do you really want to delete the exam. once you delete there will no going back"
        }
        disagreeFn={() => setShowModelDelete(false)}
        agreeFn={() => deleteExamFinally()}
        loading={localLoading}
        />
      )}
      {index==0 ? <span className="p absolute top-0 bg-amber-50 text-amber-500 -ml-5 px-3">recently created</span> : ""}
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <div className="infos">
          <div className="sub mt-5">
            Subject : <span className=" font-semibold">{exam.subjectName}</span>
          </div>
          <div className="note mt-1 ">by-Teacher : {exam.email}</div>
          <div className="note mt-1">
            note :{" "}
            {exam.notes.map((note, i) => (
              <div key={i}> - {note}</div>
            ))}
          </div>
          <div className="btn mt-5">
            <button
              onClick={() => handleViewExam(exam._id, exam.subjectName)}
              className="py-2 px-5 cursor-pointer rounded-full bg-black text-white"
            >
              view details <ArrowOutwardIcon sx={{ fontSize: 25 }} />
            </button>
          </div>
        </div>
        <div className="btns flex gap-2">
          <div className="del">
            <button
              onClick={() => handleEdit(exam._id, exam.subjectName, exam.notes)}
              className="bg-blue-50 flex gap-1 py-2 px-5 text-blue-400 cursor-pointer rounded"
            >
              
              <EditIcon sx={{ fontSize: 18  }} />
            </button>
          </div>
          <div className="div">
            <button
              onClick={() => handleDeleteExam(exam._id, exam.subjectName)}
              className="bg-red-50 flex gap-1  text-red-400 py-2 px-5 cursor-pointer rounded"
            >
              
              <DeleteIcon sx={{ fontSize: 18 }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherExamCreatedRowWithButtons;
