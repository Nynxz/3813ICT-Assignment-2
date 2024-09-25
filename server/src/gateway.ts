import express from "express";
import { readdirSync } from "fs";
import cors from "cors";
import { Logger } from "./lib/logger";
import { config } from "dotenv";
import mongoose from "mongoose";
config(); //Load .env file

export class Gateway {
  app;
  router;
  static debug = false;
  constructor() {
    Logger.logOrangeUnderline("----Gateway----");
    this.app = express();
    this.router = express.Router();
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(cors());
    this.checkDebug();
  }

  checkDebug() {
    if (process.env["DEBUG"] == "true") {
      Gateway.debug = true;
      Logger.logDebugRed("DEBUG ENABLED");
    }
  }

  async connectToMongoDB() {
    try {
      Logger.logGreen("Connecting to MongoDB...");
      const uri = process.env["MONGODB_URI"] as string;
      await mongoose.connect(uri);
      Logger.logGreen("Connected");
    } catch (error) {
      Logger.logRed("MongoDB Connection Error");
    }
  }

  async loadRoutes() {
    Logger.logOrange("Loading Routes:");
    await this._loadRoutesFolder();
    this.app.use('/api/v1', this.router);
  }

  async start() {
    await this.loadRoutes();
    this.app.listen(process.env["PORT"], () => {
      Logger.logOrange(`Listening on port ${process.env["PORT"]}`);
    });
  }

  // Load /src/routes/*.ts files
  private async _loadRoutesFolder() {
    const routesDir = "./src/routes";
    const routeFiles = readdirSync(routesDir).filter((file) =>
      file.endsWith(".ts")
    );
    for (const file of routeFiles) {
      Logger.logGreenUnderline(`----${file}----`);
      const registerRoutes = await import("./routes/" + file);
      const registerFunc = registerRoutes.default;
      if (typeof registerFunc === "function") {
        registerFunc(this.router, this);
      }
    }
  }
}
