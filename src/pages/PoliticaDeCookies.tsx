
import { Helmet } from "react-helmet";
import Footer from "@/components/Footer";

const PoliticaDeCookies = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Política de Cookies – GestorFest</title>
        <meta 
          name="description" 
          content="Entenda como usamos cookies para melhorar sua experiência no GestorFest." 
        />
      </Helmet>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="prose max-w-none">
          <h1 className="text-3xl font-bold mb-6">Política de Cookies – GestorFest</h1>
          
          <p className="mb-4"><strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. O que são Cookies</h2>
          <p className="mb-4">
            Cookies são pequenos arquivos de texto enviados pelo GestorFest e armazenados no navegador do Usuário para 
            melhorar a experiência, lembrar preferências e coletar informações de navegação.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Tipos de Cookies Utilizados</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 mb-6">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left">Categoria</th>
                  <th className="border border-gray-300 p-2 text-left">Finalidade</th>
                  <th className="border border-gray-300 p-2 text-left">Exemplo de Cookie</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2"><strong>Estritamente necessários</strong></td>
                  <td className="border border-gray-300 p-2">Garantem o funcionamento básico do site (autenticação, segurança)</td>
                  <td className="border border-gray-300 p-2"><code>session_id</code>, <code>csrf_token</code></td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2"><strong>Desempenho/Análise</strong></td>
                  <td className="border border-gray-300 p-2">Coletam dados anônimos sobre visitas e uso do site para melhorar desempenho e conteúdo</td>
                  <td className="border border-gray-300 p-2"><code>_ga</code>, <code>_gid</code> (Google Analytics)</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2"><strong>Funcionalidade</strong></td>
                  <td className="border border-gray-300 p-2">Memoriza preferências (idioma, layout, preferência de consentimento)</td>
                  <td className="border border-gray-300 p-2"><code>lang</code>, <code>cookie_consent</code></td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2"><strong>Marketing/Publicidade</strong></td>
                  <td className="border border-gray-300 p-2">Rastreamento de hábitos de navegação para exibir anúncios personalizados</td>
                  <td className="border border-gray-300 p-2"><code>_fbp</code>, <code>_gcl_au</code> (Facebook Ads)</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Como Gerenciamos o Consentimento</h2>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2">No <strong>primeiro acesso</strong>, exibimos um banner de cookies com as opções:</li>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-1"><strong>Aceitar todos</strong></li>
              <li className="mb-1"><strong>Recusar todos</strong></li>
              <li className="mb-1"><strong>Configurar Cookies</strong></li>
            </ul>
            <li className="mb-2">Ao clicar em <strong>"Configurar Cookies"</strong>, o Usuário pode ativar ou desativar cada categoria (exceto os estritamente necessários).</li>
            <li className="mb-2">A escolha é salva em um cookie chamado <code>cookie_consent</code> com validade de 180 dias.</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Como Controlar Cookies no Navegador</h2>
          <p className="mb-4">
            O Usuário pode, a qualquer momento, limpar ou bloquear cookies diretamente no seu navegador:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2"><strong>Chrome:</strong> Configurações &gt; Privacidade e segurança &gt; Cookies e outros dados do site</li>
            <li className="mb-2"><strong>Firefox:</strong> Opções &gt; Privacidade e Segurança &gt; Cookies e dados de sites</li>
            <li className="mb-2"><strong>Safari:</strong> Preferências &gt; Privacidade &gt; Gerenciar dados do site</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Consequências da Recusa</h2>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2"><strong>Recusar cookies de desempenho ou marketing</strong> pode afetar análises de uso e personalização de anúncios, mas <strong>não</strong> prejudica o funcionamento básico do GestorFest.</li>
            <li className="mb-2"><strong>Não é possível</strong> recusar cookies estritamente necessários – eles são essenciais para segurança e autenticação.</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Atualizações desta Política</h2>
          <p className="mb-4">
            Podemos atualizar esta Política de Cookies periodicamente.<br />
            Caso ocorram mudanças significativas, notificaremos os Usuários com <strong>30 dias de antecedência</strong>, exibindo um novo banner de consentimento.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PoliticaDeCookies;
