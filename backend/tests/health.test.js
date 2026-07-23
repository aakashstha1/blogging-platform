import request from "supertest";
import app from "../app.js";

describe("GET /health", () => {
  it("responds with 200 and a success message", async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.text).toBe("Health check passed!");
  });
});
