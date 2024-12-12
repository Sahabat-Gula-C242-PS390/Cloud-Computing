import User from "../models/user.model";
import UserLog from "../models/userLog.model";
import Food from "../models/food.model";

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

    // Get the current time in Jakarta
    const currentJakartaDate = new Date().toISOString().split("T")[0];

    const userLogs = await UserLog.find({
      field: "userId",
      value: userId,
      orderBy: "__name__",
      orderDirection: "desc",
    });

    // Filter logs to only include today's logs
    const todayLogs = userLogs.filter(
      (log) =>
        log.createdAt.toISOString().split("T")[0] === currentJakartaDate &&
        log.isDeleted === false,
    );

    const totalNutrition = {
      gula: 0,
      lemak: 0,
      protein: 0,
      karbohidrat: 0,
    };

    for (const log of todayLogs) {
      const food = await Food.findById(log.foodId);
      totalNutrition.gula += food.gula;
      totalNutrition.lemak += food.lemak;
      totalNutrition.protein += food.protein;
      totalNutrition.karbohidrat += food.karbohidrat;
    }

    return h
      .response({
        status: "success",
        userId: userData.userId,
        data: userData,
        totalNutrition,
      })
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
