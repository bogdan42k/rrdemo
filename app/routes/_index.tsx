import type { Route } from "./+types/_index";
import { getUser } from "../utils/session.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Welcome - New React Router App" },
    { name: "description", content: "Welcome page" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getUser(request);
  return { user };
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
        Hello, {user?.name || "visitor"}!
      </h1>
    </div>
  );
}
