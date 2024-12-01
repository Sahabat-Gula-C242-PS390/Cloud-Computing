import User from "../models/user.model";

export async function getUser(request, h) {
  try {
    const { userId } = request.params;

    const user = await User.findById(userId);
    if (!user) {
      return h
        .response({ status: "failed", error: "User not found" })
        .code(404);
    }

    const { password, ...userData } = user;

    return h.response({ status: "success", data: userData }).code(200);
  } catch (error) {
    return h.response({ status: "failed", error: error.message }).code(400);
  }
}
