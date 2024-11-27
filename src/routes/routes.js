import { signup, verify } from "../handlers/auth.handler.js";
import { login } from "../handlers/login.js";

const authRoutes = [
  {
    method: "POST",
    path: "/auth/signup",
    handler: signup,
  },
  {
    method: "POST",
    path: "/auth/verify",
    handler: verify,
  },
  {
    method: "POST",
    path: "/auth/login",
    handler: login,
  },
];

const routes = [...authRoutes];

export default routes;
