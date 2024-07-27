import {isNil} from 'lodash-es';
import sInfoUtil from '../../utils/sInfo.util';
import getApiUri from '../api.util';
import BaseApi from '../base.api';

/*
 * This code is used to write User Api's
 * @author Kindajobs <mohitkumar.webdev@gmail.com>
 */
class AuthenticationApi extends BaseApi {
  /*
   * This function is used to register a new user and generate mobile otp
   * @author Kindajobs <mohitkumar.webdev@gmail.com>
   */
  async register(data) {
    try {
      const response = await this.axios.post(getApiUri('/auth/register'), data);
      if (!isNil(response.data)) {
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }

  async login(data){
    try {
      // console.log("response",getApiUri(`/auth/login`));
      const response = await this.axios.post(getApiUri(`/auth/login`),data)
      // console.log("response",response,getApiUri(`/auth/login`));
      if (response.data) {
        await sInfoUtil.save('JWT', response.data.token);
        await sInfoUtil.save(
          'USER_CONTEXT',
          JSON.stringify(response.data.user),
        );
        return response.data.user;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false
    }
  }

  // TODO: Currently refreshToken has same logic as authentication..replace later with refresh token redis/rdbms solution
  // This would lower firebase calls for refeshToken
  /*
   * This function is used to verify mobile otp
   * @author Kindajobs <mohitkumar.webdev@gmail.com>
   */
  async verifyMobileOtp(phone, otp) {
    try {
      const response = await this.axios.post(getApiUri('/auth/verify-mobile'), {
        phone,
        otp,
      });
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
  /*
   * This function is used to refresh jwt token for the user
   * @author Kindajobs <mohitkumar.webdev@gmail.com>
   */
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
