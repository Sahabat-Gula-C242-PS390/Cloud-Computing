import User from "../models/user.model.js";
import Bun from "bun";
import { customCheckField } from "../utils/checkField.js";

export async function signup(request, h) {
  try {
    const {
      email,
      name,
      password,
      gender,
      umur,
      berat,
      tinggi,
      lingkarPinggang,
      tekananDarahTinggi,
      gulaDarahTinggi,
      riwayatDiabetes,
      tingkatAktivitas,
      konsumsiBuah,
      kaloriHarian = 2645,
      karbohidratHarian = 1455,
      lemakHarian = 529,
      proteinHarian = 379,
      gulaHarian = 282,
    } = request.payload;

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
    // console.log("success hash password");
    const newUser = new User({
      email,
      name,
      password: argonHash,
      gender,
      umur,
      berat,
      tinggi,
      lingkarPinggang,
      tekananDarahTinggi,
      gulaDarahTinggi,
      riwayatDiabetes,
      tingkatAktivitas,
      konsumsiBuah,
      kaloriHarian,
      karbohidratHarian,
      lemakHarian,
      proteinHarian,
      gulaHarian,
    });
    // console.log("success create user");
    const userId = await newUser.save();
    // console.log("success save user");

    // Get user data
    const userNew = await User.findById(userId);
    if (!userNew) {
      return h
        .response({
          status: "failed",
          error: "Failed to get user data!",
        })
        .code(400);
    }

    // Password should not be returned
    // eslint-disable-next-line no-unused-vars
    const { password: userNewPassword, ...userData } = userNew;

    return h
      .response({ status: "success", userId: userData.userId, data: userData })
      .code(201);
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

    customCheckField(required);

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
      .code(200);
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

    if (!user) {
      return h
        .response({
          status: "failed",
          error: "Invalid email or password!",
        })
        .code(401);
    }

    const isMatch = await Bun.password.verify(password, user.password);

    if (!isMatch) {
      return h
        .response({
          status: "failed",
          error: "Invalid email or password!",
        })
        .code(401);
    }

    // Password should not be returned
    // eslint-disable-next-line no-unused-vars
    const { password: userPassword, ...userData } = user;

    return h
      .response({
        status: "success",
        userId: user.userId,
        data: userData,
      })
      .code(200);
  } catch (error) {
    return h.response({ status: "failed", error: error.message }).code(400);
  }
}

export async function changePassword(request, h) {
  try {
    const { userId } = request.params;
    const { password, newPassword } = request.payload;

    const user = await User.findById(userId);
    if (!user) {
      return h
        .response({ status: "failed", error: "User not found!" })
        .code(400);
    }

    const required = {
      password,
      newPassword,
    };

    customCheckField(required);

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
    const isSamePassword = await Bun.password.verify(
      newPassword,
      user.password,
    );
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
    const updatedUser = await User.update(userId, {
      password: hashedNewPassword,
    });

    if (updatedUser.password !== hashedNewPassword) {
      return h
        .response({
          status: "failed",
          error: "Failed to update password!",
        })
        .code(400);
    }

    // console.log("Updated password" + hashedNewPassword);
    // console.log("Updated remote password" + updatedUser.password);

    return h
      .response({
        status: "success",
        message: "Password updated successfully!",
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
