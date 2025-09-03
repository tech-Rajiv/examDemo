import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  allCreatedExams: [],
  creatingNewExam: [],
  selectedExamToEdit: [],
  halfCreatedExam: [],
  allStudentsArray:[],
  allActiveStudentsArray:[],
  particularStudentResult:{
    id:null,
    result:null
  }
};

const studentSlice = createSlice({
  name: "student ",
  initialState,
  reducers: {
    settingCreatedExam: (state, action) => {
      state.allCreatedExams = action.payload;
    },
    settingCreatingNewExam: (state, action) => {
      state.creatingNewExam = action.payload;
    },
    settingSelectedExamToEdit: (state, action) => {
      state.selectedExamToEdit = action.payload;
    },
    savingHalfCreatedExamInRedux: (state,action) => {
      state.halfCreatedExam = action.payload;
    },
    settingAllStudentsArray : (state, action) => {
      state.allStudentsArray = action.payload
    },
    settingAllActiveStudentsArray : (state, action) => {
      state.allActiveStudentsArray = action.payload
    },
    settingParticularStudentResult: (state, action)=>{
      state.particularStudentResult = action.payload
    },
    resetTeacherSlice : () => initialState
  },
});

export const {
  settingCreatedExam,
  settingCreatingNewExam,
  settingSelectedExamToEdit,
  savingHalfCreatedExamInRedux,
  settingAllStudentsArray,
  settingAllActiveStudentsArray,
  settingParticularStudentResult,
  resetTeacherSlice
} = studentSlice.actions;
export default studentSlice.reducer;
