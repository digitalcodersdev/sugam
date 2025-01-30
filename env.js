const currentEnv = 'dev';
const envs = {
  dev: {
    // SERVER_URL: 'http://192.168.2.85:3000',//Rakesh Sir cabin
    // SERVER_URL: 'http://192.168.1.58:3000', //Seat192.168.1.123
    // SERVER_URL: 'http://192.0.0.2:3000', //Personal
    SERVER_URL: 'http://103.251.94.99:3000', //99 Production Server
    GOOGLE_MAP_API_KEY: 'AIzaSyBsc_32ip44ZxiwytqSxKdczopDmUAFpow',
  },
  prod: {
    SERVER_URL: 'http://103.104.73.167:3000',
    GOOGLE_MAP_API_KEY: 'AIzaSyBsc_32ip44ZxiwytqSxKdczopDmUAFpow',
  },
};
export default envs[currentEnv];
