
import { useParams } from "react-router-dom";
import Footer from "@/components/Footer";
import ImportHeader from "@/components/import/ImportHeader";
import ImportCard from "@/components/import/ImportCard";
import { useImportConvites } from "@/hooks/useImportConvites";
import { useEventoDetails } from "@/hooks/useEventoDetails";

const ImportarConvidados = () => {
  const { id: eventoId } = useParams();
  const { evento } = useEventoDetails(eventoId);
  const { 
    file, 
    failures, 
    validating, 
    importing, 
    handleFileSelected, 
    handleImportContacts,
    removeFile
  } = useImportConvites(eventoId);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto p-4 space-y-6">
        <ImportHeader 
          eventoId={eventoId} 
          eventoNome={evento?.nome}
          eventoData={evento?.data_evento} 
        />

        <ImportCard
          file={file}
          failures={failures}
          validating={validating}
          importing={importing}
          onFileSelected={handleFileSelected}
          onImport={handleImportContacts}
          onRemoveFile={removeFile}
        />
      </main>
      <Footer />
    </div>
  );
};

export default ImportarConvidados;
