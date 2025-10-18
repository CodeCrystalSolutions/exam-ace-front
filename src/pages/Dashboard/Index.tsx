import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Building2, CheckCircle2 } from "lucide-react";

export default function Dashboard() {
  const { user, tenant } = useAuth();

  const stats = [
    {
      title: "Role",
      value: user?.role,
      icon: Users,
      description: "Your current role",
    },
    {
      title: "Organization",
      value: tenant?.name || "N/A",
      icon: Building2,
      description: "Your organization",
    },
    {
      title: "Status",
      value: user?.active ? "Active" : "Inactive",
      icon: CheckCircle2,
      description: "Account status",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, {user?.full_name}!
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Getting Started
          </CardTitle>
          <CardDescription>
            Quick actions based on your role
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {user?.role === "admin" && (
            <div className="space-y-2">
              <h3 className="font-semibold">Admin Tasks</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Manage users in the Users section</li>
                <li>Create and manage exams</li>
                <li>Monitor system activity</li>
              </ul>
            </div>
          )}
          {user?.role === "teacher" && (
            <div className="space-y-2">
              <h3 className="font-semibold">Teacher Tasks</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Create and manage exams</li>
                <li>Add questions to exams</li>
                <li>Review student submissions</li>
              </ul>
            </div>
          )}
          {user?.role === "student" && (
            <div className="space-y-2">
              <h3 className="font-semibold">Student Tasks</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>View available exams</li>
                <li>Start and complete attempts</li>
                <li>Check your results</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
