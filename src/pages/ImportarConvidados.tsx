
import { useParams } from "react-router-dom";
import Footer from "@/components/Footer";
import ImportHeader from "@/components/import/ImportHeader";
import ImportCard from "@/components/import/ImportCard";
import ImportXLSX from "@/components/ImportXLSX";
import ImportHistoryDashboard from "@/components/import/ImportHistoryDashboard";
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
    previewData,
    showPreview,
    validateFile,
    handleFileSelected,
    handleImportContacts,
    cancelImport,
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

        <ImportXLSX onUpload={(rows, uploadedFile) => {
          console.log("Rows received from XLSX component:", rows);
          handleFileSelected(uploadedFile, rows);
        }} />

        <ImportCard
          file={file}
          failures={failures}
          validating={validating}
          importing={importing}
          showPreview={showPreview}
          previewData={previewData}
          onFileSelected={handleFileSelected}
          onValidate={validateFile}
          onImport={handleImportContacts}
          onCancel={cancelImport}
          onRemoveFile={removeFile}
        />

        {eventoId && (
          <ImportHistoryDashboard eventoId={eventoId} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ImportarConvidados;
