import type { Route } from "./+types/verify";
import { data, redirect, useSearchParams, useLoaderData } from "react-router";
import { prisma } from "../utils/db.server";
import { createUserSession } from "../utils/session.server";
import { sendWelcomeEmail } from "../utils/email.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Verify Email - New React Router App" },
    { name: "description", content: "Verify your email address" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return data(
      { error: "Invalid or missing verification token" },
      { status: 400 }
    );
  }

  // Find user with this verification token
  const user = await prisma.user.findUnique({
    where: { emailVerificationToken: token },
    select: {
      id: true,
      email: true,
      name: true,
      emailVerified: true,
    },
  });

  if (!user) {
    return data(
      { error: "Invalid verification token. This link may have expired or already been used." },
      { status: 400 }
    );
  }

  // Check if already verified
  if (user.emailVerified) {
    return data(
      { warning: "Your email is already verified. You can log in now." },
      { status: 200 }
    );
  }

  // Verify the email
  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      emailVerificationToken: null, // Clear the token
    },
  });

  console.log(`✅ Email verified for user: ${user.email}`);

  // Send welcome email
  try {
    await sendWelcomeEmail({
      to: user.email,
      name: user.name || "User",
    });
    console.log(`✅ Welcome email sent to: ${user.email}`);
  } catch (error) {
    console.error("❌ Error sending welcome email:", error);
    // Don't fail verification if welcome email fails
  }

  // Log the user in after verification
  return createUserSession(user.id, "/dashboard?verified=true");
}

export default function Verify() {
  const loaderData = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();

  if (loaderData && "error" in loaderData && loaderData.error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 py-10">
            <div className="text-center mb-6">
              <svg
                className="mx-auto h-16 w-16 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
              Verification Failed
            </h1>

            <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-6">
              {loaderData.error}
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center">
              Need help? Contact support or try registering again.
            </p>

            <div className="space-y-3">
              <a
                href="/register"
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Register New Account
              </a>
              <a
                href="/login"
                className="block w-full text-center bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Go to Login
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loaderData && "warning" in loaderData && loaderData.warning) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 py-10">
            <div className="text-center mb-6">
              <svg
                className="mx-auto h-16 w-16 text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
              Already Verified
            </h1>

            <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-700 text-yellow-700 dark:text-yellow-400 px-4 py-3 rounded mb-6">
              {loaderData.warning}
            </div>

            <a
              href="/login"
              className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Go to Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Loading state (should redirect automatically)
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 py-10 text-center">
          <div className="animate-spin mx-auto h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Verifying your email...
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Please wait while we verify your email address.
          </p>
        </div>
      </div>
    </div>
  );
}
