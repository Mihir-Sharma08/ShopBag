import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// const salesData = [
//   { name: "Jul", sales: 4200 },
//   { name: "Aug", sales: 3800 },
//   { name: "Sep", sales: 5100 },
//   { name: "Oct", sales: 4600 },
//   { name: "Nov", sales: 5400 },
//   { name: "Dec", sales: 7200 },
//   { name: "Jan", sales: 6100 },
//   { name: "Feb", sales: 5900 },
//   { name: "Mar", sales: 6800 },
//   { name: "Apr", sales: 6300 },
//   { name: "May", sales: 7100 },
//   { name: "Jun", sales: 7500 },
// ];

const SalesOverviewChart = () => {
  const [salesData, setSalesData] = useState([]);

  const salesOverview = async () => {
    const response = await fetch(
      "http://localhost:4000/api/v1/users/salesoverview",
      {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached

        headers: {
          "Content-Type": "application/json",
          // "Content-Type": "multipart/form-data;",
        },
      }
    );
    let res = await response.json(); // parses JSON response into native JavaScript objects
    console.log(res);
    setSalesData(res);
    // setstatus(status.map(status));

    // console.log("users", user);
  };

  useEffect(() => {
    salesOverview();
  }, []);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-lg font-medium mb-4 text-gray-100">Sales Overview</h2>

      <div className="h-80">
        <ResponsiveContainer width={"100%"} height={"100%"}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
            <XAxis dataKey={"date"} stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Line
              type="monotone"
              dataKey="totalSales"
              stroke="#6366F1"
              strokeWidth={3}
              dot={{ fill: "#6366F1", strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
export default SalesOverviewChart;
