import { useAuth } from "@/hooks/use-auth";

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <h1>
      Display name: {user?.displayName} | Email: {user?.email} | Username:{" "}
      {user?.username} | ID: {user?._id}
    </h1>
  );
}
