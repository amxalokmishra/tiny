const request = require("supertest");
const app = require("../app");
const Note = require("../models/noteModel");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "alokmishra";

let token;
let userId;
let noteId;

beforeAll(async () => {
  await User.remove({});
  await Note.remove({});

  const user = new User({
    username: "test",
    password: "test",
  });

  await user.save();

  userId = user._id;

  (token = jwt.sign({ id: userId, username: "test" }, JWT_SECRET)),
    { expiresIn: "1h" };
});

describe("Notes API", () => {
  it("should create a note", async () => {
    const res = await request(app)
      .post("/api/notes/create")
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "New note content" });

    expect(res.statusCode).toEqual(200);
    expect(res.body.content).toEqual("New note content");
    noteId=res.body._id;
  });

  it("should read all notes", async () => {
    const res = await request(app)
      .get("/api/notes/read")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
  });

  it("should update a note", async () => {
    const res = await request(app)
      .post(`/api/notes/update/${testNote._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "Updated note content" });

    expect(res.statusCode).toEqual(200);
    expect(res.body.content).toEqual("Updated note content");
  });

  it("should update a note", async () => {
    const res = await request(app)
      .post(`/api/notes/update/nonExistentId`)
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "Updated note content" });

    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual("Note not found");
  });

  it("should update a note", async () => {
    const res = await request(app)
      .post(`/api/notes/delete/${testNote._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Note deleted successfully");
  });

  it("should update a note", async () => {
    const res = await request(app)
      .post(`/api/notes/delete/nonExistentId`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual("Note not found");
  });
});
