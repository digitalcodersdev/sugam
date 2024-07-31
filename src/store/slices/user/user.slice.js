import {createSlice} from '@reduxjs/toolkit';
import {
  defaultThunkFailureState,
  defaultThunkLoadingState,
  defaultThunkSuccessState,
} from '../../../constants/thunk.config';
import {ThunkStatusEnum} from '../../../constants/thunkStatus.enum';
import {
  uploadProfilePic,
  getUserById,
  updateUser,
  fetchAllTasks,
  fetchAllProjects,
  fetchClockinStatus,
  fetchAttendanceReport,
  fetchHolidays,
  getUserDetails,
  getCentres,
} from '../../actions/userActions';
// TODO: Should we have api based status and errors for more fine grained control

/*
 * This function is used to create user slice
 * @author Kindajobs <mohitkumar.webdev@gmail.com>
 */

const initialThunkState = {status: ThunkStatusEnum.IDLE, error: null};

const initialState = {
  user: null,
  centres: null,
  tasks: [],
  projects: [],
  clockin: null,
  attendanceReport: [],
  holidays: [],
  getUserByIdStatus: initialThunkState,
  updateUserStatus: initialThunkState,
  uploadProfilePicStatus: initialThunkState,
  updateUserAddressStatus: initialThunkState,
};

// TODO: Remove boilerplate?
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {restoreUserStore: () => initialState},
  extraReducers: builder => {
    builder.addCase(getUserDetails.pending, state => {
      state.getUserByIdStatus = defaultThunkLoadingState;
    });
    builder.addCase(getUserDetails.fulfilled, (state, action) => {
      state.getUserByIdStatus = defaultThunkSuccessState;
      state.user = action.payload;
    });
    builder.addCase(getUserDetails.rejected, (state, action) => {
      state.getUserByIdStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    builder.addCase(getCentres.pending, state => {
      state.getUserByIdStatus = defaultThunkLoadingState;
    });
    builder.addCase(getCentres.fulfilled, (state, action) => {
      state.getUserByIdStatus = defaultThunkSuccessState;
      state.centres = action.payload;
    });
    builder.addCase(getCentres.rejected, (state, action) => {
      state.getUserByIdStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
  },
});

export default userSlice.reducer;
export const {restoreUserStore} = userSlice.actions;

export const currentUserSelector = state => state.user.user || {};
export const tasksSelector = state => state?.user?.tasks || [];
export const projectsSelector = state => state?.user?.projects || [];
export const clockinSelector = state => state?.user?.clockin || {};
export const attendanceReportSelector = state =>
  state?.user?.attendanceReport || [];
export const holidaysSelector = state => state?.user?.holidays || [];
export const centresSelector = state => state?.user?.centres || [];
