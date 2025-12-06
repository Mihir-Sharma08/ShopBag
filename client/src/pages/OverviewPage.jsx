import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import SalesOverviewChart from "../components/overview/SalesOverviewChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesChannelChart from "../components/overview/SalesChannelChart";
import { useEffect, useState } from "react";

const OverviewPage = () => {
  const [sales, setsales] = useState();
  const [users, setusers] = useState();
  const [Products, setProducts] = useState();

  const totalsales = async () => {
    const response = await fetch(
      "http://localhost:4000/api/v1/users/totalsale",
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
    setsales(res.totalSales);
  };
  const totalProduct = async () => {
    const response = await fetch(
      "http://localhost:4000/api/v1/users/totalstock",
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
    setProducts(res.totalStock);

    // setstatus(status.map(status));

    // console.log("users", user);
  };
  const salesOverview = async () => {
    const response = await fetch(
      "http://localhost:5000/api/v1/users/salesoverview",
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

    // setstatus(status.map(status));

    // console.log("users", user);
  };

  useEffect(() => {
    totalsales();
    totalProduct();
    salesOverview();
  }, []);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Overview" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Sales"
            icon={Zap}
            value={`$${sales}`}
            color="#6366F1"
          />
          <StatCard
            name="New Users"
            icon={Users}
            value="1,234"
            color="#8B5CF6"
          />
          <StatCard
            name="Total Products"
            icon={ShoppingBag}
            value={Products}
            color="#EC4899"
          />
        </motion.div>

        {/* CHARTS */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SalesOverviewChart />
          <CategoryDistributionChart />
          <SalesChannelChart />
        </div>
      </main>
    </div>
  );
};
export default OverviewPage;
