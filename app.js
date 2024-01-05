// app.js
const APIService = require('./services/APIService');

const apiService = new APIService();
apiService.initialize().then(() => {
  apiService.startServer();
});

module.exports = apiService.app;
