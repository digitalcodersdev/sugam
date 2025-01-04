import {Alert} from 'react-native';
import sInfoUtil from '../../utils/sInfo.util';
import getApiUri from '../api.util';
import SecuredBaseApi from '../securedBase.api';

class AuthenticationApi extends SecuredBaseApi {
  async sendClientOtp({phone, name}) {
    try {
      const response = await this.securedAxios.post(
        getApiUri(`/send/otp/client/${phone}/${name}`),
      );
      if (response?.data?.transactionId) {
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
  async getBankDropdown() {
    try {
      const response = await this.securedAxios.get(
        getApiUri('/get/bank/dropdowns'),
      );
      if (response.data && response.success) {
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

  async fetchMeetingStatus({CenterID, BranchID, MeetingDate}) {
    try {
      const response = await this.securedAxios.get(
        getApiUri(`/get/meeting/status/${BranchID}/${CenterID}/${MeetingDate}`),
      );
      if (response.success) {
        return response;
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

  async startMeeting({CenterID, BranchID}) {
    try {
      const response = await this.securedAxios.post(
        getApiUri(`/start/meeting/${BranchID}/${CenterID}`),
      );
      if (response.success) {
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

  async endMeeting({CenterID, BranchID}) {
    try {
      const response = await this.securedAxios.put(
        getApiUri(`/end/meeting/${BranchID}/${CenterID}`),
      );
      if (response.success) {
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
      console.log('response', response);
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
  async getPendingEnrollments({centerId, branchId}) {
    try {
      const response = await this.securedAxios.get(
        getApiUri(`/get/pending/enrollments/${centerId}/${branchId}`),
      );

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
      return response;
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
      return response;
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
  async fetchClientInformationByLoanId({loanId}) {
    try {
      const response = await this.securedAxios.get(
        getApiUri(`/client/details/${loanId}`),
      );
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

  async fetchDisburesemnt({branchId}) {
    try {
      const response = await this.securedAxios.get(
        getApiUri(`/fetch/disbursement/${branchId}`),
      );
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
  async updateDisburse({branchId, loanId}) {
    try {
      console.log(getApiUri(`/update/disburse/${branchId}/${loanId}`));
      const response = await this.securedAxios.put(
        getApiUri(`/update/disburse/${branchId}/${loanId}`),
      );
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

  async fetchCurrentDayCollectionByBranchId({branchId, date}) {
    try {
      const response = await this.securedAxios.get(
        getApiUri(`/fetch/current-day/collection/pending/${branchId}/${date}`),
      );
      console.log(response, 'response');
      if (response.data) {
        return response.data;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
  async fetchCurrentDayCollectionByCenterId({centerId, branchId}) {
    try {
      const response = await this.securedAxios.get(
        getApiUri(
          `/fetch/current-day/collection/pending-center/${centerId}/${branchId}`,
        ),
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
  async insertApplicant(data) {
    try {
      const response = await this.securedAxios.put(
        getApiUri(`/insert/appl`),
        data,
      );
      if (response.success) {
        return response.success;
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

  async insertCoApplicant(data) {
    try {
      const response = await this.securedAxios.put(
        getApiUri(`/insert/coappl`),
        data,
      );
      if (response.success) {
        return response.success;
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

  async insertLoanPurpose(data) {
    try {
      const response = await this.securedAxios.post(
        getApiUri(`/create/loan/purpose`),
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
  async createEnrollmentHis(data) {
    try {
      const response = await this.securedAxios.post(
        getApiUri(`/create/enroll/his`),
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
  async fetchLoanTypeAndPurpose() {
    try {
      const response = await this.securedAxios.get(
        getApiUri(`/fetch/loan/type`),
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
  async fetchLoanAmt({id}) {
    try {
      const response = await this.securedAxios.get(
        getApiUri(`/fetch/product/${id}`),
      );
      if (response?.data) {
        return response?.data;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
  async fetchLoanPurpose({id}) {
    try {
      const response = await this.securedAxios.get(
        getApiUri(`/fetch/loan/purpose/${id}`),
      );
      if (response?.data) {
        return response?.data;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
  async fetchProdFreqTen({amt, id}) {
    try {
      const response = await this.securedAxios.get(
        getApiUri(`/fetch/product/freq/tenure/${amt}/${id}`),
      );
      if (response?.data) {
        return response?.data;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
  async checkCenterName(data) {
    try {
      const response = await this.securedAxios.post(
        getApiUri(`/check/center/name`),
        data,
      );
      console.log(response);
      if (response?.data) {
        return response?.data;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
  async fetchAttendReport({month, year}) {
    try {
      const response = await this.securedAxios.get(
        getApiUri(`/attendance/report?month=${month}&year=${year}`),
      );
      // console.log(response);
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

  async fetchCCRRules(data) {
    try {
      const response = await this.securedAxios.get(
        getApiUri('/get/ccr/crieteria'),
      );
      if (response.data) {
        return response;
      }
      return false;
    } catch (err) {
      console.log(err);
      // console.error(err);
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
  async clockOut(data) {
    try {
      const response = await this.securedAxios.put(
        getApiUri(`/clock-out`),
        data,
      );
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
  // async clockOut({id}) {
  //   try {
  //     const response = await this.securedAxios.post(
  //       getApiUri(`/attendance/clock-out/${id}`),
  //     );
  //     // console.log('===-=-============', response);
  //     if (response.data) {
  //       return response;
  //     }
  //     return false;
  //   } catch (err) {
  //     console.log(err);
  //     console.error(err);
  //     return false;
  //   }
  // }

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

  async getCurrentDayAttendance(data) {
    try {
      const response = await this.securedAxios.post(
        getApiUri('/get/today/attendance'),
        data,
      );
      if (response?.success) {
        return response;
      }
      return false;
    } catch (err) {
      console.log(err);
      console.error(err);
      return false;
    }
  }
  async getAttendanceByMonthAndYear({month, year}) {
    try {
      const response = await this.securedAxios.get(
        getApiUri(`/get/attendance/${month}/${year}`),
      );
      if (response?.success) {
        return response;
      }
      return false;
    } catch (err) {
      console.log(err);
      console.error(err);
      return false;
    }
  }
  async clockIn(data) {
    try {
      const response = await this.securedAxios.post(
        getApiUri('/clock-in'),
        data,
      );
      if (response.success) {
        return response;
      }
      return false;
    } catch (err) {
      console.log(err);
      console.error(err);
      return false;
    }
  }
  async getLeaveTypes() {
    try {
      const response = await this.securedAxios.get(getApiUri('/leave/types'));
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
  async applyLeave(data) {
    try {
      const response = await this.securedAxios.post(
        getApiUri('/apply/leave'),
        data,
      );
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
  async fetchMyLeaves() {
    try {
      const response = await this.securedAxios.get(getApiUri('/my/leaves'));
      if (response.data && response.success) {
        return response.data;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async fetchMyAppliedLeaves() {
    try {
      const response = await this.securedAxios.get(
        getApiUri('/my/applied/leaves'),
      );
      if (response.data && response.success) {
        return response.data;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
  async fetchApprovalLeaves() {
    try {
      const response = await this.securedAxios.get(
        getApiUri('/get/approval/leaves'),
      );
      if (response.data && response.success) {
        return response.data;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
  async handleLeaveApproval(data) {
    try {
      const response = await this.securedAxios.put(
        getApiUri('/update/leave'),
        data,
      );
      if (response.data && response.success) {
        return response.data;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
  async createPaymentLink(data) {
    try {
      const response = await this.securedAxios.post(
        getApiUri('/generate/payment/link'),
        data,
      );
      if (response.data && response.success) {
        return response.data;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
  async sendCashRequestApproval(data) {
    try {
      const response = await this.securedAxios.post(
        getApiUri('/send/cash/request'),
        data,
      );
      if (response.data && response.success) {
        return response.data;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
  async createPaymentQR(data) {
    try {
      const response = await this.securedAxios.post(
        getApiUri('/generate/payment/qr'),
        data,
      );
      if (response.data && response.success) {
        return response.data;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
  async fetchPreClosAmt({customerid}) {
    try {
      const response = await this.securedAxios.get(
        getApiUri(`/fetch/foreclose/amount/${customerid}`),
      );
      console.log('response_____', response);
      if (response.data && response.success) {
        return response.data[0];
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
  async getCashApprovalRequests() {
    try {
      const response = await this.securedAxios.get(
        getApiUri(`/fetch/cash/request`),
      );
      if (response.data && response.success) {
        return response.data;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
  async updatePaymentStatus(data) {
    try {
      const response = await this.securedAxios.put(
        getApiUri(`/update/cash/request`),
        data,
      );
      if (response.data && response.success) {
        return response.data;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
  async updateBorrowerDocuments(data) {
    try {
      const response = await this.securedAxios.post(
        getApiUri('/update/borrower/documents'),
        data,
      );
      if (response.data && response.success) {
        return response;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
  async updateCoBorrowerDocuments(data) {
    try {
      const response = await this.securedAxios.post(
        getApiUri('/update/co-borrower/documents'),
        data,
      );
      if (response.data && response.success) {
        return response;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
  async saveBankDetails(data) {
    try {
      const response = await this.securedAxios.post(
        getApiUri('/save/bank/details'),
        data,
      );
      if (response.data && response.success) {
        return response;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}

export default AuthenticationApi;
