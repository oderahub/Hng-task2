import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../src/app";
import { AppDataSource } from "../src/datasource/ormconfig";
import { User } from "../src/models/User";
import { Organisation } from "../src/models/Organization";
import { v4 as uuidv4 } from "uuid";

beforeAll(async () => {
  await AppDataSource.initialize();
});

afterAll(async () => {
  await AppDataSource.destroy();
});

describe("Auth Endpoints", () => {
  let token: string;

  it("should register user successfully with default organisation", async () => {
    const response = await request(app).post("/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
      phone: "1234567890",
    });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body.data.user.firstName).toBe("John");
    expect(response.body.data.user.email).toBe("john.doe@example.com");
    expect(response.body.data.user.phone).toBe("1234567890");

    // Verify organisation name
    const orgRepository = AppDataSource.getRepository(Organisation);
    const org = await orgRepository.findOne({
      where: { name: "John's Organization" },
    });
    expect(org).not.toBeNull();
  });

  it("should log the user in successfully", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "john.doe@example.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.data.user.email).toBe("john.doe@example.com");

    // Save the token for subsequent tests
    token = response.body.data.accessToken;
  });

  it("should fail if required fields are missing", async () => {
    const response = await request(app).post("/auth/register").send({
      firstName: "John",
      phone: "1234567890",
    });

    expect(response.status).toBe(422);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "lastName",
          message: expect.any(String),
        }),
        expect.objectContaining({
          field: "email",
          message: expect.any(String),
        }),
        expect.objectContaining({
          field: "password",
          message: expect.any(String),
        }),
      ])
    );
  });

  it("should fail if there is a duplicate email or userId", async () => {
    const response = await request(app).post("/auth/register").send({
      firstName: "Jane",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
      phone: "0987654321",
    });

    expect(response.status).toBe(422);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: "email",
          message: "Email already exists",
        }),
      ])
    );
  });

  it("should ensure token expires at the correct time and contains correct user details", async () => {
    const decoded: any = jwt.decode(token);
    expect(decoded.userId).toBeDefined();
    expect(decoded.exp).toBeGreaterThan(Date.now() / 1000);

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { userId: decoded.userId },
    });
    expect(user).not.toBeNull();
    expect(user?.email).toBe("john.doe@example.com");
  });

  it("should ensure users can’t see data from organisations they don’t have access to", async () => {
    const response = await request(app)
      .get("/api/organisations")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.organisations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "John's Organization",
        }),
      ])
    );

    // Create a new user and organisation
    const newUserResponse = await request(app).post("/auth/register").send({
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      password: "password123",
      phone: "1112223333",
    });

    const newToken = newUserResponse.body.data.accessToken;

    // Verify new user cannot see the first user's organisation
    const newOrgResponse = await request(app)
      .get("/api/organisations")
      .set("Authorization", `Bearer ${newToken}`);

    expect(newOrgResponse.status).toBe(200);
    expect(newOrgResponse.body.data.organisations).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "John's Organization",
        }),
      ])
    );
  });
});
// import request from "supertest";
// import app from "../src/app";
// import { AppDataSource } from "../src/datasource/ormconfig";
// import { v4 as uuidv4 } from "uuid";

// beforeAll(async () => {
//   await AppDataSource.initialize();
// });

// afterAll(async () => {
//   await AppDataSource.destroy();
// });

// describe("Auth Endpoints", async () => {
//   it("should register user successfully with default organisation", async () => {
//     const uniqueEmail = `john.doe+${uuidv4()}@example.com`;
//     const response = await request(app).post("/auth/register").send({
//       firstName: "John",
//       lastName: "Doe",
//       email: uniqueEmail,
//       password: "password",
//       phone: "1234567890",
//     });

//     console.log("Register Response:", response.body);

//     expect(response.status).toBe(201);
//     expect(response.body.status).toBe("success");
//     expect(response.body.data.user.firstName).toBe("John");
//     expect(response.body.data.user.email).toBe(uniqueEmail);
//   });

//   it("should fail if required fields are missing", async () => {
//     const response = await request(app).post("/auth/register").send({});

//     expect(response.status).toBe(422);
//     expect(response.body.errors).toEqual(
//       expect.arrayContaining([
//         expect.objectContaining({
//           field: "firstName",
//         }),
//         expect.objectContaining({
//           field: "lastName",
//         }),
//         expect.objectContaining({
//           field: "email",
//         }),
//         expect.objectContaining({
//           field: "password",
//         }),
//       ])
//     );
//   });

//   it("should ensure users can’t see data from organisations they don’t have access to", async () => {
//     const loginResponse = await request(app)
//       .post("/auth/login")
//       .send({ email: "john.doe@example.com", password: "password" });

//     const token = loginResponse.body.data.accessToken;

//     const response = await request(app)
//       .get("/api/organisations")
//       .set("Authorization", `Bearer ${token}`);

//     console.log("Get Organisations Response:", response.body);

//     expect(response.status).toBe(200);
//     expect(response.body.data.organisations).toEqual(
//       expect.arrayContaining([
//         expect.objectContaining({
//           name: "John's Organization",
//         }),
//       ])
//     );
//   });

//   // Additional tests...

//   // Create a new user and organisation
//   const newUserResponse = await request(app).post("/auth/register").send({
//     firstName: "Jane",
//     lastName: "Smith",
//     email: "jane.smith@example.com",
//     password: "password123",
//     phone: "1112223333",
//   });

//   console.log("New User Register Response:", newUserResponse.body);

//   const newToken = newUserResponse.body.data.accessToken;
//   expect(newToken).toBeDefined();

//   // Verify new user cannot see the first user's organisation
//   const newOrgResponse = await request(app)
//     .get("/api/organisations")
//     .set("Authorization", `Bearer ${newToken}`);

//   console.log("New User Get Organisations Response:", newOrgResponse.body);

//   expect(newOrgResponse.status).toBe(200);
//   expect(newOrgResponse.body.data.organisations).not.toEqual(
//     expect.arrayContaining([
//       expect.objectContaining({
//         name: "John's Organization",
//       }),
//     ])
//   );
// });
