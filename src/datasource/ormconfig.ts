import { DataSource } from "typeorm";
import { User } from "../models/User";
import { Organisation } from "../models/Organization";
import { UserOrganization } from "../models/UserOrganization";
import dotenv from "dotenv";

dotenv.config();

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in the environment variables");
}

export const AppDataSource = new DataSource({
  type: "postgres",
  url: DATABASE_URL,
  entities: [User, Organisation, UserOrganization],
  synchronize: true,
  logging: false,
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
