
# Documentação da API GestorFest

Este documento descreve as endpoints disponíveis na API do GestorFest.

## Autenticação

### Criar Conta
- **URL**: `/auth/signup`
- **Método**: `POST`
- **Body**:
  ```json
  {
    "email": "usuario@exemplo.com",
    "password": "senha123",
    "nome": "Nome Completo",
    "telefone": "+5511999999999",
    "tipo": "cliente"
  }
  ```
- **Resposta de Sucesso**: 
  ```json
  {
    "message": "Usuário criado com sucesso",
    "user": { /* dados do usuário */ }
  }
  ```

### Login
- **URL**: `/auth/login`
- **Método**: `POST`
- **Body**:
  ```json
  {
    "email": "usuario@exemplo.com",
    "password": "senha123"
  }
  ```
- **Resposta de Sucesso**:
  ```json
  {
    "message": "Login realizado com sucesso",
    "session": { /* dados da sessão */ },
    "user": { /* dados do usuário */ }
  }
  ```

## Eventos

### Listar Eventos
- **URL**: `/eventos`
- **Método**: `GET`
- **Headers**: Requer autenticação
- **Resposta de Sucesso**:
  ```json
  [
    {
      "id": "uuid-do-evento",
      "nome": "Nome do Evento",
      "data_evento": "2023-06-15",
      "local": "Local do Evento",
      "slug": "nome-do-evento",
      "total_convidados": 50,
      "total_confirmados": 30
    }
  ]
  ```

### Criar Evento
- **URL**: `/eventos`
- **Método**: `POST`
- **Headers**: Requer autenticação
- **Body**:
  ```json
  {
    "nome": "Nome do Evento",
    "data_evento": "2023-06-15",
    "local": "Local do Evento",
    "descricao": "Descrição do evento"
  }
  ```
- **Resposta de Sucesso**:
  ```json
  {
    "id": "uuid-do-evento",
    "nome": "Nome do Evento",
    "data_evento": "2023-06-15",
    "local": "Local do Evento",
    "slug": "nome-do-evento",
    "descricao": "Descrição do evento"
  }
  ```

### Atualizar Evento
- **URL**: `/eventos/{id}`
- **Método**: `PUT`
- **Headers**: Requer autenticação
- **Body**:
  ```json
  {
    "nome": "Nome Atualizado",
    "data_evento": "2023-07-15",
    "local": "Local Atualizado",
    "descricao": "Descrição atualizada"
  }
  ```
- **Resposta de Sucesso**:
  ```json
  {
    "id": "uuid-do-evento",
    "nome": "Nome Atualizado",
    "data_evento": "2023-07-15",
    "local": "Local Atualizado",
    "slug": "nome-atualizado",
    "descricao": "Descrição atualizada"
  }
  ```

### Excluir Evento
- **URL**: `/eventos/{id}`
- **Método**: `DELETE`
- **Headers**: Requer autenticação
- **Resposta de Sucesso**:
  ```json
  {
    "message": "Evento excluído com sucesso"
  }
  ```

## Convites

### Importar Convites
- **URL**: `/convites/import`
- **Método**: `POST`
- **Headers**: Requer autenticação
- **Body**:
  ```json
  {
    "evento_id": "uuid-do-evento",
    "convites": [
      {
        "nome": "Nome do Convidado",
        "telefone": "+5511999999999",
        "email": "convidado@exemplo.com"
      }
    ]
  }
  ```
- **Resposta de Sucesso**:
  ```json
  {
    "importados": 1,
    "falhas": 0,
    "convites": [ /* lista de convites criados */ ]
  }
  ```

### Responder ao Convite
- **URL**: `/convites/{id}/resposta`
- **Método**: `POST`
- **Body**:
  ```json
  {
    "status": "confirmado",
    "resposta": "Observação opcional",
    "consentimentoDado": true
  }
  ```
- **Resposta de Sucesso**:
  ```json
  {
    "message": "Resposta registrada com sucesso",
    "convite": { /* dados do convite */ }
  }
  ```

### Reenviar Convite
- **URL**: `/convites/{id}/reenviar`
- **Método**: `POST`
- **Headers**: Requer autenticação
- **Resposta de Sucesso**:
  ```json
  {
    "message": "Convite reenviado com sucesso"
  }
  ```

## Dashboard

### Dados do Dashboard
- **URL**: `/dashboard`
- **Método**: `GET`
- **Headers**: Requer autenticação
- **Resposta de Sucesso**:
  ```json
  {
    "total_eventos": 5,
    "eventos_ativos": 3,
    "total_convidados": 150,
    "confirmacoes": 90,
    "recusas": 20,
    "pendentes": 40,
    "eventos_recentes": [ /* lista de eventos recentes */ ]
  }
  ```
