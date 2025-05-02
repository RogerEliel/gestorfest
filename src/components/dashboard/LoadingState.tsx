
import { Loader2 } from "lucide-react";

const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-lg font-medium">Carregando eventos...</p>
      <p className="text-sm text-muted-foreground">
        Estamos preparando seus eventos, isso pode levar alguns segundos.
      </p>
    </div>
  );
};

export default LoadingState;
