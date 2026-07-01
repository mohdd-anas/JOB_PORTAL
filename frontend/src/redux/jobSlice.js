import { createSlice } from '@reduxjs/toolkit'

const jobSlice = createSlice({
    name: 'job',
    initialState: {
        allJobs: [],
        adminJobs: [],
        singleJob: null,
        allAppliedJobs: [],
        searchJobQuery: '',
    },
    reducers: {
        setAllJobs: (state, action) => {
            state.allJobs = action.payload
        },
        setAdminJobs: (state, action) => {
            state.adminJobs = action.payload
        },
        setSingleJob: (state, action) => {
            state.singleJob = action.payload
        },
        setAllAppliedJobs: (state, action) => {
            state.allAppliedJobs = action.payload
        },
        setSearchJobQuery: (state, action) => {
            state.searchJobQuery = action.payload
        },
    }
})

export const { setAllJobs, setAdminJobs, setSingleJob, setAllAppliedJobs, setSearchJobQuery } = jobSlice.actions
export default jobSlice.reducer