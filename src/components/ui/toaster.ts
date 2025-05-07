
// Re-export directly from the toaster.tsx file which contains the actual Toaster component
import { Toaster } from "@/components/ui/toaster.tsx";
import { useToast, toast } from "@/hooks/use-toast";

export { Toaster, useToast, toast };
