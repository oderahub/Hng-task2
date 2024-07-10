import request from "supertest";
import app from "../src/app";
import { AppDataSource } from "../src/datasource/ormconfig";

let token: string;

const getToken = async () => {
  const response = await request(app).post("/auth/login").send({
    email: "john.doe@example.com",
    password: "password123",
  });
  return response.body.data.accessToken;
};

const getFirstOrganisationId = async () => {
  const response = await request(app)
    .get("/api/organisations")
    .set("Authorization", `Bearer ${token}`);
  return response.body.data.organisations[0].orgId;
};

beforeAll(async () => {
  await AppDataSource.initialize();
  token = await getToken();
});

afterAll(async () => {
  await AppDataSource.destroy();
});

describe("Organisation Endpoints", () => {
  it("should get all organisations for the logged-in user", async () => {
    try {
      const response = await request(app)
        .get("/api/organisations")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data.organisations).toBeInstanceOf(Array);
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  it("should create a new organisation", async () => {
    try {
      const response = await request(app)
        .post("/api/organisations")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Test Organisation",
          description: "This is a test organisation",
        });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe("success");
      expect(response.body.data.name).toBe("Test Organisation");
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  it("should get a single organisation record", async () => {
    try {
      const orgId = await getFirstOrganisationId();

      const response = await request(app)
        .get(`/api/organisations/${orgId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data.orgId).toBe(orgId);
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  it("should add a user to an organisation", async () => {
    try {
      const orgId = await getFirstOrganisationId();

      const response = await request(app)
        .post(`/api/organisations/${orgId}/users`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          userId: "some-user-id",
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
});
