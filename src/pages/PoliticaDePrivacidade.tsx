
import { Helmet } from "react-helmet";
import Footer from "@/components/Footer";

const PoliticaDePrivacidade = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Política de Privacidade | GestorFest</title>
        <meta name="description" content="Política de privacidade da plataforma GestorFest conforme a LGPD." />
      </Helmet>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="prose max-w-none">
          <h1 className="text-3xl font-bold mb-6">Política de Privacidade</h1>
          
          <p className="mb-4">
            Esta política de privacidade descreve como o GestorFest coleta, processa e protege seus dados pessoais
            de acordo com a Lei Geral de Proteção de Dados (LGPD).
          </p>
          
          {/* Conteúdo da política de privacidade seria inserido aqui */}
          <p>Conteúdo da política de privacidade a ser adicionado.</p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PoliticaDePrivacidade;
