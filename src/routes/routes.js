import { signup, verify } from "../handlers/auth.handler.js";

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
];

const routes = [...authRoutes];

export default routes;
