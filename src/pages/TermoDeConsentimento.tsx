
import { Helmet } from "react-helmet";
import Footer from "@/components/Footer";

const TermoDeConsentimento = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Termo de Consentimento para Tratamento de Dados Pessoais – GestorFest</title>
        <meta name="description" content="Termo de consentimento para tratamento de dados pessoais da plataforma GestorFest conforme a LGPD." />
      </Helmet>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="prose max-w-none">
          <h1 className="text-3xl font-bold mb-6">Termo de Consentimento para Tratamento de Dados Pessoais – GestorFest</h1>
          <p className="italic text-gray-600 mb-8">Última atualização: 30/04/2025</p>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">1. Controlador dos Dados</h2>
            <p>
              Nome: GestorFest Serviços Digitais Ltda.<br />
              CNPJ: 00.000.000/0001-00<br />
              Endereço: Rua Exemplo, 123, Salvador/BA<br />
              E-mail para contato: dpo@gestorfest.com.br
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">2. Finalidades do Tratamento</h2>
            <h3 className="text-lg font-medium mb-2">Envio de convites e gestão de RSVP</h3>
            <p className="mb-3">
              Coleta de nome e telefone para encaminhamento de mensagem via WhatsApp Business.
            </p>
            <p className="mb-4 italic">
              Fundamentação legal: Consentimento (Art. 7º, I) e Execução de contrato (Art. 7º, V).
            </p>

            <h3 className="text-lg font-medium mb-2">Comunicação administrativa e operacional</h3>
            <p className="mb-3">
              E-mail e telefone para envio de notificações sobre eventos, lembretes e atualizações de plataforma.
            </p>
            <p className="mb-4 italic">
              Fundamentação legal: Legítimo interesse (Art. 7º, IX), limitado ao essencial.
            </p>

            <h3 className="text-lg font-medium mb-2">Melhoria de serviços e análises internas</h3>
            <p className="mb-3">
              Uso de dados anonimizados para estatísticas de uso, relatórios de engajamento e otimização de processos.
            </p>
            <p className="mb-4 italic">
              Fundamentação legal: Legítimo interesse (Art. 7º, IX), respeitando anonimização.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">3. Dados Coletados</h2>
            <p className="mb-1 font-medium">Obrigatórios:</p>
            <ul className="list-disc pl-6 mb-3">
              <li>Nome completo</li>
              <li>Número de telefone (formato internacional)</li>
            </ul>
            
            <p className="mb-1 font-medium">Opcionais:</p>
            <ul className="list-disc pl-6">
              <li>Observações ou mensagem personalizada (campo livre)</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">4. Compartilhamento de Dados</h2>
            <p className="mb-2">
              <strong>Interno:</strong> Compartilhamento entre módulos do GestorFest (ex: Marketing, Suporte, Analytics).
            </p>
            <p className="mb-2">
              <strong>Terceiros:</strong>
            </p>
            <ul className="list-disc pl-6 mb-3">
              <li>Provedor da API de WhatsApp Business (Twilio, Z-API, etc.) para envio de mensagens.</li>
              <li>Serviços de e-mail transacional (Resend, Postmark) para notificações.</li>
            </ul>
            <p>
              Em todos os casos, as transferências são regidas por contratos de confidencialidade e políticas de segurança.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">5. Prazo de Retenção</h2>
            <p className="mb-2">
              Os dados de RSVP são mantidos por 5 anos após a data do evento, para fins de histórico e comprovação contratual.
            </p>
            <p>
              Dados de comunicação (e-mail/telefone) são mantidos enquanto ativo o relacionamento ou até revogação do consentimento.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">6. Direitos do Titular</h2>
            <p className="mb-2">Você, titular dos dados, tem direito a:</p>
            <ul className="list-disc pl-6 mb-3">
              <li><strong>Acesso:</strong> conhecer quais dados temos sobre você.</li>
              <li><strong>Correção:</strong> solicitar atualização ou correção de dados incorretos.</li>
              <li><strong>Portabilidade:</strong> receber seus dados em formato estruturado.</li>
              <li><strong>Eliminação:</strong> excluir seus dados quando não mais necessários.</li>
              <li><strong>Revogação:</strong> retirar seu consentimento a qualquer momento (o que poderá impedir o envio de convites).</li>
            </ul>
            <p>
              Para exercer qualquer desses direitos, entre em contato por e-mail: dpo@gestorfest.com.br.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">7. Como Fornecer o Consentimento</h2>
            <p>
              No momento do envio do convite (pelo WhatsApp), será exibida uma mensagem com link para este Termo de Consentimento. 
              Ao clicar em "Aceito" ou ao responder ao convite, você confirma tacitamente seu consentimento para o tratamento descrito.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">8. Consequências da Recusa ou Revogação</h2>
            <p className="mb-2">
              <strong>Recusa inicial:</strong> se você não aceitar o termo, não receberá convites pelo GestorFest.
            </p>
            <p>
              <strong>Revogação posterior:</strong> ao revogar, cessaremos o uso de seus dados para novos envios; 
              porém, registros de RSVP já processados permanecerão em arquivo para fins legais.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">9. Segurança e Proteção</h2>
            <p>
              Adotamos medidas técnicas e administrativas (criptografia em repouso, RLS no banco, logs de auditoria) 
              para proteger seus dados contra acesso não autorizado, alteração e vazamento.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">10. Alterações neste Termo</h2>
            <p>
              Podemos atualizar este Termo de Consentimento periodicamente. As mudanças serão informadas com 30 dias 
              de antecedência e publicadas em gestorfest.com/termo-de-consentimento.
            </p>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermoDeConsentimento;
