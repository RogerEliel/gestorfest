
# GestorFest - Documentação

GestorFest é uma plataforma completa para gerenciamento de eventos e convites, permitindo que organizadores de eventos criem, gerenciem e monitorem eventos e convites de forma eficiente.

## Setup do Projeto

### Pré-requisitos
- Node.js (v16 ou superior)
- npm ou yarn 
- Conta Supabase

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/gestorfest.git

# Entre no diretório do projeto
cd gestorfest

# Instale as dependências
npm install
```

### Configuração das Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
VITE_SUPABASE_URL=sua-url-do-supabase
VITE_SUPABASE_ANON_KEY=sua-chave-anon-do-supabase
VITE_SENTRY_DSN=sua-chave-dsn-do-sentry
VITE_GA_MEASUREMENT_ID=seu-id-do-google-analytics
```

## Executando o Projeto

### Ambiente Local
```bash
# Inicie o projeto em modo de desenvolvimento
npm run dev
```

### Testes
```bash
# Execute os testes E2E
npm run test:e2e

# Execute os testes unitários
npm run test
```

### Build para Produção
```bash
# Gere o build de produção
npm run build

# Pré-visualize o build de produção localmente
npm run preview
```

## Deploy

### Deploy para Homologação
O deploy para homologação é feito automaticamente quando há um push para a branch `develop`.

### Deploy para Produção
O deploy para produção é feito automaticamente quando há um push para a branch `main`.

## Estrutura de Diretórios

```
gestorfest/
├── docs/                # Documentação
├── public/              # Arquivos públicos
├── src/                 # Código-fonte
│   ├── components/      # Componentes React
│   ├── contexts/        # Contexts da aplicação
│   ├── hooks/           # Custom hooks
│   ├── integrations/    # Integrações com serviços externos
│   ├── pages/           # Páginas da aplicação
│   └── utils/           # Funções utilitárias
├── supabase/            # Funções Edge e configurações do Supabase
│   └── functions/       # Funções Edge
└── cypress/             # Testes E2E
```

## API

Consulte a documentação completa da API em `/api-docs` na aplicação em execução.
