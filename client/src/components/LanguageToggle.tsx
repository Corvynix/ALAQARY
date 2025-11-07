import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

interface LanguageToggleProps {
  language: "ar" | "en";
  onToggle: () => void;
}

export default function LanguageToggle({ language, onToggle }: LanguageToggleProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onToggle}
      className="gap-2"
      data-testid="button-language-toggle"
    >
      <Globe className="h-4 w-4" />
      <span>{language === "ar" ? "EN" : "عربي"}</span>
    </Button>
  );
}
