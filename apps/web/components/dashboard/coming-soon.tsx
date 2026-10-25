import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ComingSoon({ module }: { module: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{module}</CardTitle>
        <CardDescription>This module has not been built yet.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Access to this page is already restricted to authorized personnel.
        Add its content inside the page, keeping it within{" "}
        <code className="rounded bg-muted px-1 py-0.5">ProtectedPage</code>.
      </CardContent>
    </Card>
  );
}