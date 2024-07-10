import "reflect-metadata";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";
import organisationRoutes from "./routes/organisationRoutes";

const app = express();
dotenv.config();

// Set up middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Set up routes
app.use("/auth", authRoutes);
app.use("/api", organisationRoutes);

// Start the Express server only if not in test environment
// if (process.env.NODE_ENV !== "test") {
//   const PORT = process.env.PORT || 3000;
//   app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
//   });
// }

export default app;
