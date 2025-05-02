
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DataItem {
  name: string;
  value: number;
  color: string;
}

interface GraphPieProps {
  data: DataItem[];
  title?: string;
}

const GraphPie = ({ data, title }: GraphPieProps) => {
  // Filter out items with zero value to avoid empty segments in the pie chart
  const filteredData = data.filter(item => item.value > 0);
  
  // Calculate total for percentage display
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Custom tooltip to show percentage
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const percentage = ((item.value / total) * 100).toFixed(1);
      
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium">{`${item.name}: ${item.value}`}</p>
          <p className="text-gray-600">{`${percentage}% do total`}</p>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="w-full h-[300px]">
      {title && (
        <h3 className="text-center font-medium mb-4">{title}</h3>
      )}
      
      {filteredData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={filteredData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {filteredData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-500">Sem dados para exibir</p>
        </div>
      )}
    </div>
  );
};

export default GraphPie;
