
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { CustomDialogTitle, CustomDialogDescription } from "@/components/ui/custom-dialog";

interface ModalTermsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  content: React.ReactNode;
}

const ModalTerms = ({ open, onOpenChange, title, content }: ModalTermsProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <CustomDialogTitle className="text-xl font-bold">{title}</CustomDialogTitle>
          <CustomDialogDescription>
            Leia atentamente o documento abaixo:
          </CustomDialogDescription>
        </DialogHeader>
        
        <div className="mt-4 text-sm">
          {content}
        </div>
        
        <DialogFooter className="mt-6">
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalTerms;
