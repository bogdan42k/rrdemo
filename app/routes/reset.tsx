import type { Route } from "./+types/reset";
import { Form, data, useActionData, redirect } from "react-router";
import { getUserId } from "../utils/session.server";
import { prisma } from "../utils/db.server";
import { generateSecureToken, sendPasswordResetEmail, getTokenExpiry } from "../utils/email.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Reset Password - New React Router App" },
    { name: "description", content: "Reset your password" },
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

  // Validate email
  if (typeof email !== "string" || !email.includes("@")) {
    return data({ error: "Invalid email address" }, { status: 400 });
  }

  // Look up user by email
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: { id: true, name: true, email: true },
  });

  // Always return success message for security (don't reveal if email exists)
  const successMessage = "If an account exists with this email, you will receive a password reset link.";

  if (user) {
    try {
      // Generate secure reset token
      const resetToken = generateSecureToken();
      const resetTokenExpiry = getTokenExpiry(1); // 1 hour expiry

      // Store token in database
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpiry,
        },
      });

      // Send password reset email
      await sendPasswordResetEmail({
        to: user.email,
        name: user.name || "User",
        token: resetToken,
      });

      console.log(`✅ Password reset email sent to: ${user.email}`);
    } catch (error) {
      console.error("❌ Error sending password reset email:", error);
      // Still return success message to prevent user enumeration
    }
  }

  return data({ success: successMessage }, { status: 200 });
}

export default function Reset() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 py-10">
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Reset Password
          </h1>

          {actionData && "error" in actionData && actionData.error && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4">
              {actionData.error}
            </div>
          )}

          {actionData && "success" in actionData && actionData.success && (
            <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-400 px-4 py-3 rounded mb-4">
              {actionData.success}
            </div>
          )}

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center">
            Enter your email address and we'll send you a link to reset your password.
          </p>

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

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Send Reset Link
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
