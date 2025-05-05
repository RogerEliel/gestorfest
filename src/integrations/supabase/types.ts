export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      auditoria_importacoes: {
        Row: {
          created_at: string
          data_importacao: string
          detalhes_falhas: Json | null
          evento_id: string
          id: string
          registros_falha: number
          registros_importados: number
          total_registros: number
          updated_at: string
          usuario_id: string
        }
        Insert: {
          created_at?: string
          data_importacao?: string
          detalhes_falhas?: Json | null
          evento_id: string
          id?: string
          registros_falha: number
          registros_importados: number
          total_registros: number
          updated_at?: string
          usuario_id: string
        }
        Update: {
          created_at?: string
          data_importacao?: string
          detalhes_falhas?: Json | null
          evento_id?: string
          id?: string
          registros_falha?: number
          registros_importados?: number
          total_registros?: number
          updated_at?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "auditoria_importacoes_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos"
            referencedColumns: ["id"]
          },
        ]
      }
      convidados: {
        Row: {
          criado_em: string | null
          evento_id: string
          id: string
          nome: string
          observacao: string | null
          telefone: string
        }
        Insert: {
          criado_em?: string | null
          evento_id: string
          id?: string
          nome: string
          observacao?: string | null
          telefone: string
        }
        Update: {
          criado_em?: string | null
          evento_id?: string
          id?: string
          nome?: string
          observacao?: string | null
          telefone?: string
        }
        Relationships: [
          {
            foreignKeyName: "convidados_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos"
            referencedColumns: ["id"]
          },
        ]
      }
      convites: {
        Row: {
          created_at: string
          enviado_em: string | null
          evento_id: string
          id: string
          mensagem_personalizada: string | null
          nome_convidado: string
          respondido_em: string | null
          responsavel_id: string | null
          resposta: string | null
          status: Database["public"]["Enums"]["status_convite"]
          telefone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          enviado_em?: string | null
          evento_id: string
          id?: string
          mensagem_personalizada?: string | null
          nome_convidado: string
          respondido_em?: string | null
          responsavel_id?: string | null
          resposta?: string | null
          status?: Database["public"]["Enums"]["status_convite"]
          telefone: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          enviado_em?: string | null
          evento_id?: string
          id?: string
          mensagem_personalizada?: string | null
          nome_convidado?: string
          respondido_em?: string | null
          responsavel_id?: string | null
          resposta?: string | null
          status?: Database["public"]["Enums"]["status_convite"]
          telefone?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "convites_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "convites_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      eventos: {
        Row: {
          created_at: string
          data_evento: string
          id: string
          local: string
          nome: string
          slug: string
          updated_at: string
          usuario_id: string
        }
        Insert: {
          created_at?: string
          data_evento: string
          id?: string
          local: string
          nome: string
          slug: string
          updated_at?: string
          usuario_id: string
        }
        Update: {
          created_at?: string
          data_evento?: string
          id?: string
          local?: string
          nome?: string
          slug?: string
          updated_at?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "eventos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          id: string
          updated_at: string
          usuario_id: string | null
        }
        Insert: {
          id: string
          updated_at?: string
          usuario_id?: string | null
        }
        Update: {
          id?: string
          updated_at?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          created_at: string
          email: string
          id: string
          nome: string
          telefone: string | null
          tipo: Database["public"]["Enums"]["tipo_usuario"]
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          nome: string
          telefone?: string | null
          tipo?: Database["public"]["Enums"]["tipo_usuario"]
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          nome?: string
          telefone?: string | null
          tipo?: Database["public"]["Enums"]["tipo_usuario"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_unique_slug: {
        Args: { event_name: string }
        Returns: string
      }
      validar_cpf: {
        Args: { cpf: string }
        Returns: boolean
      }
    }
    Enums: {
      status_convite: "pendente" | "confirmado" | "recusado" | "conversar"
      tipo_usuario: "admin" | "cliente"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      status_convite: ["pendente", "confirmado", "recusado", "conversar"],
      tipo_usuario: ["admin", "cliente"],
    },
  },
} as const
