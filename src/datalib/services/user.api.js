import {Alert} from 'react-native';
import sInfoUtil from '../../utils/sInfo.util';
import getApiUri from '../api.util';
import SecuredBaseApi from '../securedBase.api';

class AuthenticationApi extends SecuredBaseApi {
  async sendClientOtp({phone}) {
    try {
      const response = await this.securedAxios.post(
        getApiUri(`/send/otp/client/${phone}`),
      );
      if (response.data?.transactionId) {
        return response;
      }
      return response;
    } catch (error) {
      if (error?.code == 'ERR_NETWORK') {
        Alert.alert('please check your internet connection and try again');
      }
      console.log(error);
      return false;
    }
  }
  async getUserDetails() {
    try {
      const response = await this.securedAxios.get(
        getApiUri('/get/user/details'),
      );
      if (response.data && response.success) {
        await sInfoUtil.save('USER_CONTEXT', JSON.stringify(response.data));
        return response.data;
      }
      return false;
    } catch (err) {
      if (err?.code == 'ERR_NETWORK') {
        Alert.alert('please check your internet connection and try again');
      }
      console.error('getUserDetails', err);
      return false;
    }
  }

  async getCentreDetails() {
    try {
      const response = await this.securedAxios.get(getApiUri('/get/centres'));
      if (response?.success) {
        return response.data;
      }
      return false;
    } catch (error) {
      if (error?.code == 'ERR_NETWORK') {
        Alert.alert('please check your internet connection and try again');
      }
      console.log(error);
      return false;
    }
  }

  async getMaxCenterNo(data) {
    try {
      const response = await this.securedAxios.post(
        getApiUri('/get/max/center/number'),
        data,
      );
      if (response.data && response.success) {
        return response;
      }
      return false;
    } catch (err) {
      if (err?.code == 'ERR_NETWORK') {
        Alert.alert('please check your internet connection and try again');
      }
      console.error(err);
      return false;
    }
  }

  async createCenter(data) {
    try {
      const response = await this.securedAxios.post(
        getApiUri('/create/center'),
        data,
      );
      if (response.data && response.success) {
        return response;
      }
      return false;
    } catch (err) {
      if (err?.code == 'ERR_NETWORK') {
        Alert.alert('please check your internet connection and try again');
      }
      console.error(err);
      return false;
    }
  }

  async fetchEmployeeDirectory() {
    try {
      const response = await this.securedAxios.get(
        getApiUri('/fetch/emp/directory'),
      );
      if (response?.success) {
        return response;
      }
      return false;
    } catch (err) {
      if (err?.code == 'ERR_NETWORK') {
        Alert.alert('please check your internet connection and try again');
      }
      console.error(err);
      return false;
    }
  }

  async fetchEmployeeTypes() {
    try {
      const response = await this.securedAxios.get(
        getApiUri('/fetch/user/type'),
      );
      if (response?.success) {
        return response;
      }
      return false;
    } catch (err) {
      if (err?.code == 'ERR_NETWORK') {
        Alert.alert('please check your internet connection and try again');
      }
      console.error(err);
      return false;
    }
  }

  async fetchConatctInformation() {
    try {
      const response = await this.securedAxios.get(
        getApiUri('/fetch/company/data'),
      );
      if (response?.success) {
        return response;
      }
      return false;
    } catch (err) {
      if (err?.code == 'ERR_NETWORK') {
        Alert.alert('please check your internet connection and try again');
      }
      console.error(err);
      return false;
    }
  }

  async fetchGrievanceDropdowns() {
    try {
      const response = await this.securedAxios.get(
        getApiUri(`/fetch/grievance/dropdown`),
      );
      if (response.data) {
        return response.data;
      }
      return false;
    } catch (err) {
      if (err?.code == 'ERR_NETWORK') {
        Alert.alert('please check your internet connection and try again');
      }
      console.error(err);
      return false;
    }
  }

  async saveGrievance(data) {
    try {
      const response = await this.securedAxios.post(
        getApiUri(`/save/grievance`),
        data,
      );
      if (response.data) {
        return response.data;
      }
      return false;
    } catch (err) {
      if (err?.code == 'ERR_NETWORK') {
        Alert.alert('please check your internet connection and try again');
      }
      console.error(err);
      return false;
    }
  }

  async sendAadharOtp({aadharNo}) {
    try {
      const response = await this.securedAxios.post(
        getApiUri(`/generate/aadhar/otp/${aadharNo}`),
      );
      if (response.data) {
        return response;
      }
      return false;
    } catch (err) {
      if (err?.code == 'ERR_NETWORK') {
        Alert.alert('please check your internet connection and try again');
      }
      console.error(err);
      return false;
    }
  }
  async fetchAttendReport({month, year}) {
    try {

      const response = await this.securedAxios.get(
        getApiUri(`/attendance/report?month=${month}&year=${year}`),
      );
      console.log(response);
      if (response.data) {
        return response.data;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async fetchHolidays() {
    try {
      const response = await this.securedAxios.get(getApiUri('/holiday'));
      console.log('Holidats', response);
      if (response.data) {
        return response.data;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async clockIn({currentLatitude, currentLongitude, working_from}) {
    try {
      const response = await this.securedAxios.post(
        getApiUri('/attendance/clock-in'),
        {currentLatitude, currentLongitude, working_from},
      );
      console.log('===-=-============', response, 'attendance/clock-in');
      if (response.data) {
        return response;
      }
      return false;
    } catch (err) {
      console.log(err);
      console.error(err);
      return false;
    }
  }
  async clockOut({id}) {
    try {
      const response = await this.securedAxios.post(
        getApiUri(`/attendance/clock-out/${id}`),
      );
      // console.log('===-=-============', response);
      if (response.data) {
        return response;
      }
      return false;
    } catch (err) {
      console.log(err);
      console.error(err);
      return false;
    }
  }

  async fetchTasks() {
    try {
      const response = await this.securedAxios.get(getApiUri('/task'));
      if (response.data) {
        return response.data;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
  async fetchTaskDetailsById({id}) {
    try {
      const response = await this.securedAxios.get(getApiUri(`/task/${id}`));
      if (response.data) {
        return response.data;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async fetchProjects() {
    try {
      const response = await this.securedAxios.get(getApiUri('/project'));
      console.log('PROJECTs', response);
      if (response.data) {
        return response.data;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async fetchProjectDetailsById({id}) {
    try {
      const response = await this.securedAxios.get(getApiUri(`/project/${id}`));
      if (response.data) {
        return response.data;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async updateUser(data) {
    try {
      const response = await this.securedAxios.put(
        getApiUri('/user/update-profile'),
        data,
      );
      if (response.data) {
        return response.data;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async verifyEmailOTP(email, otp) {
    try {
      const response = await this.securedAxios.post(
        getApiUri('/auth/verify-email'),
        {email, otp},
      );
      console.log(response);
      if (response.data) {
        return response;
      }
      return false;
    } catch (err) {
      console.log(err);
      console.error(err);
      return false;
    }
  }

  async getUserById() {
    try {
      const response = await this.securedAxios.get(
        getApiUri('/user/get-user-profile'),
      );
      console.log('response', response);
      if (response.data) {
        return response.data;
      }
      return false;
    } catch (err) {
      console.error('err', err);
      return false;
    }
  }

  async uploadProfilePic(file) {
    try {
      console.log('uploadProfilePic', file);
      const response = await this.securedAxios.post(
        getApiUri('/utility/upload-file'),
        file,
      );
      console.log(response);
      if (response.data) {
        return response.data;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}

export default AuthenticationApi;
