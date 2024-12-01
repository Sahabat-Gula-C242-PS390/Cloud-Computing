import { signup, login, checkEmail } from "../handlers/auth.handler.js";
import { createArticle, getArticles } from "../handlers/article.handler.js";
import { getUser } from "../handlers/user.handler.js";
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
    method: "GET",
    path: "/user/{userId}",
    handler: getUser,
  },
  {
    method: "GET",
    path: "/articles",
    handler: getArticles,
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
    method: "*",
    path: "/{any*}",
    handler: (request, h) => {
      return h.response({ status: "error", error: "Path not exist" }).code(404);
    },
  },
];

const routes = [...authRoutes];

export default routes;
