import { expect, describe, it, afterAll } from "bun:test";
import { signup, verify } from "../src/handlers/auth.handler.js";
import UserAuth from "../src/models/userAuth.model.js";
// import User from "../src/models/user.model.js";

const mockRequest = (payload) => {
  return { payload };
};
const mockH = {
  response: (data) => {
    return {
      code: (statusCode) => {
        return { ...data, statusCode };
      },
    };
  },
};

describe("Auth Handler", () => {
  describe("signup", () => {
    it("should create new user authentication", async () => {
      const request = mockRequest({
        email: "test@example.com",
        name: "Test User",
        password: "password123",
      });

      const response = await signup(request, mockH);

      expect(response.status).toBe("success");
      expect(response.data.email).toBe("test@example.com");
      expect(response.statusCode).toBe(201);
    });

    it("should return error if required field is missing", async () => {
      const request = mockRequest({
        email: "test@example.com",
        password: "password123",
      });

      const response = await signup(request, mockH);

      expect(response.status).toBe("failed");
      expect(response.error).toBe("name is required!");
      expect(response.statusCode).toBe(400);
    });

    it("should return error if field type is invalid", async () => {
      const request = mockRequest({
        email: "test@example.com",
        name: "Test User",
        password: 123,
      });

      const response = await signup(request, mockH);

      expect(response.status).toBe("failed");
      expect(response.error).toBe("password must be a valid string!");
      expect(response.statusCode).toBe(400);
    });
  });

  describe("verify", () => {
    it("should verify OTP code successfully", async () => {
      const userAuthDoc = await UserAuth.findByEmail("test@example.com");
      const request = mockRequest({
        email: "test@example.com",
        otpCode: `${userAuthDoc.otpCode}`,
      });

      const response = await verify(request, mockH);

      expect(response.status).toBe("success");
      expect(response.statusCode).toBe(200);
    });

    it("should return error if OTP code is invalid", async () => {
      const request = mockRequest({
        email: "test@example.com",
        otpCode: "000000",
      });

      const response = await verify(request, mockH);

      expect(response.status).toBe("failed");
      expect(response.error).toBe("Invalid OTP code!");
      expect(response.statusCode).toBe(400);
    });

    it("should return error if required field is missing", async () => {
      const request = mockRequest({
        email: "test@example.com",
        otpCode: "",
      });

      const response = await verify(request, mockH);

      expect(response.status).toBe("failed");
      expect(response.error).toBe("otpCode is required!");
      expect(response.statusCode).toBe(400);
    });
  });

  afterAll(async () => {
    // await User.deleteAll();
    await UserAuth.deleteAll();
  });
});
