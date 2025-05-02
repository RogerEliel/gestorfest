
import { Helmet } from "react-helmet";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const PoliticaDePrivacidade = () => {
  const dataAtualizacao = new Date().toLocaleDateString('pt-BR');
  
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Política de Privacidade | GestorFest</title>
        <meta name="description" content="Política de privacidade da plataforma GestorFest conforme a LGPD." />
      </Helmet>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="prose max-w-none">
          <h1 className="text-3xl font-bold mb-6">Política de Privacidade e Proteção de Dados Pessoais – GestorFest</h1>
          
          <p className="mb-4"><strong>Última atualização:</strong> {dataAtualizacao}</p>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">1. Controlador de Dados</h2>
            <p>
              <strong>GestorFest Serviços Digitais Ltda.</strong><br />
              CNPJ: 00.000.000/0001-00<br />
              Endereço: Rua Exemplo, 123, Salvador/BA<br />
              Encarregado (DPO): dpo@gestorfest.com.br
            </p>
            <p>
              GestorFest ("Controlador") é responsável pelo tratamento dos dados pessoais dos Usuários ("Titulares"), 
              garantindo o cumprimento da Lei nº 13.709/2018 (LGPD).
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">2. Dados Pessoais Coletados</h2>
            <p>
              Coletamos apenas os dados essenciais para prestação do serviço:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2">
                <strong>Cadastro e Autenticação:</strong> nome, e‑mail, CPF/CNPJ, senha (hash).
              </li>
              <li className="mb-2">
                <strong>Eventos e Convites:</strong> nome do evento, data, local, slug de URL.
              </li>
              <li className="mb-2">
                <strong>Convidados:</strong> nome, telefone (formato internacional), status de RSVP.
              </li>
              <li className="mb-2">
                <strong>Metadados de Uso:</strong> logs de acesso, endereços IP e registros de interação.
              </li>
              <li className="mb-2">
                <strong>Coleta opcional:</strong> observações em convites e uploads de imagens para módulos futuros.
              </li>
            </ul>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">3. Finalidades do Tratamento</h2>
            <p>
              Os dados pessoais são tratados para:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2">
                <strong>Execução contratual:</strong> criação de conta, eventos, convites e controle de presença (Art. 7º, V, LGPD).
              </li>
              <li className="mb-2">
                <strong>Consentimento:</strong> envio de notificações via WhatsApp/E‑mail (Art. 7º, I).
              </li>
              <li className="mb-2">
                <strong>Legítimo Interesse:</strong> aprimoramento da plataforma e relatórios de uso (Art. 7º, IX).
              </li>
              <li className="mb-2">
                <strong>Cumprimento de obrigação legal:</strong> retenção de dados para fins fiscais e jurídicos (Art. 7º, II).
              </li>
            </ul>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">4. Bases Legais</h2>
            <p>
              Tratamos dados conforme:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2">Consentimento (Art. 7º, I)</li>
              <li className="mb-2">Execução de contrato (Art. 7º, V)</li>
              <li className="mb-2">Obrigação legal (Art. 7º, II)</li>
              <li className="mb-2">Legítimo interesse (Art. 7º, IX)</li>
            </ul>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">5. Compartilhamento de Dados</h2>
            <p>
              Podemos compartilhar dados com:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2">
                <strong>Parceiros de serviço</strong> (Twilio, Supabase, serviços de e‑mail) para envio de mensagens e armazenamento, 
                sob contratos de confidencialidade.
              </li>
              <li className="mb-2">
                <strong>Autoridades públicas</strong>, quando exigido por lei.
              </li>
              <li className="mb-2">
                <strong>Módulos futuros e integradores</strong> (fotógrafos, assessoria, buffet), apenas mediante autorização do Titular.
              </li>
            </ul>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">6. Transferência Internacional</h2>
            <p>
              Caso haja transferência de dados para servidores fora do Brasil, garantimos que seja feita com cláusulas 
              contratuais padrão aprovadas pela ANPD.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">7. Retenção de Dados</h2>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2">
                <strong>Dados de eventos e convites:</strong> mantidos por até 5 anos após o término do evento.
              </li>
              <li className="mb-2">
                <strong>Dados de cadastro:</strong> mantidos enquanto a conta estiver ativa.
              </li>
              <li className="mb-2">
                <strong>Logs de acesso:</strong> mantidos por 1 ano para segurança e auditoria.
              </li>
            </ul>
            <p>
              Após esses prazos, os dados são anonimizados ou excluídos, salvo obrigação legal em contrário.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">8. Direitos dos Titulares</h2>
            <p>
              O Titular pode exercer, gratuitamente, os direitos de:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2">Acesso aos dados (Art. 18)</li>
              <li className="mb-2">Correção de dados incompletos ou desatualizados (Art. 18)</li>
              <li className="mb-2">Portabilidade (Art. 18)</li>
              <li className="mb-2">Eliminação (Art. 18)</li>
              <li className="mb-2">Revogação de consentimento (Art. 8º)</li>
              <li className="mb-2">Oposição ao tratamento (Art. 18)</li>
            </ul>
            <p>
              Solicitações via e‑mail: dpo@gestorfest.com.br
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">9. Segurança</h2>
            <p>
              Adotamos medidas técnicas e administrativas (criptografia, RLS, logs de auditoria) para proteger dados pessoais
              contra acesso não autorizado, alteração ou vazamento.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">10. Dados de Minoridade</h2>
            <p>
              Não coletamos dados pessoais de menores de 18 anos. Caso sejam inseridos, o Usuário declara ter autorização de seus responsáveis.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">11. Cookies</h2>
            <p>
              Utilizamos cookies estritamente necessários e analíticos para:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2">Autenticar usuários</li>
              <li className="mb-2">Armazenar preferências (tema, idioma)</li>
              <li className="mb-2">Analisar navegação (Google Analytics, Plausible)</li>
            </ul>
            <p>
              O Usuário pode gerenciar cookies no navegador, exceto os essenciais, sob risco de perda de funcionalidades.
              Para mais informações, consulte nossa <Link to="/politica-de-cookies" className="text-blue-600 hover:underline">Política de Cookies</Link>.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">12. Alterações na Política</h2>
            <p>
              Podemos modificar esta Política a qualquer momento. As alterações serão publicadas em nosso site com 30 dias de antecedência 
              e notificadas aos Usuários.
            </p>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PoliticaDePrivacidade;
