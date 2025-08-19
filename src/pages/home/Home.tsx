import { useEffect, useState } from "react";
import BigChartBox from "../../components/bigChartBox/BigChartBox";
import PieChartBox from "../../components/pieChartBox/PieChartBox";
import TopBox from "../../components/topBox/TopBox";
import "./home.scss";
import { testGetWeights } from "../../url";

const Home = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(testGetWeights);
        const result = await res.json();
        const formattedData = result.monthly.map((item) => {
          const date = new Date(item.month + "-01");
          const monthLabel = date.toLocaleString("default", { month: "short" }); // e.g., "Feb"
          return {
            name: monthLabel,
            weight: item.averageWeight,
          };
        });
        console.log(result)      
        setMonthlyData(formattedData);
        const weekly = result.weekly.map(item => ({
          name: `W${item.week_number}`, // or item.date_range if you prefer
          weight: item.average_weight
        }));
        setWeeklyData(weekly)
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home">
      <div className="box box1">
        <TopBox />
      </div>

      <div className="box box4">
        <PieChartBox />
      </div>

      {/* Monthly Chart */}
      <div className="box box7">
        <BigChartBox title="Monthly Average Weight" data={monthlyData} dataKey="weight" />
      </div>

      {/* Weekly Chart */}
      <div className="box box7">
        <BigChartBox title="Weekly Average Weight" data={weeklyData} dataKey="weight" />
      </div>
    </div>
  );
};

export default Home;
