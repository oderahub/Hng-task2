// import { Response } from "express";
// import { Organisation } from "../models/Organization";
// import { getRepository } from "typeorm";
// import { CustomRequest } from "../types/customRequest";
// import { validate } from "class-validator";

// export const createOrganisation = async (
//   req: CustomRequest,
//   res: Response
// ): Promise<void> => {
//   const { name, description } = req.body;
//   const organisationRepository = getRepository(Organisation);

//   try {
//     const organisation = new Organisation();
//     organisation.name = name;
//     organisation.description = description;
//     organisation.user = req.user!; // Non-null assertion since the user is guaranteed by middleware

//     const errors = await validate(organisation);
//     if (errors.length > 0) {
//       res.status(422).json({
//         status: "Unprocessable Entity",
//         message: "Validation failed",
//         errors: errors.map((error) => ({
//           field: error.property,
//           message: Object.values(error.constraints!).join(", "),
//         })),
//       });
//       return;
//     }

//     await organisationRepository.save(organisation);
//     res.status(201).json({
//       status: "success",
//       message: "Organisation created successfully",
//       data: {
//         orgId: organisation.orgId,
//         name: organisation.name,
//         description: organisation.description,
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(400).json({
//       status: "Bad Request",
//       message: "Client error",
//       statusCode: 400,
//     });
//   }
// };

// export const getOrganisations = async (
//   req: CustomRequest,
//   res: Response
// ): Promise<void> => {
//   const organisationRepository = getRepository(Organisation);

//   try {
//     const organisations = await organisationRepository.find({
//       where: { user: req.user },
//     });
//     res.status(200).json({
//       status: "success",
//       message: "Organisations retrieved successfully",
//       data: {
//         organisations,
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(400).json({
//       status: "Bad Request",
//       message: "Client error",
//       statusCode: 400,
//     });
//   }
// };

// src/controllers/orgController.ts
import { Request, Response } from "express";
import { AppDataSource } from "../datasource/ormconfig";
import { Organisation } from "../models/Organization";
import { UserOrganization } from "../models/UserOrganization";
import { validate } from "class-validator";
import { CustomRequest } from "../types/customRequest";

export const getOrganizations = async (req: CustomRequest, res: Response) => {
  const userId = req.user!.userId;
  const userOrgRepository = AppDataSource.getRepository(UserOrganization);

  const userOrgs = await userOrgRepository.find({
    where: { user: { userId } },
    relations: ["organization"],
  });

  const organizations = userOrgs.map((userOrg) => userOrg.organization);

  res.status(200).json({
    status: "success",
    message: "Organizations retrieved successfully",
    data: { organizations },
  });
};

export const getOrganization = async (req: CustomRequest, res: Response) => {
  const orgId = req.params.orgId;
  const orgRepository = AppDataSource.getRepository(Organisation);
  const organization = await orgRepository.findOneBy({ orgId });

  if (!organization) {
    return res
      .status(404)
      .json({ status: "Not found", message: "Organization not found" });
  }

  res.status(200).json({
    status: "success",
    message: "Organization retrieved successfully",
    data: {
      orgId: organization.orgId,
      name: organization.name,
      description: organization.description,
    },
  });
};

export const createOrganization = async (req: CustomRequest, res: Response) => {
  const { name, description } = req.body;
  const userId = req.user!.userId;
  const orgRepository = AppDataSource.getRepository(Organisation);
  const userOrgRepository = AppDataSource.getRepository(UserOrganization);

  const organization = new Organisation();
  organization.name = name;
  organization.description = description;

  const errors = await validate(organization);
  if (errors.length > 0) {
    return res.status(422).json({
      errors: errors.map((err) => ({
        field: err.property,
        message: Object.values(err.constraints!).join(", "),
      })),
    });
  }

  await orgRepository.save(organization);

  const userOrg = new UserOrganization();
  userOrg.user = { userId } as any;
  userOrg.organization = organization;

  await userOrgRepository.save(userOrg);

  res.status(201).json({
    status: "success",
    message: "Organization created successfully",
    data: {
      orgId: organization.orgId,
      name: organization.name,
      description: organization.description,
    },
  });
};

export const addUserToOrganization = async (
  req: CustomRequest,
  res: Response
) => {
  const orgId = req.params.orgId;
  const { userId } = req.body;
  const userOrgRepository = AppDataSource.getRepository(UserOrganization);

  const userOrg = new UserOrganization();
  userOrg.user = { userId } as any;
  userOrg.organization = { orgId } as any;

  await userOrgRepository.save(userOrg);

  res.status(200).json({
    status: "success",
    message: "User added to organization successfully",
  });
};
