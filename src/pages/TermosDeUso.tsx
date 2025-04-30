
import { Helmet } from "react-helmet";
import Footer from "@/components/Footer";

const TermosDeUso = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Termo de Uso do GestorFest</title>
        <meta name="description" content="Termos de uso da plataforma GestorFest para gerenciamento de eventos e convites." />
      </Helmet>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="prose max-w-none">
          <h1 className="text-3xl font-bold mb-6">Termo de Uso do GestorFest</h1>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e utilizar a plataforma GestorFest, você concorda com os termos e condições aqui descritos.
              Se você não concordar com qualquer parte destes termos, recomendamos que não utilize nossos serviços.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">2. Descrição do Serviço</h2>
            <p>
              O GestorFest é uma plataforma de gerenciamento de eventos e convites que permite aos usuários criar, 
              gerenciar eventos e enviar convites aos seus convidados. Nosso serviço inclui ferramentas de gestão 
              de convidados, confirmações de presença e comunicação.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">3. Registro e Conta</h2>
            <p>
              Para utilizar completamente o GestorFest, é necessário criar uma conta. Você é responsável por manter 
              a confidencialidade de sua senha e por todas as atividades que ocorrerem em sua conta. Você concorda em 
              notificar imediatamente o GestorFest sobre qualquer uso não autorizado de sua conta.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">4. Privacidade e Dados Pessoais</h2>
            <p>
              Ao utilizar o GestorFest, você concorda com nossa Política de Privacidade, que descreve como coletamos, 
              armazenamos e processamos seus dados pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD).
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">5. Uso Aceitável</h2>
            <p>
              Você concorda em utilizar o GestorFest apenas para propósitos legais e de uma maneira que não infrinja os 
              direitos de terceiros ou restrinja seu uso do serviço. O GestorFest se reserva o direito de encerrar contas 
              de usuários que violem estes termos.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">6. Alterações nos Termos</h2>
            <p>
              O GestorFest pode modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente 
              após sua publicação na plataforma. O uso contínuo do GestorFest após tais alterações constitui sua aceitação 
              dos novos termos.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">7. Contato</h2>
            <p>
              Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco pelo e-mail: 
              contato@gestorfest.com.br
            </p>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermosDeUso;
