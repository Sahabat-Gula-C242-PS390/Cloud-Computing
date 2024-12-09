import User from "../models/user.model";

export async function getUser(request, h) {
  try {
    const { userId } = request.params;

    const user = await User.findById(userId);
    if (!user) {
      return h
        .response({ status: "failed", error: "User not found!" })
        .code(404);
    }

    // Password should not be returned
    // eslint-disable-next-line no-unused-vars
    const { password, ...userData } = user;

    return h
      .response({ status: "success", userId: userData.userId, data: userData })
      .code(200);
  } catch (error) {
    return h.response({ status: "failed", error: error.message }).code(400);
  }
}

export async function deleteUser(request, h) {
  try {
    const { userId } = request.params;

    const user = await User.findById(userId);
    if (!user) {
      return h
        .response({ status: "failed", error: "User not found!" })
        .code(404);
    }

    const result = User.findByIdAndDelete(userId);
    if (!result) {
      return h
        .response({ status: "failed", error: "User not deleted!" })
        .code(400);
    }
    return h.response({ status: "success" }).code(200);
  } catch (error) {
    return h.response({ status: "failed", error: error.message }).code(400);
  }
}
