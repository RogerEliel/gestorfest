
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Footer from "@/components/Footer";
import EventoForm from "@/components/EventoForm";
import { useEventoForm } from "@/hooks/useEventoForm";

const NovoEvento = () => {
  const navigate = useNavigate();
  const { form, loading, onSubmit } = useEventoForm();

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Novo Evento</CardTitle>
            <CardDescription className="text-center">
              Crie um novo evento para começar a enviar convites
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EventoForm 
              form={form} 
              loading={loading} 
              onSubmit={onSubmit} 
              onCancel={handleCancel} 
            />
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default NovoEvento;
