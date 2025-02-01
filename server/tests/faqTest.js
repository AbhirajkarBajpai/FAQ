const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");

describe("FAQ API", () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should fetch FAQs", async () => {
    const res = await request(app).get("/api/faqs");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
