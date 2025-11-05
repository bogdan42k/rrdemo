import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("/dashboard", "routes/dashboard.tsx"),
  route("/register", "routes/register.tsx"),
  route("/login", "routes/login.tsx"),
  route("/logout", "routes/logout.tsx"),
  route("/reset", "routes/reset.tsx"),
  route("/reset-password", "routes/reset-password.tsx"),
  route("/verify", "routes/verify.tsx"),
] satisfies RouteConfig;
