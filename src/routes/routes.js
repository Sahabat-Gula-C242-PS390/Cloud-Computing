import { signup } from "../handlers/auth.handler.js";

const authRoutes = [
  {
    method: "POST",
    path: "/auth/signup",
    handler: signup,
  },
];

const routes = [...authRoutes];

export default routes;
