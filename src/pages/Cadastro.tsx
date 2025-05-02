
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardDescription, CardTitle, CardFooter } from "@/components/ui/card";
import ModalTerms from "@/components/ModalTerms";
import CadastroForm from "@/components/cadastro/CadastroForm";

const Cadastro = () => {
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showLGPDModal, setShowLGPDModal] = useState(false);
  
  return (
    <div className="py-10 px-4">
      <div className="max-w-md mx-auto">
        <Card className="border-primary-lighter/20 shadow-lg">
          <CardHeader className="text-center bg-gradient-primary text-white rounded-t-lg">
            <CardTitle className="text-2xl">Criar Conta</CardTitle>
            <CardDescription className="text-white/80">
              Cadastre-se no GestorFest para começar
            </CardDescription>
          </CardHeader>
          
          <CadastroForm 
            setShowTermsModal={setShowTermsModal}
            setShowLGPDModal={setShowLGPDModal}
          />
          
          <CardFooter className="flex flex-col space-y-2 bg-gray-50 rounded-b-lg">
            <div className="text-sm text-center text-gray-500">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-primary-lighter hover:underline font-medium">
                Faça login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      <ModalTerms
        open={showTermsModal}
        onOpenChange={setShowTermsModal}
        title="Termos de Uso"
        content={
          <div className="prose max-w-none">
            <p>Leia os termos de uso completos em nossa página de <Link to="/termos-de-uso" target="_blank" className="text-primary-lighter">Termos de Uso</Link>.</p>
            <p>Ao criar uma conta no GestorFest, você concorda com nossos termos e condições de uso.</p>
          </div>
        }
      />
      
      <ModalTerms
        open={showLGPDModal}
        onOpenChange={setShowLGPDModal}
        title="Tratamento de Dados Pessoais"
        content={
          <div className="prose max-w-none">
            <p>Leia o termo de consentimento completo em nossa página de <Link to="/termo-de-consentimento" target="_blank" className="text-primary-lighter">Termo de Consentimento</Link>.</p>
            <p>Em conformidade com a Lei Geral de Proteção de Dados (LGPD), seus dados pessoais serão tratados apenas para os fins especificados em nossa política de privacidade.</p>
          </div>
        }
      />
    </div>
  );
};

export default Cadastro;
