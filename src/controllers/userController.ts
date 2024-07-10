import { Request, Response } from "express";
import { AppDataSource } from "../datasource/ormconfig";
import { User } from "../models/User";

export const getUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneBy({ userId });

  if (!user) {
    return res
      .status(404)
      .json({ status: "Not found", message: "User not found" });
  }

  res.status(200).json({
    status: "success",
    message: "User retrieved successfully",
    data: {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    },
  });
};
