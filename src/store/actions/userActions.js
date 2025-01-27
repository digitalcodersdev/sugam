import {createAsyncThunk} from '@reduxjs/toolkit';
import UserApi from '../../datalib/services/user.api';

export const getUserDetails = createAsyncThunk(
  'get/user/details',
  async (data, {rejectWithValue}) => {
    try {
      return await new UserApi().getUserDetails();
    } catch (error) {
      return rejectWithValue(error.code);
    }
  },
);

export const getCentres = createAsyncThunk(
  'get/centres',
  async (data, {rejectWithValue}) => {
    try {
      return await new UserApi().getCentreDetails();
    } catch (error) {
      return rejectWithValue(error.code);
    }
  },
);
export const getPendingEnrollments = createAsyncThunk(
  'get/pending/enrollments',
  async ({branchId, centerId}, {rejectWithValue}) => {
    try {
      return await new UserApi().getPendingEnrollments({branchId, centerId});
    } catch (error) {
      return rejectWithValue(error.code);
    }
  },
);

/*
 * This function is used to create an action to fetch an user by his id
 * @author Sugam <mohitkumar.webdev@gmail.com>
 */
export const getUserById = createAsyncThunk(
  'user/getUserById',
  async (userId, {rejectWithValue}) => {
    try {
      return await new UserApi().getUserById();
    } catch (error) {
      return rejectWithValue(error.code);
    }
  },
);

/*
 * This function is used to create an action to upload a picture
 * @author Sugam <mohitkumar.webdev@gmail.com>
 */
export const uploadProfilePic = createAsyncThunk(
  'user/uploadProfilePic',
  async ({userId, picture}, {rejectWithValue}) => {
    try {
      return await new UserApi().uploadProfilePic(userId, picture);
    } catch (error) {
      return rejectWithValue(error.code);
    }
  },
);

/*
 * This function is used to create an action to  update  user information
 * @author Sugam <mohitkumar.webdev@gmail.com>
 */
export const updateUser = createAsyncThunk(
  'user/update-user',
  async (user, {rejectWithValue}) => {
    try {
      return user;
    } catch (error) {
      return rejectWithValue(error.code);
    }
  },
);

export const fetchAllTasks = createAsyncThunk(
  'fetch/tasks',
  async (data, {rejectWithValue}) => {
    try {
      const res = await new UserApi().fetchTasks();
      if (res) {
        return res;
      }
    } catch (error) {
      return rejectWithValue(error.code);
    }
  },
);

export const fetchAllProjects = createAsyncThunk(
  'fetch/projects',
  async (data, {rejectWithValue}) => {
    try {
      const res = await new UserApi().fetchProjects();
      if (res) {
        return res;
      }
    } catch (error) {
      return rejectWithValue(error.code);
    }
  },
);

export const fetchClockinStatus = createAsyncThunk(
  'fetch/clockin/status',
  async (data, {rejectWithValue}) => {
    try {
      const res = await new UserApi().fetchClockinStatus();
      if (res) {
        return res;
      }
    } catch (error) {
      return rejectWithValue(error.code);
    }
  },
);

export const fetchCurrentDayCollectionByBranchId = createAsyncThunk(
  'fetch/current-day/collection',
  async ({branchId, date}, {rejectWithValue}) => {
    try {
      return await new UserApi().fetchCurrentDayCollectionByBranchId({
        branchId,
        date,
      });
    } catch (error) {
      return rejectWithValue(error.code);
    }
  },
);
export const fetchCurrentDayCollectionByCenterId = createAsyncThunk(
  'fetch/current-day/collection/center-id',
  async ({centerId, branchId}, {rejectWithValue}) => {
    try {
      return await new UserApi().fetchCurrentDayCollectionByCenterId({
        centerId,
        branchId,
      });
    } catch (error) {
      return rejectWithValue(error.code);
    }
  },
);
export const fetchGRTCentres = createAsyncThunk(
  'fetch/grt/centres',
  async ({centerId, branchId}, {rejectWithValue}) => {
    try {
      return await new UserApi().fetchGRTCentres({
        centerId,
        branchId,
      });
    } catch (error) {
      return rejectWithValue(error.code);
    }
  },
);

export const fetchAttendanceReport = createAsyncThunk(
  'fetch/attendance/report',
  async ({month, year}, {rejectWithValue}) => {
    try {
      const res = await new UserApi().fetchAttendReport({month, year});
      if (res) {
        return res;
      }
    } catch (error) {
      return rejectWithValue(error.code);
    }
  },
);

export const fetchHolidays = createAsyncThunk(
  'fetch/holidays',
  async (data, {rejectWithValue}) => {
    try {
      const res = await new UserApi().fetchHolidays();
      if (res) {
        return res;
      }
    } catch (error) {
      return rejectWithValue(error.code);
    }
  },
);

export const fetchProposals = createAsyncThunk(
  'fetch/proposals',
  async (data, {rejectWithValue}) => {
    try {
      return await new UserApi().fetchLoanProposalReviewData({
        branchId: data,
      });
    } catch (error) {
      return rejectWithValue(error.code);
    }
  },
);


export const fetchAMProposals = createAsyncThunk(
  'fetch/proposals/am',
  async (data, {rejectWithValue}) => {
    try {
      return await new UserApi().fetchLoanProposalReviewAMData({
        branchId: data,
      });
    } catch (error) {
      return rejectWithValue(error.code);
    }
  },
);
