import {Platform} from 'react-native';
import getApiUri from '../api.util';
import sInfoUtil from '../../utils/sInfo.util';

/*
 * This function is used to upload a image
 * @author Sugam <mohitkumar.webdev@gmail.com>
 */
export const uploadFile = data =>
  new Promise(async function (resolve, reject) {
    const jwt = await sInfoUtil.fetch('JWT');
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${jwt}`);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: data,
      redirect: 'follow',
    };

    fetch(getApiUri('/upload/documents'), requestOptions)
      .then(response => response.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
export const uploadFileCoBorrower = data =>
  new Promise(async function (resolve, reject) {
    const jwt = await sInfoUtil.fetch('JWT');
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${jwt}`);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: data,
      redirect: 'follow',
    };

    fetch(getApiUri('/upload/documents/co-borrower'), requestOptions)
      .then(response => response.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });

export const uploadBankFile = data =>
  new Promise(async function (resolve, reject) {
    const jwt = await sInfoUtil.fetch('JWT');
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${jwt}`);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: data,
      redirect: 'follow',
    };

    fetch(getApiUri('/upload/bank/details'), requestOptions)
      .then(response => response.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });

export const uploadClientPhoto = data =>
  new Promise(async function (resolve, reject) {
    const jwt = await sInfoUtil.fetch('JWT');
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${jwt}`);
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: data,
      redirect: 'follow',
    };
    fetch(getApiUri('/upload/client/photo'), requestOptions)
      .then(response => response.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
export const uploadCGTPhoto = data =>
  new Promise(async function (resolve, reject) {
    const jwt = await sInfoUtil.fetch('JWT');
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${jwt}`);
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: data,
      redirect: 'follow',
    };
    fetch(getApiUri('/upload/cgt/photo'), requestOptions)
      .then(response => response.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
export const uploadGRTPhoto = data =>
  new Promise(async function (resolve, reject) {
    const jwt = await sInfoUtil.fetch('JWT');
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${jwt}`);
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: data,
      redirect: 'follow',
    };
    fetch(getApiUri('/upload/grt/photo'), requestOptions)
      .then(response => response.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
