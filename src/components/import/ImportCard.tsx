
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UploadAreaXLSX from "@/components/UploadAreaXLSX";
import ImportErrorDisplay from "./ImportErrorDisplay";
import SelectedFileDisplay from "./SelectedFileDisplay";

interface ImportError {
  row: number;
  error: string;
}

interface ImportCardProps {
  file: File | null;
  failures: ImportError[];
  validating: boolean;
  importing: boolean;
  onFileSelected: (file: File) => void;
  onImport: () => void;
  onRemoveFile: () => void;
}

const ImportCard = ({
  file,
  failures,
  validating,
  importing,
  onFileSelected,
  onImport,
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
        <UploadAreaXLSX
          onFileSelected={onFileSelected}
          isLoading={validating}
          accept=".xlsx"
        />
        
        <ImportErrorDisplay failures={failures} />
        
        {file && (
          <SelectedFileDisplay 
            file={file}
            importing={importing}
            onRemoveFile={onRemoveFile}
            onImport={onImport}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ImportCard;
