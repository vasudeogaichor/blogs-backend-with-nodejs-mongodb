const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
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
    if (this.forChildProcess) {
      await this.connectDatabase();
    } else {
      this.setupMiddlewares();
      await this.connectDatabase();
      this.setupRoutes();
      this.setupErrorHandling();
    }
    this.initializeMailer();

    if (!this.database || !this.mailer) {
      console.error('Error initializing database or mailer');
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
      this.database = await mongoose.connect("mongodb://localhost:27017/db_auth");
      console.log("Database connected Successfully");
    } catch (error) {
      console.error("Error connecting to the database:", error);
      // Handle error
      process.exit(1);
    }
  }
  
  initializeMailer() {
    // Initialize mailer for both server and child processes
    this.mailer = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "vasudeogaichor@gmail.com",
        pass: `${process.env.GMAIL_APP_PASSWORD}`,
      },
    });
  }

  setupRoutes() {
    this.app.use("/auth", authRouter);
    this.app.use(verifyToken);
    this.app.use("/posts", postRouter);
  }

  setupErrorHandling() {
    this.app.use((err, req, res, next) => {
      console.error(err.stack);
      const stackTrace = err.stack.split("\n");
      res.status(500).json({ Error: stackTrace });
    });
  }

  startServer() {
    this.app.listen(this.PORT, () => {
      console.log(`Server is running at http://localhost:${this.PORT}`);
    });
  }
}

module.exports = APIService;
