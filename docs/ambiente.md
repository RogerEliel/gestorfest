
# Guia de Variáveis de Ambiente

Este documento detalha as variáveis de ambiente utilizadas no projeto GestorFest.

## Variáveis Essenciais

### Supabase
- `VITE_SUPABASE_URL`: URL do projeto Supabase
- `VITE_SUPABASE_ANON_KEY`: Chave anônima do Supabase

### Sentry
- `VITE_SENTRY_DSN`: DSN do Sentry para monitoramento de erros

### Analytics
- `VITE_GA_MEASUREMENT_ID`: ID de medição do Google Analytics
- `VITE_PLAUSIBLE_DOMAIN`: Domínio para analytics do Plausible (opcional)

## Configuração por Ambiente

### Local
Para desenvolvimento local, crie um arquivo `.env.local` com as variáveis necessárias.

### Homologação
Para o ambiente de homologação, configure as variáveis no painel do provedor de hospedagem ou use um arquivo `.env.staging`.

### Produção
Para o ambiente de produção, configure as variáveis no painel do provedor de hospedagem ou use um arquivo `.env.production`.

## Exemplo de Configuração

```env
# Supabase
VITE_SUPABASE_URL=https://xyzabcdef.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Sentry
VITE_SENTRY_DSN=https://abcdef123456@o123456.ingest.sentry.io/123456

# Analytics
VITE_GA_MEASUREMENT_ID=G-ABC123DEF45
```

## Observações Importantes

- Nunca compartilhe suas chaves de API ou outras variáveis sensíveis no repositório.
- Utilize `.env.example` para mostrar quais variáveis são necessárias, mas sem valores reais.
- Em ambientes de CI/CD, configure as variáveis no próprio sistema de pipeline.
