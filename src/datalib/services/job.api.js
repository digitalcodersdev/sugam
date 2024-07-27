import {isNil} from 'lodash-es';
import getApiUri from '../api.util';
import SecuredBaseApi from '../securedBase.api';
/*
 * Here we handle all job related Api's
 * @author Kindajobs <mohitkumar.webdev@gmail.com>
 */
class JobApi extends SecuredBaseApi {
  /*
   * This function is used to post a new job
   * @author Kindajobs <mohitkumar.webdev@gmail.com>
   */
  async createJob(data) {
    try {
      const response = await this.securedAxios.post(
        getApiUri('/job/create'),
        data,
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
  /*
   * This function is used to update a job
   * @author Kindajobs <mohitkumar.webdev@gmail.com>
   */
  async updateJob(job, jobId) {
    try {
      console.log('Inside update api 2');
      const response = await this.securedAxios.put(
        getApiUri(`/job/update/${jobId}`),
        job,
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
  /*
   * This function is used to fetch all jobs posted by an user
   * @author Kindajobs <mohitkumar.webdev@gmail.com>
   */
  async getMyJobs(userId) {
    try {
      const response = await this.securedAxios.get(
        getApiUri(`/job/get/${userId}`),
      );
      // console.log(response);
      if (response.data) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  /*
   * This function is used to fetch curre job of an user
   * @author Kindajobs <mohitkumar.webdev@gmail.com>
   */
  async getCurrentJob() {
    try {
      const response = await this.securedAxios.get(
        getApiUri('/job/get-current-job'),
      );
      console.log(response);
      if (response.data) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  /*
   * This function is used to cancel a job
   * @author Kindajobs <mohitkumar.webdev@gmail.com>
   */
  async cancelJob(jobId) {
    try {
      const response = await this.securedAxios.put(
        getApiUri(`/job/cancel/${jobId}`),
      );
      console.log(response);
      if (response.data) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  /*
   * This function is used to cancel a job
   * @author Kindajobs <mohitkumar.webdev@gmail.com>
   */
  async completeJob(jobId) {
    try {
      const response = await this.securedAxios.put(
        getApiUri(`/job/cancel/${jobId}`),
      );
      console.log(response);
      if (response.data) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  /*
   * This function is used to delete a job
   * @author Kindajobs <mohitkumar.webdev@gmail.com>
   */
  async deleteJob(jobId) {
    try {
      const response = await this.securedAxios.delete(
        getApiUri(`/job/delete/${jobId}`),
      );
      console.log(response);
      if (response.data) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  /*
   * This function is used to fetch all common skills
   * @author Kindajobs <mohitkumar.webdev@gmail.com>
   */
  async getSkills() {
    try {
      const response = await this.securedAxios.get(
        getApiUri('/common/get-skill'),
      );
      if (response.data) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

export default JobApi;
