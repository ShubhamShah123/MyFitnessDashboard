import { useEffect, useState } from "react";
import BigChartBox from "../../components/bigChartBox/BigChartBox";
import PieChartBox from "../../components/pieChartBox/PieChartBox";
import TopBox from "../../components/topBox/TopBox";
import "./home.scss";
import { testGetWeights } from "../../url";

interface MonthlyApiItem {
  month: string;          // e.g., "2025-10"
  averageWeight: number;
}

interface WeeklyApiItem {
  week_number: number;    // e.g., 1, 2, 3...
  average_weight: number;
}

const Home = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(testGetWeights);
        const result = await res.json();
        console.log("MOnth Result: ",result)
        const formattedData = result.monthly.map((item: MonthlyApiItem) => {
          console.log("Item: ", item)
          const [year, month] = item.month.split('-')
          console.log("Year: "+year+" | Month: "+month)
          // const monthLabel = date.toLocaleString("default", { month: "short" }); // e.g., "Feb"
          const date = new Date(Number(year), Number(month) - 1); // months are 0-based in JS
          console.log("Date: ",date)
          const monthLabel = date.toLocaleString("default", { month: "short" }); // "Feb"
          // console.log("Ml1: ",monthLabel1)
          // const monthLabel = "default";
          console.log("MonthLabel: ",monthLabel)
          return {
            name: monthLabel,
            weight: item.averageWeight,
          };
        });
        console.log(result)      
        setMonthlyData(formattedData);
        const weekly = result.weekly.map((item: WeeklyApiItem) => ({
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
