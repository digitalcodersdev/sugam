const currentEnv = 'dev';
const envs = {
  dev: {
    // SERVER_URL: 'https://localhost:3001',
    SERVER_URL: 'http://192.168.1.123:3000',
    // SERVER_URL: 'https://hrm.wathelp.com/public',

  },
  prod: {
    SERVER_URL: '',
  },
};

export default envs[currentEnv];

265805176