import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NoContent({
  title,
  description,
  buttonContent,
  link,
}: {
  title: string;
  description: string;
  buttonContent: string;
  link: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4 text-center">
      <div className="mb-4 rounded-full bg-muted p-3">
        <Package className="h-10 w-10 text-muted-foreground animate-pulse" />
      </div>
      <h3 className="mb-1 text-lg font-semibold">{title}</h3>
      <p className="mb-4 text-sm text-muted-foreground max-w-[250px]">
        {description}
      </p>
      <Link href={link}>
        <Button size="sm">{buttonContent}</Button>
      </Link>
    </div>
  );
}
