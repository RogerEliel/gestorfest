// components/ImportXLSX.tsx
import { useToast } from '@/components/ui/use-toast';

declare const XLSX: any;

export default function ImportXLSX({ onData }) {
  const { toast } = useToast();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target?.result, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(ws);
        onData(data);
      } catch {
        toast({ title: 'Erro ao ler XLSX', description: 'O arquivo pode estar corrompido.', variant:'destructive' });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return <input type="file" accept=".xlsx" onChange={handleFile} />;
}
