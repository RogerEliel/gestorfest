
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

type CookieCategories = {
  necessary: boolean;
  performance: boolean;
  functionality: boolean;
  marketing: boolean;
};

interface CookiePreferencesProps {
  open: boolean;
  onClose: () => void;
  onSave: (preferences: CookieCategories) => void;
}

export const getCookiePreferences = (): CookieCategories => {
  const savedPreferences = localStorage.getItem("cookie-preferences");
  if (savedPreferences) {
    return JSON.parse(savedPreferences);
  }
  return {
    necessary: true,
    performance: false,
    functionality: false,
    marketing: false,
  };
};

const CookiePreferences = ({ open, onClose, onSave }: CookiePreferencesProps) => {
  const [preferences, setPreferences] = useState<CookieCategories>(() => getCookiePreferences());

  useEffect(() => {
    const savedPreferences = localStorage.getItem("cookie-preferences");
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, [open]);

  const handleToggle = (category: keyof CookieCategories) => {
    if (category === "necessary") return; // Can't toggle necessary cookies
    setPreferences((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleSave = () => {
    onSave(preferences);
    onClose();
  };

  const handleAcceptAll = () => {
    const allAccepted: CookieCategories = {
      necessary: true,
      performance: true,
      functionality: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    onSave(allAccepted);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Configurações de Cookies</DialogTitle>
          <DialogDescription>
            Configure suas preferências de cookies. Cookies estritamente necessários são essenciais para o funcionamento do site e não podem ser desativados.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col">
              <Label className="font-semibold">Cookies Estritamente Necessários</Label>
              <p className="text-sm text-muted-foreground">
                Essenciais para a funcionalidade básica do site.
              </p>
            </div>
            <Switch checked={true} disabled />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col">
              <Label className="font-semibold">Cookies de Desempenho/Análise</Label>
              <p className="text-sm text-muted-foreground">
                Ajudam a melhorar a experiência coletando dados de uso anônimos.
              </p>
            </div>
            <Switch 
              checked={preferences.performance}
              onCheckedChange={() => handleToggle("performance")}
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col">
              <Label className="font-semibold">Cookies de Funcionalidade</Label>
              <p className="text-sm text-muted-foreground">
                Lembram suas preferências para melhorar a experiência.
              </p>
            </div>
            <Switch 
              checked={preferences.functionality}
              onCheckedChange={() => handleToggle("functionality")}
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col">
              <Label className="font-semibold">Cookies de Marketing/Publicidade</Label>
              <p className="text-sm text-muted-foreground">
                Usados para rastrear comportamento e exibir anúncios personalizados.
              </p>
            </div>
            <Switch 
              checked={preferences.marketing}
              onCheckedChange={() => handleToggle("marketing")}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <Info className="h-4 w-4 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            Você pode alterar suas preferências a qualquer momento na página de Política de Cookies.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="outline" onClick={handleAcceptAll}>Aceitar Todos</Button>
          <Button onClick={handleSave}>Salvar Preferências</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CookiePreferences;
