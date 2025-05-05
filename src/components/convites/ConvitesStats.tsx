
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ConvitesStatsProps {
  confirmados: number;
  recusados: number;
  pendentes: number;
  conversas: number;
  totalConvites: number;
}

const ConvitesStats: React.FC<ConvitesStatsProps> = ({
  confirmados,
  recusados,
  pendentes,
  conversas,
  totalConvites,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card className="bg-green-50">
        <CardHeader className="py-2">
          <CardTitle className="text-sm font-medium">Confirmados</CardTitle>
        </CardHeader>
        <CardContent className="pb-2 pt-0">
          <p className="text-2xl font-bold">{confirmados}</p>
          <p className="text-xs text-muted-foreground">
            {totalConvites > 0 ? Math.round(confirmados / totalConvites * 100) : 0}% do total
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-red-50">
        <CardHeader className="py-2">
          <CardTitle className="text-sm font-medium">Recusados</CardTitle>
        </CardHeader>
        <CardContent className="pb-2 pt-0">
          <p className="text-2xl font-bold">{recusados}</p>
          <p className="text-xs text-muted-foreground">
            {totalConvites > 0 ? Math.round(recusados / totalConvites * 100) : 0}% do total
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-50">
        <CardHeader className="py-2">
          <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
        </CardHeader>
        <CardContent className="pb-2 pt-0">
          <p className="text-2xl font-bold">{pendentes}</p>
          <p className="text-xs text-muted-foreground">
            {totalConvites > 0 ? Math.round(pendentes / totalConvites * 100) : 0}% do total
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-blue-50">
        <CardHeader className="py-2">
          <CardTitle className="text-sm font-medium">Conversas</CardTitle>
        </CardHeader>
        <CardContent className="pb-2 pt-0">
          <p className="text-2xl font-bold">{conversas}</p>
          <p className="text-xs text-muted-foreground">
            {totalConvites > 0 ? Math.round(conversas / totalConvites * 100) : 0}% do total
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConvitesStats;
