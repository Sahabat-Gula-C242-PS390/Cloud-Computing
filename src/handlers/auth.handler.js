import User from "../models/user.model.js";
import Bun from "bun";
import { checkField } from "../utils/checkField.js";

export async function signup(request, h) {
  try {
    const {
      email,
      name,
      password,
      gender,
      age,
      weight,
      height,
      waistSize,
      tekananDarahTinggi,
      gulaDarahTinggi,
      riwayatDiabetes,
      tingkatAktivitas,
      konsumsiBuah,
    } = request.payload;

    const required = {
      email,
      name,
      password,
      gender,
      age,
      weight,
      height,
      waistSize,
      tekananDarahTinggi,
      gulaDarahTinggi,
      riwayatDiabetes,
      tingkatAktivitas,
      konsumsiBuah,
    };

    checkField(required);
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

    return h.response({ status: "success" }).code(200);
  } catch (error) {
    return h.response({ status: "failed", error: error.message }).code(400);
  }
}

export async function checkEmail(request, h) {
  try {
    const { email } = request.query;

    const required = {
      email,
    };

    checkField(required);

    const user = await User.findOne({ field: "email", value: email });

    if (user) {
      return h
        .response({
          status: "failed",
          error: "Email already registered!",
        })
        .code(400);
    }

    return h
      .response({
        status: "success",
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

export async function changePassword(request, h) {
  try {
    const { userId, password, newPassword } = request.payload;

    // Validasi input wajib
    const requiredFields = { userId, password, newPassword };
    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value || typeof value !== "string") {
        return h
          .response({
            status: "failed",
            error: `${field} is required and must be a valid string!`,
          })
          .code(400);
      }
    }

    // Validasi panjang password baru
    if (newPassword.length < 8) {
      return h
        .response({
          status: "failed",
          error: "New password must be at least 8 characters long!",
        })
        .code(400);
    }

    // Cari user berdasarkan userId
    const user = await User.findById(userId);
    if (!user) {
      return h
        .response({
          status: "failed",
          error: "User not found!",
        })
        .code(404);
    }

    // Verifikasi password lama
    const isPasswordMatch = await Bun.password.verify(password, user.password);
    if (!isPasswordMatch) {
      return h
        .response({
          status: "failed",
          error: "Old password is incorrect!",
        })
        .code(401);
    }

    // Cek apakah password baru sama dengan password lama
    const isSamePassword = await Bun.password.verify(newPassword, user.password);
    if (isSamePassword) {
      return h
        .response({
          status: "failed",
          error: "New password must be different from the old password!",
        })
        .code(400);
    }

    // Hash password baru
    const hashedNewPassword = await Bun.password.hash(newPassword);

    // Update password di database
    const updatedUser = await User.update(userId, { password: hashedNewPassword });

    return h
      .response({
        status: "success",
        message: "Password updated successfully!",
        data: {
          userId: updatedUser.userId,
          name: updatedUser.name,
          email: updatedUser.email,
          updatedAt: updatedUser.updatedAt,
        },
      })
      .code(200);
  } catch (error) {
    return h
      .response({
        status: "failed",
        error: error.message,
      })
      .code(500);
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
