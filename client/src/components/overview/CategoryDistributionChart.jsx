import { motion } from "framer-motion";
import { useState, useEffect } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// const categoryData = [
//   { name: "Jewelery", value: 4500 },
//   { name: "Electronics", value: 3200 },
//   { name: "Men `s Clothing", value: 2800 },
//   { name: "Women `s Clothing", value: 2100 },
// ];

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

const CategoryDistributionChart = () => {
  const [mencloth, setmencloth] = useState(0);
  const [womencloth, setwomencloth] = useState(0);
  const [jewelery, setjewelery] = useState(0);
  const [electronic, setelectronic] = useState(0);
  let categoryData = [
    { name: "Men `s Clothing", value: mencloth },
    { name: "Women `s Clothing", value: womencloth },
    { name: "Electronics", value: electronic },
    { name: "Jewelery", value: jewelery },
  ];

  const allproducts = async () => {
    const response = await fetch(
      "http://localhost:4000/api/v1/users/categoryDist",
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
    setmencloth(res.mencloth);
    setwomencloth(res.womencloth);
    setjewelery(res.jewelery);
    setelectronic(res.electronic);
    console.log(categoryData);
  };

  useEffect(() => {
    allproducts();
  }, []);
  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-lg font-medium mb-4 text-gray-100">
        Category Distribution
      </h2>
      <div className="h-80">
        <ResponsiveContainer width={"100%"} height={"100%"}>
          <PieChart>
            <Pie
              data={categoryData}
              cx={"50%"}
              cy={"50%"}
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {categoryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
export default CategoryDistributionChart;
