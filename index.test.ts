import server from "./src/index";
import request from "supertest";

const postUser = {
  username: "Bobur",
  age: 23,
  hobbies: [],
};
const app = server();

describe("await request to server", () => {
  const req: request.SuperTest<request.Test> = request("http://localhost:5000");

  beforeAll(() => {
    app.listen(5000)
  })

  it("should return 200 & and empty array", async () => {
    const res = await req.get(`/api/users`);
    expect(res.body).toMatchObject([]);
  });

  it("should return 200 & user body", async () => {
    const res = await req.post(`/api/users`).send(...[postUser]);

    expect(res.body).toMatchObject({ ...postUser, id: expect.any(String) });
  });

  it("should return 400 & validation parametres", async () => {
    const res = await req.post(`/api/users`).send({
      saSAs: "aSAsaSAsas",
    });

    expect(res.body).toMatchObject([
      "Username is required or must be string",
      "Age is required or must be number",
      "Hobbies is required",
    ]);
  });

  it("should return 200 & and array with user", async () => {
    const res = await req.get(`/api/users`);
    expect(res.body).toMatchObject([postUser]);
  });

  afterAll(() => {
    app.close();
  });
});
