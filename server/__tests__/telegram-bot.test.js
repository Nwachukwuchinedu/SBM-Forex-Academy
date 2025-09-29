// Telegram Bot Implementation Test

import { connectionTokens } from "../controllers/telegram.controller.js";
import { validateAndConnectTelegramAccount } from "../utils/telegramTokenValidator.js";
import User from "../models/User.js";

// Mock User model
jest.mock("../models/User.js");

describe("Telegram Bot Implementation", () => {
  beforeEach(() => {
    // Clear all connection tokens before each test
    connectionTokens.clear();
  });

  describe("Connection Token Generation", () => {
    test("should generate a unique connection token", async () => {
      // Mock user
      const mockUser = {
        _id: "user123",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      };

      // Mock request object
      const req = {
        user: mockUser,
      };

      // Mock response object
      const res = {
        json: jest.fn(),
      };

      // Import the controller function
      const { generateConnectionToken } = await import(
        "../controllers/telegram.controller.js"
      );

      // Call the function
      await generateConnectionToken(req, res);

      // Check that a token was generated
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            connectionToken: expect.any(String),
            expiresAt: expect.any(Number),
          }),
        })
      );

      // Check that the token was stored
      const tokens = Array.from(connectionTokens.values());
      expect(tokens).toHaveLength(1);
      expect(tokens[0]).toEqual({
        userId: "user123",
        expiresAt: expect.any(Number),
      });
    });
  });

  describe("Token Validation and Account Connection", () => {
    test("should validate a token and connect a Telegram account", async () => {
      // Mock user
      const mockUser = {
        _id: "user123",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        telegramId: null,
        save: jest.fn().mockResolvedValue(),
      };

      // Mock User.findById
      User.findById.mockResolvedValue(mockUser);

      // Generate a token
      const connectionToken = "test-token-123";
      const expiresAt = Date.now() + 10 * 60 * 1000;
      connectionTokens.set(connectionToken, {
        userId: "user123",
        expiresAt,
      });

      // Validate the token and connect the account
      const result = await validateAndConnectTelegramAccount(
        "telegram456",
        connectionToken
      );

      // Check the result
      expect(result).toEqual({
        success: true,
        message: "Successfully connected your Telegram account",
        data: {
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          paymentStatus: undefined,
        },
      });

      // Check that the user was updated
      expect(mockUser.telegramId).toBe("telegram456");
      expect(mockUser.save).toHaveBeenCalled();

      // Check that the token was removed
      expect(connectionTokens.has(connectionToken)).toBe(false);
    });

    test("should reject an invalid token", async () => {
      const result = await validateAndConnectTelegramAccount(
        "telegram456",
        "invalid-token"
      );

      expect(result).toEqual({
        success: false,
        message: "Invalid or expired connection token",
      });
    });

    test("should reject an expired token", async () => {
      // Generate an expired token
      const connectionToken = "expired-token-123";
      const expiresAt = Date.now() - 1000; // Expired 1 second ago
      connectionTokens.set(connectionToken, {
        userId: "user123",
        expiresAt,
      });

      const result = await validateAndConnectTelegramAccount(
        "telegram456",
        connectionToken
      );

      expect(result).toEqual({
        success: false,
        message: "Connection token has expired",
      });

      // Check that the token was removed
      expect(connectionTokens.has(connectionToken)).toBe(false);
    });
  });
});
