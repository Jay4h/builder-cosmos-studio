import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Placeholder({ title }: { title: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          This page is a placeholder. Ask to generate this page's detailed UI
          next, and we will build it consistent with the overall app design.
        </p>
      </CardContent>
    </Card>
  );
}
