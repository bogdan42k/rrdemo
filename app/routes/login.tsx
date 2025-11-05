import type { Route } from "./+types/login";
import { Form, data, useActionData, redirect, useSearchParams } from "react-router";
import { prisma } from "../utils/db.server";
import { createUserSession, getUserId } from "../utils/session.server";
import bcrypt from "bcryptjs";
import { sendLoginNotification } from "../utils/email.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login - New React Router App" },
    { name: "description", content: "Sign in to your account" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) {
    throw redirect("/dashboard");
  }
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  // Validate inputs
  if (typeof email !== "string" || !email.includes("@")) {
    return data({ error: "Invalid email address" }, { status: 400 });
  }

  if (typeof password !== "string" || password.length === 0) {
    return data({ error: "Password is required" }, { status: 400 });
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return data({ error: "Invalid email or password" }, { status: 400 });
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return data({ error: "Invalid email or password" }, { status: 400 });
  }

  // Check if email is verified
  if (!user.emailVerified) {
    return data(
      {
        error:
          "Please verify your email address before logging in. Check your inbox for the verification link.",
      },
      { status: 403 }
    );
  }

  // Send login notification (throttled to once per hour)
  const now = new Date();
  const shouldSendNotification =
    !user.lastLoginNotification ||
    now.getTime() - user.lastLoginNotification.getTime() > 60 * 60 * 1000; // 1 hour

  if (shouldSendNotification) {
    try {
      // Get client information
      const ipAddress =
        request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
        request.headers.get("x-real-ip") ||
        request.headers.get("cf-connecting-ip") ||
        "Unknown";

      const userAgent = request.headers.get("user-agent") || "Unknown";

      // Send notification email (async, don't block login)
      sendLoginNotification({
        to: user.email,
        name: user.name || "User",
        ipAddress,
        userAgent,
        timestamp: now,
      }).catch((error) => {
        console.error("❌ Error sending login notification:", error);
      });

      // Update last notification timestamp
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginNotification: now },
      });

      console.log(`📧 Login notification sent to: ${user.email}`);
    } catch (error) {
      console.error("❌ Error sending login notification:", error);
      // Don't block login if notification fails
    }
  }

  // Create session and redirect to dashboard
  return createUserSession(user.id, "/dashboard");
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();
  const registered = searchParams.get("registered");
  const resetSuccess = searchParams.get("reset");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 py-10">
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Login
          </h1>

          {registered && (
            <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-400 px-4 py-3 rounded mb-4">
              Registration successful! Please check your email to verify your account before logging in.
            </div>
          )}

          {resetSuccess && (
            <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-400 px-4 py-3 rounded mb-4">
              Password reset successful! You can now log in with your new password.
            </div>
          )}

          {actionData?.error && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4">
              {actionData.error}
            </div>
          )}

          <Form method="post" className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Login
            </button>
          </Form>

          <div className="mt-4 text-center">
            <a href="/reset" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              Forgot password?
            </a>
          </div>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
