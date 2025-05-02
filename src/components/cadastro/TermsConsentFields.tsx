
import { Control } from "react-hook-form";
import { Link } from "react-router-dom";
import CheckboxLGPD from "@/components/CheckboxLGPD";

interface TermsConsentFieldsProps {
  control: Control<any>;
  setShowTermsModal: (show: boolean) => void;
  setShowLGPDModal: (show: boolean) => void;
}

const TermsConsentFields = ({ 
  control, 
  setShowTermsModal, 
  setShowLGPDModal 
}: TermsConsentFieldsProps) => {
  return (
    <div className="space-y-2 pt-2">
      <CheckboxLGPD
        control={control}
        name="termos"
        label={
          <>
            Li e aceito os{" "}
            <button
              type="button"
              className="text-primary-lighter hover:underline font-medium"
              onClick={() => setShowTermsModal(true)}
            >
              termos de uso
            </button>
            {" "}e{" "}
            <Link to="/politica-de-privacidade" className="text-primary-lighter hover:underline font-medium" target="_blank">
              política de privacidade
            </Link>
          </>
        }
      />
      
      <CheckboxLGPD
        control={control}
        name="lgpd"
        label={
          <>
            Consinto com o{" "}
            <button 
              type="button"
              className="text-primary-lighter hover:underline font-medium"
              onClick={() => setShowLGPDModal(true)}
            >
              tratamento dos meus dados pessoais
            </button>
            {" "}de acordo com a LGPD
          </>
        }
      />
    </div>
  );
};

export default TermsConsentFields;
