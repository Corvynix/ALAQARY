import { useState, useEffect, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Save, Check, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotesEditorProps {
  initialValue?: string;
  label?: string;
  placeholder?: string;
  onSave: (notes: string) => Promise<void>;
  autoSave?: boolean;
  autoSaveDelay?: number;
  className?: string;
  disabled?: boolean;
  minHeight?: string;
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export function NotesEditor({
  initialValue = "",
  label = "Notes",
  placeholder = "Add notes...",
  onSave,
  autoSave = true,
  autoSaveDelay = 2000,
  className,
  disabled = false,
  minHeight = "120px",
}: NotesEditorProps) {
  const { toast } = useToast();
  const [value, setValue] = useState(initialValue);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const performSave = useCallback(async (text: string) => {
    try {
      setSaveState('saving');
      await onSave(text);
      setSaveState('saved');
      
      // Reset to idle after showing saved state
      setTimeout(() => {
        setSaveState('idle');
      }, 2000);
    } catch (error) {
      console.error("Failed to save notes:", error);
      setSaveState('error');
      toast({
        title: "Error",
        description: "Failed to save notes. Please try again.",
        variant: "destructive",
      });
      
      // Reset to idle after showing error
      setTimeout(() => {
        setSaveState('idle');
      }, 3000);
    }
  }, [onSave, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    if (autoSave) {
      // Clear existing timeout
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }

      // Set new timeout for auto-save
      const timeout = setTimeout(() => {
        performSave(newValue);
      }, autoSaveDelay);

      setSaveTimeout(timeout);
    }
  };

  const handleManualSave = () => {
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    performSave(value);
  };

  const getSaveIndicator = () => {
    switch (saveState) {
      case 'saving':
        return (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Saving...</span>
          </div>
        );
      case 'saved':
        return (
          <div className="flex items-center gap-2 text-sm text-chart-3">
            <Check className="h-4 w-4" />
            <span>Saved</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>Error saving</span>
          </div>
        );
      default:
        return null;
    }
  };

  const hasChanged = value !== initialValue;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label htmlFor="notes-editor">{label}</Label>
        {autoSave ? (
          getSaveIndicator()
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={handleManualSave}
            disabled={!hasChanged || saveState === 'saving' || disabled}
            data-testid="button-save-notes"
          >
            {saveState === 'saving' ? (
              <>
                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-3 w-3 mr-2" />
                Save
              </>
            )}
          </Button>
        )}
      </div>
      <Textarea
        id="notes-editor"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled || saveState === 'saving'}
        className={cn("resize-none transition-colors", {
          "border-chart-3/50": saveState === 'saved',
          "border-destructive/50": saveState === 'error',
        })}
        style={{ minHeight }}
        data-testid="textarea-notes"
      />
      {!autoSave && getSaveIndicator()}
    </div>
  );
}
