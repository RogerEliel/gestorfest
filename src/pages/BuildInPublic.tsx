
import { useEffect, useState } from "react";
import { marked } from "marked";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Update {
  date: string;
  title: string;
  content: string;
  type: 'release' | 'feature' | 'blog';
}

const BuildInPublic = () => {
  const [updates, setUpdates] = useState<Update[]>([
    {
      date: '2025-05-01',
      title: 'Lançamento do MVP da GestorFest',
      content: `
## O que há de novo

Estamos empolgados em anunciar o lançamento do MVP da plataforma GestorFest, focado na Persona 2 (Mães Organizadas) com o fluxo de RSVP automatizado.

### Principais recursos incluem:
- Criação e gerenciamento de eventos
- Importação de listas de convidados
- Envio automático de convites
- Monitoramento de confirmações em tempo real
- Painel de controle centralizado

Agradecemos a todos os beta testers que têm nos ajudado a melhorar a plataforma!
      `,
      type: 'release'
    },
    {
      date: '2025-04-15',
      title: 'Nova funcionalidade de RSVP via WhatsApp',
      content: `
Acabamos de implementar a funcionalidade de RSVP via WhatsApp, que permite aos convidados confirmarem sua presença diretamente pelo aplicativo de mensagens, sem necessidade de acessar um link externo.

Este recurso foi uma das solicitações mais frequentes dos nossos beta testers, especialmente para eventos familiares onde muitos convidados têm dificuldade com links.

Estamos monitorando as taxas de resposta e até agora estamos vendo um aumento de 35% nas confirmações quando comparado com o método anterior!
      `,
      type: 'feature'
    },
    {
      date: '2025-03-28',
      title: 'Otimizações de UX baseadas em feedback',
      content: `
Com base no feedback dos usuários, implementamos várias melhorias na experiência do usuário:

1. **Fluxo de importação simplificado** - Reduzimos de 5 para 3 etapas o processo de importar convidados
2. **Novo tema visual** - Adicionamos opções de customização de cores para os convites
3. **Dashboard aprimorado** - Agora com gráficos mais intuitivos e informações em tempo real
4. **Performance** - Reduzimos o tempo de carregamento inicial em 40%

Todas essas alterações foram resultado direto de conversas com nossos usuários iniciais. Continuem enviando feedback!
      `,
      type: 'feature'
    },
    {
      date: '2025-03-10',
      title: 'Beta fechado iniciado',
      content: `
Hoje iniciamos o beta fechado da plataforma GestorFest com um grupo seleto de 15 organizadoras de eventos.

Nosso foco inicial é na experiência de criação de eventos e no fluxo de envio de convites. Durante as próximas duas semanas, estaremos coletando feedback e fazendo ajustes rápidos baseados nas experiências reais de uso.

Métricas iniciais:
- Tempo médio para criar um evento: 3min20s
- Taxa de sucesso no envio de convites: 96%
- NPS atual: 8.5/10

Se você deseja participar do beta, entre na lista de espera!
      `,
      type: 'release'
    },
    {
      date: '2025-02-25',
      title: 'Primeiras impressões do protótipo',
      content: `
Acabamos de concluir a primeira rodada de testes com o protótipo de alta fidelidade da plataforma GestorFest. Entrevistamos 8 potenciais usuárias da Persona 2 (Mães Organizadoras) e os resultados foram muito promissores.

Principais insights:
- A funcionalidade mais valorizada foi a confirmação automatizada via WhatsApp
- O painel de controle foi considerado muito intuitivo
- 7 de 8 entrevistadas afirmaram que usariam a plataforma para seus próximos eventos
- Principal ponto de melhoria: adicionar opções para personalização visual dos convites

Estamos incorporando esses feedbacks para o lançamento do beta fechado em breve!
      `,
      type: 'blog'
    }
  ]);

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
          Build in Public
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Acompanhe nosso progresso no desenvolvimento do GestorFest. 
          Compartilhamos atualizações, aprendizados e métricas em tempo real.
        </p>
      </div>

      <div className="space-y-8">
        {updates.map((update, index) => (
          <Card key={index} className="border-primary-lighter/20">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-bold">{update.title}</CardTitle>
                  <CardDescription>
                    {new Date(update.date).toLocaleDateString('pt-BR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </CardDescription>
                </div>
                <span className={`
                  px-3 py-1 rounded-full text-sm font-medium
                  ${update.type === 'release' ? 'bg-green-100 text-green-800' : ''}
                  ${update.type === 'feature' ? 'bg-blue-100 text-blue-800' : ''}
                  ${update.type === 'blog' ? 'bg-purple-100 text-purple-800' : ''}
                `}>
                  {update.type === 'release' ? 'Lançamento' : ''}
                  {update.type === 'feature' ? 'Recurso' : ''}
                  {update.type === 'blog' ? 'Blog' : ''}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div 
                className="prose prose-sm max-w-none" 
                dangerouslySetInnerHTML={{ __html: marked(update.content) }}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h2 className="text-2xl font-bold mb-4">Participe do Beta</h2>
        <p className="mb-6">
          Quer ser um dos primeiros a experimentar o GestorFest? Inscreva-se para participar do nosso programa de beta testers e ajude a moldar o futuro da plataforma.
        </p>
        <a 
          href="https://forms.gle/example" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block bg-primary hover:bg-primary/80 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Inscrever-se como Beta Tester
        </a>
      </div>
    </div>
  );
};

export default BuildInPublic;
