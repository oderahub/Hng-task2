// import { Request, Response } from "express";
// import { AppDataSource } from "../datasource/ormconfig";
// import { User } from "../models/User";
// import { Organisation } from "../models/Organization";
// import { UserOrganization } from "../models/UserOrganization";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { validate } from "class-validator";

// export const register = async (req: Request, res: Response) => {
//   const { firstName, lastName, email, password, phone } = req.body;

//   const userRepository = AppDataSource.getRepository(User);
//   const orgRepository = AppDataSource.getRepository(Organisation);
//   const userOrgRepository = AppDataSource.getRepository(UserOrganization);

//   // Ensure findOneBy is correctly implemented or replace with findOne
//   const existingUser = await userRepository.findOne({ where: { email } });
//   if (existingUser) {
//     return res
//       .status(422)
//       .json({ errors: [{ field: "email", message: "Email already exists" }] });
//   }

//   const user = new User();
//   user.firstName = firstName;
//   user.lastName = lastName;
//   user.email = email;
//   user.password = await bcrypt.hash(password, 10);
//   user.phone = phone;

//   const errors = await validate(user);
//   if (errors.length > 0) {
//     return res.status(422).json({
//       errors: errors.map((err) => ({
//         field: err.property,
//         message: Object.values(err.constraints!).join(", "),
//       })),
//     });
//   }

//   await userRepository.save(user);

//   const organization = new Organisation();
//   organization.name = `${firstName}'s Organization`;
//   organization.description = `${firstName}'s default organization`;

//   await orgRepository.save(organization);

//   const userOrg = new UserOrganization();
//   userOrg.user = user;
//   userOrg.organization = organization;

//   await userOrgRepository.save(userOrg);

//   const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET!, {
//     expiresIn: "1h",
//   });

//   res.status(201).json({
//     status: "success",
//     message: "Registration successful",
//     data: {
//       accessToken: token,
//       user: {
//         userId: user.userId,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         phone: user.phone,
//       },
//     },
//   });
// };

// export const login = async (req: Request, res: Response) => {
//   const { email, password } = req.body;

//   const userRepository = AppDataSource.getRepository(User);

//   const user = await userRepository.findOne({ where: { email } }); // Correct usage of findOne
//   if (!user) {
//     return res.status(401).json({
//       status: "Bad request",
//       message: "Authentication failed",
//       statusCode: 401,
//     });
//   }

//   const isPasswordValid = await bcrypt.compare(password, user.password);
//   if (!isPasswordValid) {
//     return res.status(401).json({
//       status: "Bad request",
//       message: "Authentication failed",
//       statusCode: 401,
//     });
//   }

//   const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET!, {
//     expiresIn: "1h",
//   });
//   console.log(token); // Consider removing console logs in production
//   res.status(200).json({
//     status: "success",
//     message: "Login successful",
//     data: {
//       accessToken: token,
//       user: {
//         userId: user.userId,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         phone: user.phone,
//       },
//     },
//   });
// };

import { Request, Response } from "express";
import { AppDataSource } from "../datasource/ormconfig";
import { User } from "../models/User";
import { Organisation } from "../models/Organization";
import { UserOrganization } from "../models/UserOrganization";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validate } from "class-validator";

export const register = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, phone } = req.body;

  const userRepository = AppDataSource.getRepository(User);
  const orgRepository = AppDataSource.getRepository(Organisation);
  const userOrgRepository = AppDataSource.getRepository(UserOrganization);

  const existingUser = await userRepository.findOne({ where: { email } });
  if (existingUser) {
    return res
      .status(422)
      .json({ errors: [{ field: "email", message: "Email already exists" }] });
  }

  const user = new User();
  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.password = await bcrypt.hash(password, 10);
  user.phone = phone;

  const errors = await validate(user);
  if (errors.length > 0) {
    return res.status(422).json({
      errors: errors.map((err) => ({
        field: err.property,
        message: Object.values(err.constraints!).join(", "),
      })),
    });
  }

  await userRepository.save(user);

  const organization = new Organisation();
  organization.name = `${firstName}'s Organization`;
  organization.description = `${firstName}'s default organization`;

  await orgRepository.save(organization);

  const userOrg = new UserOrganization();
  userOrg.user = user;
  userOrg.organization = organization;

  await userOrgRepository.save(userOrg);

  const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  res.status(201).json({
    status: "success",
    message: "Registration successful",
    data: {
      accessToken: token,
      user: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    },
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const userRepository = AppDataSource.getRepository(User);

  const user = await userRepository.findOne({ where: { email } });
  if (!user) {
    return res.status(401).json({
      status: "Bad request",
      message: "Authentication failed",
      statusCode: 401,
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({
      status: "Bad request",
      message: "Authentication failed",
      statusCode: 401,
    });
  }

  const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });
  console.log(token); // Consider removing console logs in production
  res.status(200).json({
    status: "success",
    message: "Login successful",
    data: {
      accessToken: token,
      user: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    },
  });
};
