
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UploadAreaXLSX from "@/components/UploadAreaXLSX";
import ImportErrorDisplay from "./ImportErrorDisplay";
import SelectedFileDisplay from "./SelectedFileDisplay";
import ImportDataPreview from "./ImportDataPreview";

interface ImportError {
  row: number;
  error: string;
}

interface ImportPreviewItem {
  nome_convidado: string;
  telefone: string;
  mensagem_personalizada?: string | null;
  isValid: boolean;
  error?: string;
}

interface ImportCardProps {
  file: File | null;
  failures: ImportError[];
  validating: boolean;
  importing: boolean;
  showPreview: boolean;
  previewData: ImportPreviewItem[];
  onFileSelected: (file: File) => void;
  onValidate: () => void;
  onImport: () => void;
  onCancel: () => void;
  onRemoveFile: () => void;
}

const ImportCard = ({
  file,
  failures,
  validating,
  importing,
  showPreview,
  previewData,
  onFileSelected,
  onValidate,
  onImport,
  onCancel,
  onRemoveFile
}: ImportCardProps) => {
  return (
    <Card className="bg-white shadow">
      <CardHeader>
        <CardTitle>Upload de Excel</CardTitle>
        <CardDescription>
          Faça upload de um arquivo Excel (.xlsx) contendo a lista de convidados.
          Os campos obrigatórios são nome_convidado e telefone. Campo opcional: observacao.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!showPreview && (
          <>
            <UploadAreaXLSX
              onFileSelected={onFileSelected}
              isLoading={validating}
              accept=".xlsx"
            />
            
            <ImportErrorDisplay failures={failures} />
            
            {file && (
              <SelectedFileDisplay 
                file={file}
                validating={validating}
                onRemoveFile={onRemoveFile}
                onValidate={onValidate}
              />
            )}
          </>
        )}
        
        {showPreview && (
          <ImportDataPreview
            data={previewData}
            isLoading={importing}
            onConfirm={onImport}
            onCancel={onCancel}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ImportCard;
