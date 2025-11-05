import type { Route } from "./+types/reset-password";
import { Form, data, useActionData, useSearchParams, redirect } from "react-router";
import { prisma } from "../utils/db.server";
import { isTokenExpired } from "../utils/email.server";
import bcrypt from "bcryptjs";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Reset Password - New React Router App" },
    { name: "description", content: "Set your new password" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return data({ error: "Invalid or missing reset token" }, { status: 400 });
  }

  // Verify token exists and is not expired
  const user = await prisma.user.findUnique({
    where: { resetToken: token },
    select: { id: true, resetTokenExpiry: true },
  });

  if (!user || isTokenExpired(user.resetTokenExpiry)) {
    return data(
      { error: "This password reset link has expired or is invalid. Please request a new one." },
      { status: 400 }
    );
  }

  return data({ valid: true });
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const token = formData.get("token");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  // Validate inputs
  if (typeof token !== "string" || !token) {
    return data({ error: "Invalid reset token" }, { status: 400 });
  }

  if (typeof password !== "string" || password.length < 8) {
    return data({ error: "Password must be at least 8 characters long" }, { status: 400 });
  }

  if (password !== confirmPassword) {
    return data({ error: "Passwords do not match" }, { status: 400 });
  }

  // Find user with this token
  const user = await prisma.user.findUnique({
    where: { resetToken: token },
    select: { id: true, resetTokenExpiry: true },
  });

  if (!user || isTokenExpired(user.resetTokenExpiry)) {
    return data(
      { error: "This password reset link has expired or is invalid. Please request a new one." },
      { status: 400 }
    );
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Update password and clear reset token
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  console.log(`✅ Password reset successful for user ID: ${user.id}`);

  return redirect("/login?reset=success");
}

export default function ResetPassword() {
  const actionData = useActionData<typeof action>();
  const loaderData = useActionData<typeof loader>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  // Show error if token is invalid from loader
  if (loaderData && "error" in loaderData && loaderData.error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 py-10">
            <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
              Invalid Reset Link
            </h1>

            <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4">
              {loaderData.error}
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center">
              You can request a new password reset link.
            </p>

            <a
              href="/reset"
              className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Request New Reset Link
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 py-10">
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Set New Password
          </h1>

          {actionData && "error" in actionData && actionData.error && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4">
              {actionData.error}
            </div>
          )}

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center">
            Enter your new password below.
          </p>

          <Form method="post" className="space-y-6">
            <input type="hidden" name="token" value={token || ""} />

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                New Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                minLength={8}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="At least 8 characters"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                minLength={8}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Re-enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Reset Password
            </button>
          </Form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Remember your password?{" "}
            <a href="/login" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
