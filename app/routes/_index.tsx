import type { Route } from "./+types/_index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Welcome - New React Router App" },
    { name: "description", content: "Welcome page" },
  ];
}

export default function Index() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
        Hello, visitor!
      </h1>
    </div>
  );
}
