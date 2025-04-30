
import { Helmet } from "react-helmet";
import Footer from "@/components/Footer";

const PoliticaDeCookies = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Política de Cookies | GestorFest</title>
        <meta name="description" content="Política de cookies da plataforma GestorFest conforme a LGPD." />
      </Helmet>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="prose max-w-none">
          <h1 className="text-3xl font-bold mb-6">Política de Cookies</h1>
          
          <p className="mb-4">
            Esta política explica como o GestorFest utiliza cookies e tecnologias similares para melhorar sua
            experiência em nossa plataforma.
          </p>
          
          {/* Conteúdo da política de cookies seria inserido aqui */}
          <p>Conteúdo da política de cookies a ser adicionado.</p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PoliticaDeCookies;
