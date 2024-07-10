import { Router } from "express";
import { getUser } from "../controllers/userController";
import {
  getOrganizations,
  getOrganization,
  createOrganization,
  addUserToOrganization,
} from "../controllers/organisationController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.get("/users/:id", authenticateToken, getUser);
router.get("/organisations", authenticateToken, getOrganizations);
router.get("/organisations/:orgId", authenticateToken, getOrganization);
router.post("/organisations", authenticateToken, createOrganization);
router.post(
  "/organisations/:orgId/users",
  authenticateToken,
  addUserToOrganization
);

export default router;
