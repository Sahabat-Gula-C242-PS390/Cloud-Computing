import Food from "../models/food.model.js";
import UserLog from "../models/userLog.model.js";

export async function getUserLog(request, h) {
  try {
    const { userId, userLogId } = request.params;

    const userLog = await UserLog.findById(userLogId);
    if (!userLog) {
      return h
        .response({ status: "failed", error: "User log not found!" })
        .code(404);
    }

    if (userLog.userId !== userId) {
      return h
        .response({ status: "failed", error: "User not authorized!" })
        .code(401);
    }

    if (userLog.isDeleted) {
      return h
        .response({ status: "failed", error: "User log is deleted!" })
        .code(404);
    }

    const filteredUserLog = {
      userLogId: userLog.userLogId,
      userId: userLog.userId,
      foodId: userLog.foodId,
      imageUrl: userLog.imageUrl,
      createdAt: userLog.createdAt,
      updatedAt: userLog.updatedAt,
    };

    return h.response({ status: "success", data: filteredUserLog }).code(200);
  } catch (error) {
    return h.response({ status: "failed", error: error.message }).code(400);
  }
}

// `/user/{userId}/logs`
export async function getUserLogs(request, h) {
  try {
    const { userId } = request.params;

    const userLog = await UserLog.find({
      field: "userId",
      value: userId,
      orderBy: "__name__",
      orderDirection: "desc",
    });

    const filteredUserLog = await Promise.all(
      userLog
        .filter((log) => !log.isDeleted)
        .map(async (log) => {
          const nutrition = await Food.findById(log.foodId);
          return {
            userLogId: log.userLogId,
            userId: log.userId,
            foodId: log.foodId,
            imageUrl: log.imageUrl,
            name: nutrition.name,
            gula: nutrition.gula,
            karbohidrat: nutrition.karbohidrat,
            lemak: nutrition.lemak,
            protein: nutrition.protein,
            createdAt: log.createdAt,
            updatedAt: log.updatedAt,
          };
        }),
    );

    return h.response({ status: "success", data: filteredUserLog }).code(200);
  } catch (error) {
    return h.response({ status: "failed", error: error.message }).code(400);
  }
}

export async function deleteUserLog(request, h) {
  try {
    const { userId, userLogId } = request.params;

    const userLog = await UserLog.findById(userLogId);
    if (!userLog) {
      return h
        .response({ status: "failed", error: "User log not found!" })
        .code(404);
    }

    if (userLog.userId !== userId) {
      return h
        .response({ status: "failed", error: "User not authorized!" })
        .code(401);
    }

    await UserLog.update(userLogId, { isDeleted: true });

    return h.response({ status: "success" }).code(200);
  } catch (error) {
    return h.response({ status: "failed", error: error.message }).code(400);
  }
}
