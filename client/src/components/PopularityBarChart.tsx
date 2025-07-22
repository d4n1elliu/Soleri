import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const PopularityBarChart = ({ data }: any) => {
  const chartData = data.map((track: any) => ({
    name: track.name,
    popularity: track.popularity,
  }));

  return (
    <div className="bg-zinc-800 p-4 rounded-xl">
      <h3 className="mb-2 font-bold text-lg">Popularity Chart</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" hide />
          <YAxis />
          <Tooltip />
          <Bar dataKey="popularity" fill="#34d399" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PopularityBarChart;