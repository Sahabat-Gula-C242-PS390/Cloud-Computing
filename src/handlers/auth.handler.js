import UserAuth from "../models/userAuth.model.js";
import User from "../models/user.model.js";
import Bun from "bun";

export async function signup(request, h) {
  try {
    const { email, name, password } = request.payload;

    const required = {
      email,
      name,
      password,
    };

    for (const [field, value] of Object.entries(required)) {
      if (!value) {
        return h
          .response({
            status: "failed",
            error: `${field} is required!`,
          })
          .code(400);
      }
      if (typeof value !== "string") {
        return h
          .response({
            status: "failed",
            error: `${field} must be a valid string!`,
          })
          .code(400);
      }
    }

    const user = await User.findOne({ field: "email", value: email });

    if (user) {
      return h
        .response({
          status: "failed",
          error: "Email already registered!",
        })
        .code(400);
    }

    const argonHash = await Bun.password.hash(password);

    const newUser = await new User({
      email,
      name,
      password: argonHash,
    });

    const newUserId = await newUser.save();

    return h
      .response({
        status: "success",
        userId: newUserId,
      })
      .code(201);
  } catch (error) {
    return h.response({ status: "failed", error: error.message }).code(400);
  }
}

export async function login(request, h) {
  try {
    const { email, password } = request.payload;

    const required = {
      email,
      password,
    };

    for (const [field, value] of Object.entries(required)) {
      if (!value) {
        return h
          .response({
            status: "failed",
            error: `${field} is required!`,
          })
          .code(400);
      }
      if (typeof value !== "string") {
        return h
          .response({
            status: "failed",
            error: `${field} must be a valid string!`,
          })
          .code(400);
      }
    }

    const user = await User.findOne({ field: "email", value: email });

    const isMatch = await Bun.password.verify(password, user.password);

    if (!user || !isMatch) {
      return h
        .response({
          status: "failed",
          error: "Invalid email or password!",
        })
        .code(401);
    }

    return h
      .response({
        status: "success",
        userId: user.userId,
      })
      .code(200);

     } catch (error) {
    return h.response({ status: "failed", error: error.message }).code(400);
  }
}

// export async function verify(request, h) {
//   try {
//     const { email, otpCode } = request.payload;
//
//     const required = {
//       email,
//       otpCode,
//     };
//
//     for (const [field, value] of Object.entries(required)) {
//       if (!value) {
//         throw new TypeError(`${field} is required!`);
//       }
//       if (typeof value !== "string") {
//         throw new TypeError(`${field} must be a valid string!`);
//       }
//     }
//
//     const userAuth = await UserAuth.findByEmail(email);
//
//     if (userAuth.otpCode === parseInt(otpCode)) {
//       return h.response({ status: "success" }).code(200);
//     } else {
//       return h
//         .response({ status: "failed", error: "Invalid OTP code!" })
//         .code(400);
//     }
//   } catch (error) {
//     return h.response({ status: "failed", error: error.message }).code(400);
//   }
// }
