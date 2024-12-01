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
    } = request.payload;

    const kaloriHarian = 2645;
    const karbohidratHarian = 1455;
    const lemakHarian = 529;
    const proteinHarian = 379;
    const gulaHarian = 282;

    // const required = {
    //   email,
    //   name,
    //   password,
    //   gender,
    //   umur,
    //   berat,
    //   tinggi,
    //   lingkarPinggang,
    //   tekananDarahTinggi,
    //   gulaDarahTinggi,
    //   riwayatDiabetes,
    //   tingkatAktivitas,
    //   konsumsiBuah,
    //   kaloriHarian,
    //   karbohidratHarian,
    //   lemakHarian,
    //   proteinHarian,
    //   gulaHarian,
    // };
    // console.log("success required");
    // userCheckField(required);
    // console.log("success custom check field");

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

    return h.response({ status: "success", userId }).code(200);
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
