import type { Route } from "./+types/_index";
import { Form, redirect } from "react-router";
import { getUser, requireUserId } from "../utils/session.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard - New React Router App" },
    { name: "description", content: "User Dashboard" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  await requireUserId(request);
  const user = await getUser(request);
  return { user };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "logout") {
    const { logout } = await import("../utils/session.server");
    return logout(request);
  }

  return redirect("/dashboard");
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center">
              <Form method="post">
                <input type="hidden" name="intent" value="logout" />
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Logout
                </button>
              </Form>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to Your Dashboard!
            </h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="font-semibold text-gray-700 dark:text-gray-300 w-24">
                  User ID:
                </span>
                <span className="text-gray-900 dark:text-white">{user?.id}</span>
              </div>
              {user?.name && (
                <div className="flex items-center">
                  <span className="font-semibold text-gray-700 dark:text-gray-300 w-24">
                    Name:
                  </span>
                  <span className="text-gray-900 dark:text-white">{user.name}</span>
                </div>
              )}
              <div className="flex items-center">
                <span className="font-semibold text-gray-700 dark:text-gray-300 w-24">
                  Email:
                </span>
                <span className="text-gray-900 dark:text-white">{user?.email}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold text-gray-700 dark:text-gray-300 w-24">
                  Role:
                </span>
                <span className="text-gray-900 dark:text-white">{user?.role}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
