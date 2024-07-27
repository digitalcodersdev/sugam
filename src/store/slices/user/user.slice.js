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
  fetchHolidays
} from '../../actions/userActions';
// TODO: Should we have api based status and errors for more fine grained control
/*
 * This function is used to create user slice
 * @author Kindajobs <mohitkumar.webdev@gmail.com>
 */

const initialThunkState = {status: ThunkStatusEnum.IDLE, error: null};

const initialState = {
  user: null,
  tasks: [],
  projects:[],
  clockin:null,
  attendanceReport:[],
  holidays:[],
  getUserByIdStatus: initialThunkState,
  updateUserStatus: initialThunkState,
  uploadProfilePicStatus: initialThunkState,
  updateUserAddressStatus: initialThunkState,

};

// TODO: Remove boilerplate?
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getUserById.pending, state => {
      state.getUserByIdStatus = defaultThunkLoadingState;
    });
    builder.addCase(getUserById.fulfilled, (state, action) => {
      state.getUserByIdStatus = defaultThunkSuccessState;
      console.log('getUserById', action.payload);
      state.user = action.payload;
    });
    builder.addCase(getUserById.rejected, (state, action) => {
      state.getUserByIdStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
    builder.addCase(updateUser.pending, state => {
      state.updateUserStatus = {
        ...defaultThunkLoadingState,
        statusMessage: 'loading message...',
      };
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.updateUserStatus = {
        ...defaultThunkSuccessState,
        statusMessage: 'api success',
      };
      // console.log(state.user.profileStatus, action.meta.arg);
      // state.user.profileStatus = action.meta.arg.profileStatus;
      // state.user = {...state.user, ...action.meta.arg};
      state.user = action.payload;
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.updateUserStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
        statusMessage: 'api rejected',
      };
    });

    // TODO: IMP: Handle profile pic, save on async storage?
    builder.addCase(uploadProfilePic.pending, state => {
      state.uploadProfilePicStatus = defaultThunkLoadingState;
    });
    builder.addCase(uploadProfilePic.fulfilled, (state, action) => {
      state.uploadProfilePicStatus = defaultThunkSuccessState;
      if (state.user) {
        state.user.picture = action.meta.arg.picture;
      }
    });
    builder.addCase(uploadProfilePic.rejected, (state, action) => {
      state.uploadProfilePicStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });

    builder.addCase(fetchAllTasks.pending, state => {
      state.uploadProfilePicStatus = defaultThunkLoadingState;
    });
    builder.addCase(fetchAllTasks.fulfilled, (state, action) => {
      state.uploadProfilePicStatus = defaultThunkSuccessState;
      state.tasks = action.payload;
    });
    builder.addCase(fetchAllTasks.rejected, (state, action) => {
      state.uploadProfilePicStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });

    builder.addCase(fetchAllProjects.pending, state => {
      state.uploadProfilePicStatus = defaultThunkLoadingState;
    });
    builder.addCase(fetchAllProjects.fulfilled, (state, action) => {
      state.uploadProfilePicStatus = defaultThunkSuccessState;
      state.projects = action.payload;
    });
    builder.addCase(fetchAllProjects.rejected, (state, action) => {
      state.uploadProfilePicStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });


    builder.addCase(fetchClockinStatus.pending, state => {
      state.uploadProfilePicStatus = defaultThunkLoadingState;
    });
    builder.addCase(fetchClockinStatus.fulfilled, (state, action) => {
      state.uploadProfilePicStatus = defaultThunkSuccessState;
      state.clockin = action.payload;
    });
    builder.addCase(fetchClockinStatus.rejected, (state, action) => {
      state.uploadProfilePicStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });


    builder.addCase(fetchAttendanceReport.pending, state => {
      state.uploadProfilePicStatus = defaultThunkLoadingState;
    });
    builder.addCase(fetchAttendanceReport.fulfilled, (state, action) => {
      state.uploadProfilePicStatus = defaultThunkSuccessState;
      state.attendanceReport = action.payload;
    });
    builder.addCase(fetchAttendanceReport.rejected, (state, action) => {
      state.uploadProfilePicStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });




    builder.addCase(fetchHolidays.pending, state => {
      state.uploadProfilePicStatus = defaultThunkLoadingState;
    });
    builder.addCase(fetchHolidays.fulfilled, (state, action) => {
      state.uploadProfilePicStatus = defaultThunkSuccessState;
      state.holidays = action.payload;
    });
    builder.addCase(fetchHolidays.rejected, (state, action) => {
      state.uploadProfilePicStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
  },
});

export default userSlice.reducer;

export const currentUserSelector = state => state.user.user || {};
export const tasksSelector = state => state?.user?.tasks || [];
export const projectsSelector = state=> state?.user?.projects||[];
export const clockinSelector = state=> state?.user?.clockin||{};
export const attendanceReportSelector = state=> state?.user?.attendanceReport||[];
export const holidaysSelector = state=> state?.user?.holidays||[];