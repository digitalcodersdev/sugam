const currentEnv = 'dev';
const envs = {
  dev: {
    // SERVER_URL: 'http://192.168.2.85:3000',//Rakesh Sir cabin
    SERVER_URL: 'http://192.168.1.123:3000', //Seat
    // SERVER_URL: 'http://192.168.227.226:3000', //Personal
    GOOGLE_MAP_API_KEY: 'AIzaSyBsc_32ip44ZxiwytqSxKdczopDmUAFpow',
  },
  prod: {
    SERVER_URL: '',
  },
};

export default envs[currentEnv];
