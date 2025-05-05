
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ManualGuestForm from "./ManualGuestForm";
import { SingleGuestFormValues } from "@/schemas/convite";

interface AddGuestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: SingleGuestFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

const AddGuestModal: React.FC<AddGuestModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
}) => {
  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleSubmit = async (data: SingleGuestFormValues) => {
    await onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Convidado</DialogTitle>
        </DialogHeader>
        <ManualGuestForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddGuestModal;
