
import { useEffect, useState } from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

const ApiDocs = () => {
  const [spec, setSpec] = useState<any>(null);

  useEffect(() => {
    // OpenAPI specification for GestorFest API
    const openApiSpec = {
      openapi: "3.0.0",
      info: {
        title: "GestorFest API",
        description: "API para gerenciamento de eventos e convites",
        version: "1.0.0",
        contact: {
          email: "contato@gestorfest.com.br"
        }
      },
      servers: [
        {
          url: "https://gestorfest.com.br/api",
          description: "Servidor de Produção"
        },
        {
          url: "https://staging.gestorfest.com.br/api",
          description: "Servidor de Homologação"
        }
      ],
      tags: [
        {
          name: "auth",
          description: "Operações de autenticação"
        },
        {
          name: "eventos",
          description: "Gerenciamento de eventos"
        },
        {
          name: "convites",
          description: "Gerenciamento de convites"
        },
        {
          name: "dashboard",
          description: "Dados do dashboard"
        }
      ],
      paths: {
        "/auth/signup": {
          post: {
            tags: ["auth"],
            summary: "Criar nova conta de usuário",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["email", "password", "nome"],
                    properties: {
                      email: {
                        type: "string",
                        format: "email"
                      },
                      password: {
                        type: "string",
                        format: "password"
                      },
                      nome: {
                        type: "string"
                      },
                      telefone: {
                        type: "string"
                      },
                      tipo: {
                        type: "string",
                        enum: ["admin", "cliente"]
                      }
                    }
                  }
                }
              }
            },
            responses: {
              "201": {
                description: "Usuário criado com sucesso",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        message: {
                          type: "string"
                        },
                        user: {
                          $ref: "#/components/schemas/User"
                        }
                      }
                    }
                  }
                }
              },
              "400": {
                description: "Dados inválidos"
              }
            }
          }
        },
        "/auth/login": {
          post: {
            tags: ["auth"],
            summary: "Fazer login",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                      email: {
                        type: "string",
                        format: "email"
                      },
                      password: {
                        type: "string",
                        format: "password"
                      }
                    }
                  }
                }
              }
            },
            responses: {
              "200": {
                description: "Login realizado com sucesso",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        message: {
                          type: "string"
                        },
                        session: {
                          $ref: "#/components/schemas/Session"
                        },
                        user: {
                          $ref: "#/components/schemas/User"
                        }
                      }
                    }
                  }
                }
              },
              "400": {
                description: "Credenciais inválidas"
              }
            }
          }
        },
        "/eventos": {
          get: {
            tags: ["eventos"],
            summary: "Listar todos os eventos do usuário",
            security: [
              {
                bearerAuth: []
              }
            ],
            responses: {
              "200": {
                description: "Lista de eventos",
                content: {
                  "application/json": {
                    schema: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Evento"
                      }
                    }
                  }
                }
              }
            }
          },
          post: {
            tags: ["eventos"],
            summary: "Criar novo evento",
            security: [
              {
                bearerAuth: []
              }
            ],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/EventoInput"
                  }
                }
              }
            },
            responses: {
              "201": {
                description: "Evento criado com sucesso",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/Evento"
                    }
                  }
                }
              }
            }
          }
        },
        "/eventos/{id}": {
          put: {
            tags: ["eventos"],
            summary: "Atualizar evento",
            parameters: [
              {
                name: "id",
                in: "path",
                required: true,
                schema: {
                  type: "string",
                  format: "uuid"
                }
              }
            ],
            security: [
              {
                bearerAuth: []
              }
            ],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/EventoInput"
                  }
                }
              }
            },
            responses: {
              "200": {
                description: "Evento atualizado com sucesso",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/Evento"
                    }
                  }
                }
              }
            }
          },
          delete: {
            tags: ["eventos"],
            summary: "Excluir evento",
            parameters: [
              {
                name: "id",
                in: "path",
                required: true,
                schema: {
                  type: "string",
                  format: "uuid"
                }
              }
            ],
            security: [
              {
                bearerAuth: []
              }
            ],
            responses: {
              "200": {
                description: "Evento excluído com sucesso"
              }
            }
          }
        },
        "/convites/import": {
          post: {
            tags: ["convites"],
            summary: "Importar lista de convidados",
            security: [
              {
                bearerAuth: []
              }
            ],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["evento_id", "convites"],
                    properties: {
                      evento_id: {
                        type: "string",
                        format: "uuid"
                      },
                      convites: {
                        type: "array",
                        items: {
                          $ref: "#/components/schemas/ConviteInput"
                        }
                      }
                    }
                  }
                }
              }
            },
            responses: {
              "200": {
                description: "Convites importados com sucesso",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        importados: {
                          type: "integer"
                        },
                        falhas: {
                          type: "integer"
                        },
                        convites: {
                          type: "array",
                          items: {
                            $ref: "#/components/schemas/Convite"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "/convites/{id}/resposta": {
          post: {
            tags: ["convites"],
            summary: "Responder a um convite",
            parameters: [
              {
                name: "id",
                in: "path",
                required: true,
                schema: {
                  type: "string",
                  format: "uuid"
                }
              }
            ],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["status", "consentimentoDado"],
                    properties: {
                      status: {
                        type: "string",
                        enum: ["confirmado", "recusado", "pendente"]
                      },
                      resposta: {
                        type: "string"
                      },
                      consentimentoDado: {
                        type: "boolean"
                      }
                    }
                  }
                }
              }
            },
            responses: {
              "200": {
                description: "Resposta registrada com sucesso"
              }
            }
          }
        },
        "/convites/{id}/reenviar": {
          post: {
            tags: ["convites"],
            summary: "Reenviar convite",
            parameters: [
              {
                name: "id",
                in: "path",
                required: true,
                schema: {
                  type: "string",
                  format: "uuid"
                }
              }
            ],
            security: [
              {
                bearerAuth: []
              }
            ],
            responses: {
              "200": {
                description: "Convite reenviado com sucesso"
              }
            }
          }
        },
        "/dashboard": {
          get: {
            tags: ["dashboard"],
            summary: "Obter dados do dashboard",
            security: [
              {
                bearerAuth: []
              }
            ],
            responses: {
              "200": {
                description: "Dados do dashboard",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        total_eventos: {
                          type: "integer"
                        },
                        eventos_ativos: {
                          type: "integer"
                        },
                        total_convidados: {
                          type: "integer"
                        },
                        confirmacoes: {
                          type: "integer"
                        },
                        recusas: {
                          type: "integer"
                        },
                        pendentes: {
                          type: "integer"
                        },
                        eventos_recentes: {
                          type: "array",
                          items: {
                            $ref: "#/components/schemas/Evento"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      components: {
        schemas: {
          User: {
            type: "object",
            properties: {
              id: {
                type: "string",
                format: "uuid"
              },
              email: {
                type: "string",
                format: "email"
              },
              nome: {
                type: "string"
              },
              telefone: {
                type: "string"
              },
              tipo: {
                type: "string",
                enum: ["admin", "cliente"]
              }
            }
          },
          Session: {
            type: "object",
            properties: {
              access_token: {
                type: "string"
              },
              refresh_token: {
                type: "string"
              },
              expires_at: {
                type: "integer",
                format: "timestamp"
              }
            }
          },
          EventoInput: {
            type: "object",
            required: ["nome", "data_evento", "local"],
            properties: {
              nome: {
                type: "string"
              },
              data_evento: {
                type: "string",
                format: "date"
              },
              local: {
                type: "string"
              },
              descricao: {
                type: "string"
              }
            }
          },
          Evento: {
            type: "object",
            properties: {
              id: {
                type: "string",
                format: "uuid"
              },
              nome: {
                type: "string"
              },
              data_evento: {
                type: "string",
                format: "date"
              },
              local: {
                type: "string"
              },
              slug: {
                type: "string"
              },
              descricao: {
                type: "string"
              },
              total_convidados: {
                type: "integer"
              },
              total_confirmados: {
                type: "integer"
              }
            }
          },
          ConviteInput: {
            type: "object",
            required: ["nome"],
            properties: {
              nome: {
                type: "string"
              },
              telefone: {
                type: "string"
              },
              email: {
                type: "string",
                format: "email"
              }
            }
          },
          Convite: {
            type: "object",
            properties: {
              id: {
                type: "string",
                format: "uuid"
              },
              evento_id: {
                type: "string",
                format: "uuid"
              },
              nome: {
                type: "string"
              },
              telefone: {
                type: "string"
              },
              email: {
                type: "string",
                format: "email"
              },
              status: {
                type: "string",
                enum: ["confirmado", "recusado", "pendente"]
              },
              ultima_atualizacao: {
                type: "string",
                format: "date-time"
              }
            }
          }
        },
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
          }
        }
      }
    };

    setSpec(openApiSpec);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
        API Documentation
      </h1>
      
      {spec && <SwaggerUI spec={spec} />}
      
      <div className="mt-8">
        <p className="text-sm text-gray-600">
          Para mais detalhes sobre a API, consulte a documentação completa em{" "}
          <a 
            href="/docs/api.md" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary-lighter hover:underline"
          >
            /docs/api.md
          </a>
        </p>
      </div>
    </div>
  );
};

export default ApiDocs;
