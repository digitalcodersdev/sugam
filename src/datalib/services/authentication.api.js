import sInfoUtil from '../../utils/sInfo.util';
import getApiUri from '../api.util';
import BaseApi from '../base.api';


class AuthenticationApi extends BaseApi {

  async generateOtp(data) {
    try {
      const response = await this.axios.post(getApiUri(`/send-otp`), data);
      if (response.data?.transactionId) {
        return response
      }
      return response;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async verifyMobileOtp(data) {
    try {
      const response = await this.axios.post(getApiUri('/verify-otp'), data);
      console.log(response?.data);
      if (response.data && response.success) {
        await sInfoUtil.save('JWT', response?.data?.token);
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }
  

  async refreshToken() {
    try {
      const response = await this.axios.post(
        getApiUri('/auth/refresh-token'),
        {},
      );
      if (response.data) {
        await sInfoUtil.save('JWT', response.data.authToken);
        await sInfoUtil.save(
          'USER_CONTEXT',
          JSON.stringify(response.data.user),
        );
        return response.data.user;
      }
      return false;
    } catch (err) {
      return false;
    }
  }
}

export default AuthenticationApi;
