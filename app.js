// app.js
const AppServices = require('./services/APIService');

const appServices = new AppServices();
appServices.initialize().then(() => {
  appServices.startServer();
});

module.exports = appServices.app;
