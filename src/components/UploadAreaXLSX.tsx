
import { useState, useRef } from "react";
import { Upload, X, FileText, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadAreaXLSXProps {
  onFileSelected: (file: File) => void;
  isLoading?: boolean;
  className?: string;
  accept?: string;
}

const UploadAreaXLSX = ({
  onFileSelected,
  isLoading = false,
  className,
  accept = ".xlsx"
}: UploadAreaXLSXProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateFile = (file: File) => {
    // Check if file is an Excel file
    if (!file.name.endsWith('.xlsx')) {
      setError("O arquivo deve estar no formato Excel (.xlsx).");
      return false;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("O arquivo não pode ser maior que 5MB.");
      return false;
    }
    
    setError(null);
    return true;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
        onFileSelected(droppedFile);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        onFileSelected(selectedFile);
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div
        className={cn(
          "w-full border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragging ? "border-primary-lighter bg-primary-lighter/5" : "border-gray-300",
          error ? "border-red-300 bg-red-50" : "",
          file ? "bg-gray-50" : "",
          "hover:bg-gray-50",
          className
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!file ? handleButtonClick : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
          disabled={isLoading}
        />

        {file ? (
          <div className="flex flex-col items-center">
            <div className="bg-primary-lighter/10 p-3 rounded-full mb-4">
              <FileText className="h-8 w-8 text-primary-lighter" />
            </div>
            <p className="font-medium text-lg mb-1">{file.name}</p>
            <p className="text-gray-500 text-sm mb-4">
              {(file.size / 1024).toFixed(2)} KB
            </p>
            <div className="flex gap-3">
              {!isLoading && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                >
                  <X className="h-4 w-4 mr-1" /> Remover arquivo
                </Button>
              )}
              <Button 
                type="button" 
                size="sm"
                disabled={isLoading}
              >
                {isLoading ? "Processando..." : "Processar Excel"}
              </Button>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center">
            <div className="bg-red-100 p-3 rounded-full mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-red-600 font-medium mb-2">Erro ao selecionar arquivo</p>
            <p className="text-red-500 text-sm mb-4">{error}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setError(null);
              }}
            >
              Tentar novamente
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="bg-primary-lighter/10 p-3 rounded-full mb-4">
              <Upload className="h-8 w-8 text-primary-lighter" />
            </div>
            <p className="font-medium text-lg mb-1">Arraste e solte seu arquivo Excel aqui</p>
            <p className="text-gray-500 text-sm mb-4">
              ou clique para selecionar um arquivo
            </p>
            <p className="text-gray-400 text-xs max-w-md">
              O arquivo deve estar no formato Excel (.xlsx) com as colunas: nome_convidado, telefone, observacao
            </p>
          </div>
        )}
      </div>

      {file && (
        <div className="mt-4 text-sm text-gray-500 flex items-center">
          <Check className="h-4 w-4 mr-1 text-green-500" />
          Arquivo pronto para processamento
        </div>
      )}
    </div>
  );
};

export default UploadAreaXLSX;
