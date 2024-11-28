import { signup, login, checkEmail, changePassword } from "../handlers/auth.handler.js";
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
    method: "POST",
    path: "/auth/change-password",
    handler: changePassword,
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
