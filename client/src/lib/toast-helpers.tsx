import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";
import { toast as baseToast } from "@/hooks/use-toast";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastOptions {
  title?: string;
  description?: string;
  titleAr?: string;
  descriptionAr?: string;
  duration?: number;
  action?: React.ReactNode;
}

/**
 * Enhanced toast helper with bilingual support and icons
 * Automatically detects current language and shows appropriate message
 */
export function showToast(
  type: ToastType,
  options: ToastOptions
) {
  const lang = document.documentElement.lang || 'ar';
  const title = lang === 'ar' ? (options.titleAr || options.title) : options.title;
  const description = lang === 'ar' ? (options.descriptionAr || options.description) : options.description;

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-chart-3" aria-hidden="true" />,
    error: <XCircle className="h-5 w-5 text-destructive" aria-hidden="true" />,
    warning: <AlertTriangle className="h-5 w-5 text-accent" aria-hidden="true" />,
    info: <Info className="h-5 w-5 text-primary" aria-hidden="true" />,
  };

  const classNames = {
    success: "toast-success",
    error: "toast-error",
    warning: "toast-warning",
    info: "toast-info",
  };

  return baseToast({
    title: (
      <div className="flex items-center gap-2">
        {icons[type]}
        <span>{title}</span>
      </div>
    ) as any,
    description,
    duration: options.duration || 5000,
    action: options.action as any,
    className: classNames[type],
  });
}

// Convenience methods
export const toast = {
  success: (options: Omit<ToastOptions, 'type'>) => 
    showToast('success', options),

  error: (options: Omit<ToastOptions, 'type'>) => 
    showToast('error', options),

  warning: (options: Omit<ToastOptions, 'type'>) => 
    showToast('warning', options),

  info: (options: Omit<ToastOptions, 'type'>) => 
    showToast('info', options),

  // Bilingual shortcuts
  successBilingual: (title: string, titleAr: string, description?: string, descriptionAr?: string) =>
    showToast('success', { title, titleAr, description, descriptionAr }),

  errorBilingual: (title: string, titleAr: string, description?: string, descriptionAr?: string) =>
    showToast('error', { title, titleAr, description, descriptionAr }),

  warningBilingual: (title: string, titleAr: string, description?: string, descriptionAr?: string) =>
    showToast('warning', { title, titleAr, description, descriptionAr }),

  infoBilingual: (title: string, titleAr: string, description?: string, descriptionAr?: string) =>
    showToast('info', { title, titleAr, description, descriptionAr }),
};

// Default messages for common scenarios
export const toastMessages = {
  savingSuccess: {
    title: "Saved successfully",
    titleAr: "تم الحفظ بنجاح",
    description: "Your changes have been saved",
    descriptionAr: "تم حفظ التغييرات الخاصة بك",
  },
  savingError: {
    title: "Failed to save",
    titleAr: "فشل في الحفظ",
    description: "Please try again",
    descriptionAr: "يرجى المحاولة مرة أخرى",
  },
  deletingSuccess: {
    title: "Deleted successfully",
    titleAr: "تم الحذف بنجاح",
    description: "The item has been deleted",
    descriptionAr: "تم حذف العنصر",
  },
  deletingError: {
    title: "Failed to delete",
    titleAr: "فشل في الحذف",
    description: "Please try again",
    descriptionAr: "يرجى المحاولة مرة أخرى",
  },
  networkError: {
    title: "Network error",
    titleAr: "خطأ في الشبكة",
    description: "Please check your internet connection",
    descriptionAr: "يرجى التحقق من اتصالك بالإنترنت",
  },
  unauthorizedError: {
    title: "Unauthorized",
    titleAr: "غير مصرح",
    description: "You don't have permission to perform this action",
    descriptionAr: "ليس لديك إذن لتنفيذ هذا الإجراء",
  },
};
