
import { Helmet } from "react-helmet";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const TermosDeUso = () => {
  const dataAtualizacao = new Date().toLocaleDateString('pt-BR');

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Termo de Uso do GestorFest</title>
        <meta name="description" content="Termos de uso da plataforma GestorFest para gerenciamento de eventos e convites." />
      </Helmet>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="prose max-w-none">
          <h1 className="text-3xl font-bold mb-6">Termos de Uso do GestorFest</h1>
          
          <p className="mb-4"><strong>Última atualização:</strong> {dataAtualizacao}</p>

          <hr className="my-6" />

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">1. Preâmbulo e Aceitação dos Termos</h2>
            <p>
              <strong>GESTORFEST SERVIÇOS DIGITAIS LTDA.</strong> ("GestorFest" ou "Contratada") e o Usuário ("Contratante") celebram este Termo de Uso, 
              que regula o acesso e a utilização da plataforma GestorFest (https://gestorfest.com.br), incluindo todos os subdomínios e módulos 
              especializados (Fotógrafos, Assessoria, Transporte etc.).
            </p>
            <p>
              Ao acessar ou utilizar o GestorFest, você concorda, de forma imediata, irrevogável e irretratável, com todos os termos 
              aqui descritos. Se não concordar, por favor, não utilize os nossos serviços.
            </p>
          </section>

          <hr className="my-6" />

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">2. Descrição do Serviço</h2>
            <p>
              O GestorFest é uma plataforma de gerenciamento de eventos e convites que permite aos usuários:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Criar e gerenciar eventos digitais;</li>
              <li>Importar listas de convidados e enviar convites (automáticos ou manuais);</li>
              <li>Controlar confirmações de presença (RSVP);</li>
              <li>Acessar painel de monitoramento de status de convites;</li>
              <li>(Futuros módulos) Conectar com fotógrafos, buffet, assessoria e demais prestadores.</li>
            </ul>
          </section>

          <hr className="my-6" />

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">3. Registro, Cadastro e Conta</h2>
            <ol className="list-decimal pl-6 mb-4">
              <li className="mb-2">
                Para usar o GestorFest, é obrigatório criar uma conta com:
                <ul className="list-disc pl-6 mt-2">
                  <li>Nome completo;</li>
                  <li>E‑mail válido;</li>
                  <li><strong>CPF</strong> (pessoa física) ou <strong>CNPJ</strong> (pessoa jurídica);</li>
                  <li>Senha (mínimo 8 caracteres, incluindo letra, número e símbolo especial).</li>
                </ul>
              </li>
              <li className="mb-2">
                No registro, o Contratante manifesta sua concordância com este Termo de Uso, com a Política de Privacidade 
                e com o Termo de Consentimento para Tratamento de Dados.
              </li>
              <li className="mb-2">
                Você é responsável por manter a confidencialidade de suas credenciais e por todas as atividades realizadas em sua conta.
              </li>
              <li className="mb-2">
                Notifique imediatamente o GestorFest sobre qualquer uso não autorizado da sua conta.
              </li>
            </ol>
          </section>

          <hr className="my-6" />

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">4. Objeto do Contrato e Licença de Uso</h2>
            <ol className="list-decimal pl-6 mb-4">
              <li className="mb-2">
                A GestorFest concede ao Contratante uma licença limitada, não exclusiva e revogável para uso da plataforma durante a vigência deste Termo.
              </li>
              <li className="mb-2">
                O acesso aos eventos criados permanecerá disponível por até <strong>5 anos</strong> após a data de encerramento de cada evento, 
                podendo ser renovado mediante solicitação.
              </li>
            </ol>
          </section>

          <hr className="my-6" />

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">5. Proteção e Compartilhamento de Dados</h2>
            <ol className="list-decimal pl-6 mb-4">
              <li className="mb-2">
                Coletamos e tratamos dados pessoais conforme a nossa Política de Privacidade e a Lei nº 13.709/2018 (LGPD).
              </li>
              <li className="mb-2">
                Seus dados podem ser compartilhados, quando necessário, com:
                <ul className="list-disc pl-6 mt-2">
                  <li>Parceiros e fornecedores (e.g. Twilio, Supabase, serviços de e‑mail), sob contratos de confidencialidade;</li>
                  <li>Autoridades públicas, quando exigido por lei.</li>
                </ul>
              </li>
              <li className="mb-2">
                Esse compartilhamento visa exclusivamente a prestação do serviço contratado.
              </li>
            </ol>
          </section>

          <hr className="my-6" />

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">6. Uso Aceitável e Restrições</h2>
            <ol className="list-decimal pl-6 mb-4">
              <li className="mb-2">
                O Contratante concorda em utilizar o GestorFest apenas para fins lícitos, respeitando direitos de terceiros e a legislação vigente.
              </li>
              <li className="mb-2">
                É proibido:
                <ul className="list-disc pl-6 mt-2">
                  <li>Enviar conteúdo discriminatório, ofensivo ou ilícito;</li>
                  <li>Utilizar a plataforma para fins de spam, phishing ou fraude;</li>
                  <li>Distribuir vírus, malware ou qualquer software nocivo.</li>
                </ul>
              </li>
              <li className="mb-2">
                O GestorFest reserva-se o direito de suspender ou encerrar contas que violem estas regras.
              </li>
            </ol>
          </section>

          <hr className="my-6" />

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">7. Cancelamento, Suspensão e Inatividade</h2>
            <ol className="list-decimal pl-6 mb-4">
              <li className="mb-2">
                A GestorFest poderá suspender ou encerrar o acesso do Contratante, sem aviso prévio, nas seguintes hipóteses:
                <ul className="list-disc pl-6 mt-2">
                  <li>Inatividade superior a <strong>6 meses</strong>;</li>
                  <li>Violação destes Termos;</li>
                  <li>Solicitação expressa do Contratante.</li>
                </ul>
              </li>
              <li className="mb-2">
                Em caso de suspensão, o Contratante será notificado e terá <strong>30 dias</strong> para regularizar a situação.
              </li>
            </ol>
          </section>

          <hr className="my-6" />

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">8. Alterações nos Termos</h2>
            <p>
              A GestorFest pode alterar este Termo a qualquer momento, mediante publicação na plataforma. As mudanças entram em vigor imediatamente. 
              O uso contínuo após publicação constitui aceitação das novas condições.
            </p>
          </section>

          <hr className="my-6" />

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">9. Política de Cookies</h2>
            <p>
              Para saber como utilizamos cookies, consulte nossa <Link to="/politica-de-cookies" className="text-blue-600 hover:underline">Política de Cookies</Link>. 
              Ao continuar navegando, você concorda com o uso de cookies conforme descrito.
            </p>
          </section>

          <hr className="my-6" />

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">10. Foro e Legislação Aplicável</h2>
            <p>
              Este Termo é regido pelas leis brasileiras, em especial a LGPD e o Código Civil. Fica eleito o foro da Comarca de <strong>Salvador/BA</strong> 
              para dirimir quaisquer controvérsias.
            </p>
          </section>

          <hr className="my-6" />

          <section className="mb-6">
            <p>
              <strong>Contato:</strong><br />
              E‑mail: contato@gestorfest.com.br
            </p>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermosDeUso;
