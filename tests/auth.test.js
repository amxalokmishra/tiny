const request = require("supertest");
const app = require("../app");
const User = require("../models/userModel");

describe("Authentication API", () => {
  beforeAll(async () => {
    await User.remove({});
  });

  it("should create a new user", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({ username: "testuser", password: "testpassword" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("User created successfully");
  });

  it("shouldnot create a new user with same username", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({ username: "testuser", password: "testpassword" });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("User already exists");
  });

  it("should authenticate the user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "testuser", password: "testpassword" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual(true);
  });

  it("should not authenticate the user with wrong passworf", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "testuser", password: "wrongpassword" });
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual("Authentication failed, Wrong password");
  });
});
