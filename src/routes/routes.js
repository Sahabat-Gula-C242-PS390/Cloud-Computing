import {
  signup,
  login,
  checkEmail,
  changePassword,
} from "../handlers/auth.handler.js";
import {
  createArticle,
  deleteAllArticle,
  deleteArticle,
  getAllArticles,
  getArticle,
} from "../handlers/article.handler.js";
import { deleteUser, getUser } from "../handlers/user.handler.js";
import { predictFood, savePredictFood } from "../handlers/food.handler.js";
import {
  deleteUserLog,
  getUserLog,
  getUserLogs,
} from "../handlers/userLog.handler.js";
// import { login } from "../handlers/login.js";

const authRoutes = [
  {
    method: "POST",
    path: "/auth/signup",
    handler: signup,
  },
  {
    method: "GET",
    path: "/auth/signup",
    handler: checkEmail,
  },
  {
    method: "POST",
    path: "/auth/login",
    handler: login,
  },
  {
    method: "PUT",
    path: "/auth/{userId}",
    handler: changePassword,
  },
  {
    method: "GET",
    path: "/user/{userId}",
    handler: getUser,
  },
  {
    method: "DELETE",
    path: "/user/{userId}",
    handler: deleteUser,
  },
  {
    method: "GET",
    path: "/user/{userId}/logs",
    handler: getUserLogs,
  },
  {
    method: "DELETE",
    path: "/user/{userId}/log/{userLogId}",
    handler: deleteUserLog,
  },
  {
    method: "GET",
    path: "/user/{userId}/log/{userLogId}",
    handler: getUserLog,
  },
  {
    method: "GET",
    path: "/articles",
    handler: getAllArticles,
  },
  {
    method: "DELETE",
    path: "/articles",
    handler: deleteAllArticle,
  },
  {
    method: "GET",
    path: "/article/{articleId}",
    handler: getArticle,
  },
  {
    method: "POST",
    path: "/article",
    handler: createArticle,
    options: {
      payload: {
        parse: true,
        multipart: { output: "stream" },
        maxBytes: 10 * 1024 * 1024,
      },
    },
  },
  {
    method: "POST",
    path: "/predict",
    handler: predictFood,
    options: {
      payload: {
        parse: true,
        multipart: true,
        output: "stream",
        maxBytes: 10 * 1024 * 1024,
      },
    },
  },
  {
    method: "POST",
    path: "/predict/{userId}",
    handler: savePredictFood,
    options: {
      payload: {
        parse: true,
        multipart: true,
        output: "stream",
        maxBytes: 10 * 1024 * 1024,
      },
    },
  },
  {
    method: "DELETE",
    path: "/article/{articleId}",
    handler: deleteArticle,
  },
  {
    method: "*",
    path: "/{any*}",
    handler: (request, h) => {
      return h.response({ status: "error", error: "Path not exist" }).code(404);
    },
  },
];

const routes = [...authRoutes];

export default routes;
