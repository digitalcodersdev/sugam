const currentEnv = 'dev';
const envs = {
  dev: {
    // SERVER_URL: 'https://localhost:3001',
    // SERVER_URL: 'http://3.93.58.5:3000',
    SERVER_URL: 'https://hrm.wathelp.com/public',
  },
  prod: {
    SERVER_URL: '',
  },
};

export default envs[currentEnv];

