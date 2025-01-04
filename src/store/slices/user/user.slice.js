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
  fetchCurrentDayCollectionByBranchId,
  fetchCurrentDayCollectionByCenterId,
  getPendingEnrollments,
} from '../../actions/userActions';
// TODO: Should we have api based status and errors for more fine grained control

/*
 * This function is used to create user slice
 * @author Sugam <mohitkumar.webdev@gmail.com>
 */

const initialThunkState = {status: ThunkStatusEnum.IDLE, error: null};

const initialState = {
  user: null,
  centres: [],
  tasks: [],
  projects: [],
  pendingEnrollments: [],
  clockin: null,
  attendanceReport: [],
  holidays: [],
  currentDayCollection: [],
  currentDayCollectionCenter: [],
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
    builder.addCase(fetchCurrentDayCollectionByBranchId.pending, state => {
      state.getUserByIdStatus = defaultThunkLoadingState;
    });
    builder.addCase(
      fetchCurrentDayCollectionByBranchId.fulfilled,
      (state, action) => {
        state.getUserByIdStatus = defaultThunkSuccessState;
        state.currentDayCollection = action.payload;
      },
    );
    builder.addCase(
      fetchCurrentDayCollectionByBranchId.rejected,
      (state, action) => {
        state.getUserByIdStatus = {
          ...defaultThunkFailureState,
          error: action.payload,
        };
      },
    );
    builder.addCase(fetchCurrentDayCollectionByCenterId.pending, state => {
      state.getUserByIdStatus = defaultThunkLoadingState;
    });
    builder.addCase(
      fetchCurrentDayCollectionByCenterId.fulfilled,
      (state, action) => {
        state.getUserByIdStatus = defaultThunkSuccessState;
        state.currentDayCollectionCenter = action.payload;
      },
    );
    builder.addCase(
      fetchCurrentDayCollectionByCenterId.rejected,
      (state, action) => {
        state.getUserByIdStatus = {
          ...defaultThunkFailureState,
          error: action.payload,
        };
      },
    );
    builder.addCase(getPendingEnrollments.pending, state => {
      state.getUserByIdStatus = defaultThunkLoadingState;
    });
    builder.addCase(getPendingEnrollments.fulfilled, (state, action) => {
      state.getUserByIdStatus = defaultThunkSuccessState;
      state.pendingEnrollments = action.payload;
    });
    builder.addCase(getPendingEnrollments.rejected, (state, action) => {
      state.getUserByIdStatus = {
        ...defaultThunkFailureState,
        error: action.payload,
      };
    });
  },
});

export default userSlice.reducer;
export const {restoreUserStore} = userSlice.actions;

export const currentUserSelector = state => state?.user?.user || {};
export const tasksSelector = state => state?.user?.tasks || [];
export const projectsSelector = state => state?.user?.projects || [];
export const clockinSelector = state => state?.user?.clockin || {};
export const attendanceReportSelector = state =>
  state?.user?.attendanceReport || [];
export const holidaysSelector = state => state?.user?.holidays || [];
export const centresSelector = state => state?.user?.centres || [];

export const currentDayCollectionSelector = state =>
  state?.user?.currentDayCollection || [];
export const currentDayCollectionCenterSelector = state =>
  state?.user?.currentDayCollectionCenter || [];



  export const pendingEnrollmentsSelector  = state =>
  state?.user?.pendingEnrollments || [];