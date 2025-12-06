import { CheckCircle, Clock, DollarSign, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import DailyOrders from "../components/orders/DailyOrders";
import OrderDistribution from "../components/orders/OrderDistribution";
import OrdersTable from "../components/orders/OrdersTable";
import { useEffect, useState } from "react";

const orderStats = {
	totalOrders: "1,234",
	pendingOrders: "56",
	completedOrders: "1,178",
	totalRevenue: "$98,765",
};

const OrdersPage = () => {
	
	const [orders, setorders] = useState();
	const [pendings, setpendings] = useState();
	const [completed, setcompleted] = useState();
  
	const totalsales = async () => {
	  const response = await fetch(
		"http://localhost:4000/api/v1/users/totalorder",
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
	  setorders(res.totalOrders);
	};
	const totalProduct = async () => {
	  const response = await fetch(
		"http://localhost:4000/api/v1/users/pendingorder",
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
	  setpendings(res.pendingOrders);
  
	  // setstatus(status.map(status));
  
	  // console.log("users", user);
	};
	const salesOverview = async () => {
	  const response = await fetch(
		"http://localhost:4000/api/v1/users/completedorder",
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
	  setcompleted(res.completedOrders)
  
	  // setstatus(status.map(status));
  
	  // console.log("users", user);
	};
  
	useEffect(() => {
	  totalsales();
	  totalProduct();
	  salesOverview();
	}, []);
	return (
		<div className='flex-1 relative z-10 overflow-auto'>
			<Header title={"Orders"} />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total Orders' icon={ShoppingBag} value={orders} color='#6366F1' />
					<StatCard name='Pending Orders' icon={Clock} value={pendings} color='#F59E0B' />
					<StatCard
						name='Completed Orders'
						icon={CheckCircle}
						value={completed}
						color='#10B981'
					/>
					<StatCard name='Total Revenue' icon={DollarSign} value={orderStats.totalRevenue} color='#EF4444' />
				</motion.div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
					<DailyOrders />
					<OrderDistribution />
				</div>

				<OrdersTable />
			</main>
		</div>
	);
};
export default OrdersPage;
