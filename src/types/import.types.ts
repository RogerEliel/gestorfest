
export interface ImportError {
  row: number;
  error: string;
}

export interface ImportPreviewItem {
  nome_convidado: string;
  telefone: string;
  mensagem_personalizada?: string | null;
  isValid: boolean;
  error?: string;
}

export interface ImportResponse {
  inserted_count: number;
  failures: ImportError[];
}
