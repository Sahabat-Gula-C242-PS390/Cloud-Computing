import User from "../models/user.model.js";

class login {
  /**
   * Handles user login.
   *
   * @param {Object} req - The HTTP request object.
   * @param {Object} res - The HTTP response object.
   * @returns {Promise<void>}
   */
  static async login(req, res) {
    const { email, password } = req.body;

    // Validate input
    if (!email || typeof email !== "string") {
      return res.status(400).json({
        status: "fail",
        message: "Email is required and must be a valid string.",
      });
    }
    if (!password || typeof password !== "string") {
      return res.status(400).json({
        status: "fail",
        message: "Password is required and must be a valid string.",
      });
    }

    try {
      // Check if user exists
      const user = await User.findOne({ field: "email", value: email });

      if (!user) {
        return res.status(401).json({
          status: "fail",
          message: "Invalid email or password.",
        });
      }

      // Validate password
      if (user.password !== password) {
        return res.status(401).json({
          status: "fail",
          message: "Invalid email or password.",
        });
      }

      // Return success response
      return res.status(200).json({
        status: "success",
        message: "Login successful.",
        data: {
          userId: user.userId,
          name: user.name,
          email: user.email,
          gender: user.gender,
        },
      });
    } catch (error) {
      console.error("Error during login:", error.message);

      return res.status(500).json({
        status: "error",
        message: "Internal server error.",
      });
    }
  }
}

export { login };
