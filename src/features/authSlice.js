import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    user:{}
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        settingUser : (state, action)=>{
            state.user = action.payload
        },
        resetUserSlice:()=> initialState
    }
})


export const {settingUser,resetUserSlice} = authSlice.actions
export default authSlice.reducer