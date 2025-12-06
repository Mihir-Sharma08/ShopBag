import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

// const orderStatusData = [
//   { name: "Pending", value: 30 },
//   { name: "Processing", value: 45 },
//   { name: "Shipped", value: 60 },
//   { name: "Delivered", value: 120 },
// ];
const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FED766", "#2AB7CA"];

const OrderDistribution = () => {
  const [pending, setpending] = useState(0);
  const [shipped, setshipped] = useState(0);
  const [processing, setprocessing] = useState(0);
  const [delivered, setdelivered] = useState(0);
  let orderStatusData = [
    { name: "Pending", value: pending },
    { name: "Processing", value: processing },
    { name: "Shipped", value: shipped },
    { name: "Delivered", value: delivered },
  ];

  const allorders = async () => {
    const response = await fetch(
      "http://localhost:4000/api/v1/users/orderdist",
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
    setpending(res.pendingOrder);
    setprocessing(res.processOrder);
    setdelivered(res.deliveredOrder);
    setshipped(res.shippedOrders);
    console.log(orderStatusData);

    // setstatus(status.map(status));

    // console.log("users", user);
  };

  useEffect(() => {
    allorders();
  }, []);
  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-gray-100 mb-4">
        Order Status Distribution
      </h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={orderStatusData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {orderStatusData.map((entry, index) => (
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
export default OrderDistribution;
