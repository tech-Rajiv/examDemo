import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  allExams: [],
  examStatus: {
    apperingExam: false,
    selectedSubject: null,
    submittedExam: false,
  },
  studentInAllExamsIsAtPageNo: 1,
};

const studentSlice = createSlice({
  name: "student ",
  initialState,
  reducers: {
    settingAllExams: (state, action) => {
      state.allExams = action.payload;
    },
    settingExamStatus: (state, action) => {
      state.examStatus = action.payload;
    },
    settingStudentInALlExamsIsAtPageNo: (state, action) => {
      state.studentInAllExamsIsAtPageNo = action.payload;
    },
    resetStudentSlice: () => initialState,
  },
});

export const { settingAllExams, settingExamStatus, resetStudentSlice,settingStudentInALlExamsIsAtPageNo } =
  studentSlice.actions;
export default studentSlice.reducer;
