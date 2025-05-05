
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ShareLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareUrl: string;
  onCopyLink: () => void;
  onOpenLink: () => void;
}

const ShareLinkDialog: React.FC<ShareLinkDialogProps> = ({
  open,
  onOpenChange,
  shareUrl,
  onCopyLink,
  onOpenLink,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Compartilhar convite</DialogTitle>
          <DialogDescription>
            Compartilhe este link com o convidado para que ele possa confirmar sua presença.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <Input readOnly value={shareUrl} onClick={e => (e.target as HTMLInputElement).select()} />
          <Button onClick={onCopyLink}>Copiar</Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button type="button" variant="secondary" onClick={onOpenLink}>
            Abrir link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareLinkDialog;
