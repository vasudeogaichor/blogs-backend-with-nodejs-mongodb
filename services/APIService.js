const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const { initializeMailer } = require("./mailer");
const backgroundWorker = require('./worker')
require("dotenv").config();
require("express-async-errors");

const { postRouter, authRouter } = require("../routes");
const { verifyToken } = require("../middleware/authMiddleware");

class APIService {
  constructor(forChildProcess = false) {
    this.forChildProcess = forChildProcess;
    this.app = express();
    this.PORT = process.env.PORT || 3002;
    this.mailer = null;
  }

  async initialize() {
    try {
      if (this.forChildProcess) {
        await this.connectDatabase();
      } else {
        this.setupMiddlewares();
        await this.connectDatabase();
        this.setupRoutes();
        this.setupErrorHandling();
        this.initializeWorker();
      }
      this.initializeMailer();

      if (!this.database || !this.mailer) {
        console.error("Error initializing database or mailer");
        process.exit(1);
      }
    } catch (err) {
      console.error("Error during initialization:", err);
      process.exit(1);
    }
  }

  setupMiddlewares() {
    if (!this.forChildProcess) {
      this.app.use(cors());
      this.app.use(bodyParser.json());
    }
  }

  async connectDatabase() {
    try {
      this.database = await mongoose.connect(
        "mongodb://localhost:27017/db_auth"
      );
      console.log("Database connected Successfully");
    } catch (error) {
      console.error("Error connecting to the database:", error);
      // Handle error
      process.exit(1);
    }
  }

  initializeMailer() {
    // Initialize mailer for both server and child processes
    this.mailer = initializeMailer();
    console.log("Mailer initialized successfully");
  }

  setupRoutes() {
    try {
      this.logRouteSetup("/auth");
      this.app.use("/auth", authRouter);
      this.app.use(verifyToken);
      this.logRouteSetup("/posts");
      this.app.use("/posts", postRouter);
    } catch (err) {
      console.error("Error in routes setup:", err);
      process.exit(1);
    }
  }

  logRouteSetup(route) {
    console.log(`Setup route: ${route}`);
  }

  setupErrorHandling() {
    this.app.use((err, req, res, next) => {
      console.error(err.stack);
      const stackTrace = err.stack.split("\n");
      res.status(500).json({ Error: stackTrace });
    });
  }

  initializeWorker() {
    this.worker = backgroundWorker;
    console.log('Bull worker initialized successfully')
  }

  startServer() {
    this.app.listen(this.PORT, () => {
      console.log(`Server is running at http://localhost:${this.PORT}`);
    });
  }
}

module.exports = APIService;
