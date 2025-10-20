import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface BigChartBoxProps {
  title: string;
  data: any[];       // or better: define the shape of each data object
  dataKey: string;
}

const BigChartBox = ({ title, data, dataKey }: BigChartBoxProps) => {
  return (
    <div className="bigChartBox">
      <h2>{title}</h2><br/>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey={dataKey} stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BigChartBox;
