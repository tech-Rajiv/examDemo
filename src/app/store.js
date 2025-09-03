import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/authSlice'
import studentReducer from '../features/studentSlice'
import teacherReducer from '../features/teacherSlice'
const store = configureStore({
    reducer : {
        auth : authReducer,
        student : studentReducer,
        teacher : teacherReducer
    }
})


export default store