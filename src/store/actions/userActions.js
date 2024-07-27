import {createAsyncThunk} from '@reduxjs/toolkit';
import UserApi from '../../datalib/services/user.api';
/*
 * This function is used to create an action to fetch an user by his id
 * @author Kindajobs <mohitkumar.webdev@gmail.com>
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
 * This function is used to create an action to  update  user information
 * @author Kindajobs <mohitkumar.webdev@gmail.com>
 */
// export const updateUser = createAsyncThunk(
//   'user/update-user',
//   async (user, {rejectWithValue}) => {
//     try {
//       // TODO: Removing profilePic while updating user, no need to clutter api call
//       user.picture = null;
//       return await new UserApi().updateUser(user);
//     } catch (error) {
//       return rejectWithValue(error.code);
//     }
//   },
// );

/*
 * This function is used to create an action to upload a picture
 * @author Kindajobs <mohitkumar.webdev@gmail.com>
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
 * @author Kindajobs <mohitkumar.webdev@gmail.com>
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

export const fetchAttendanceReport = createAsyncThunk(
  'fetch/attendance/report',
  async ({month,year}, {rejectWithValue}) => {
    try {
      const res = await new UserApi().fetchAttendReport({month,year});
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


