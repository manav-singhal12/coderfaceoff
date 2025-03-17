import React, { useState } from "react";
import { useGetAccountsQuery } from "../redux/api/WalletApiSlice";
import { useNavigate } from "react-router-dom";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import { useGetPaymentsQuery } from "../redux/api/PaymentApiSlice";

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const GetAccounts = () => {

  const { data: accountsData, error: accountsError, isLoading: accountsLoading } = useGetAccountsQuery();
  const { data: paymentsData, error: paymentsError, isLoading: paymentsLoading } = useGetPaymentsQuery();
  const navigate = useNavigate();

  const [selectedAccount, setSelectedAccount] = useState("All");

  //filters
  const [categoryFilter, setCategoryFilter] = useState('');
  const [amountFilter, setAmountFilter] = useState([0, 1000000]);
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });

  if (accountsLoading || paymentsLoading) return <div>Loading...</div>;
  if (accountsError) return <div>Error: {accountsError.message}</div>;
  if (paymentsError) return <div>Error: {paymentsError.message}</div>;

  const accounts = accountsData?.success && accountsData?.message?.length > 0
    ? accountsData.message
    : [];

  const allAccounts = accountsData?.message || [];
  const allTransactions = paymentsData?.payments || [];
  const publicKeys = allAccounts.map(account => account.public_key);


  const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 70%, 50%)`;
  };

  // Pie Chart
  const chartData = {
    labels: accounts.map((acc) => acc.public_key.slice(0, 4) + "..." + acc.public_key.slice(-4)),
    datasets: [
      {
        label: "Balance (SOL)",
        data: accounts.map((acc) => acc.balance),
        backgroundColor: accounts.map((acc) => stringToColor(acc.public_key)), // Use public_key for consistent colors
        borderWidth: 1,
      },
    ],
  };

  // Filter transactions
  const filteredTransactions = allTransactions
    .filter(txn => publicKeys.includes(txn.sender_key))
    .filter(txn => selectedAccount === "All" || txn.sender_key === selectedAccount)
    .filter(txn => {
      const txnDate = new Date(txn.time);
      return (
        (!dateFilter.start || txnDate >= new Date(dateFilter.start)) &&
        (!dateFilter.end || txnDate <= new Date(dateFilter.end)) &&
        txn.amount >= amountFilter[0] &&
        txn.amount <= amountFilter[1] &&
        txn.category.toLowerCase().includes(categoryFilter.toLowerCase())
      );
    })
    .sort((a, b) => new Date(b.time) - new Date(a.time));


  const last12Months = Array.from({ length: 12 }, (_, i) => { // array of 12 elements
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return date.toISOString().slice(0, 7);
  }).reverse();


  const monthlySpending = allTransactions.reduce((acc, txn) => {
    const month = new Date(txn.time).toISOString().slice(0, 7);
    if (last12Months.includes(month)) {
      if (!acc[txn.sender_key]) {
        acc[txn.sender_key] = {}; // if not exist create one
      }
      acc[txn.sender_key][month] = (acc[txn.sender_key][month] || 0) + txn.amount;
    }
    return acc;
  }, {});

  // Bar chart
  const barChartData = {
    labels: last12Months,
    datasets: accounts.map((acc) => ({
      label: `${acc.public_key.slice(0, 5)}...${acc.public_key.slice(-5)}`,
      data: last12Months.map((month) => monthlySpending[acc.public_key]?.[month] || 0),
      backgroundColor: stringToColor(acc.public_key),
    })),
  };


  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    animation: false, // Disable animations for performance
  };

  return (
    <div className="p-4 px-10">
      <h2 className="text-2xl">Your Accounts</h2>
      <br />



      {accounts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 ">

            <div className="col-span-1 lg:col-span-2 w-[90%] max-w-md mx-auto h-[300px] sm:h-[400px] lg:h-[500px]  p-5 rounded-lg">
              <h3 className="text-lg text-center mb-2">Balance Distribution</h3>
              <Pie data={chartData} />
            </div>

            <div className="col-span-1 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10 mb-10">
              {accounts.map((account, index) => (
                <div key={index} className="p-4 text-white rounded-2xl shadow-lg bg-[#2b2b2b]">
                  <p className="text-center bg-white text-black text-lg rounded-2xl">Account {index + 1}</p>
                  <br />
                  <p><strong>Public Key:</strong> {account.public_key.slice(0, 8) + '.........' + account.public_key.slice(-8)}
                  </p>
                  <br />
                  <p><strong>Balance:</strong> {account.balance ? (account.balance).toFixed(2) : "0"} SOL</p>
                  <br />
                  <div className="flex justify-between sm:flex-col gap-4">
                    <button
                      className="bg-white text-black p-2 rounded-lg cursor-pointer"
                      onClick={() => navigate(`/mywallets/transactions/${account.public_key}`)}>
                      See Transactions
                    </button>
                    <button
                      className="hover:bg-[#2f8a9d] bg-[#36a1b6] transition p-2 rounded-lg cursor-pointer"
                      onClick={() => navigate(`/mywallets/updatetransactions/${account.public_key}`)}>
                      Update Transactions
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="my-10 flex justify-center items">
            <div className="lg:w-full w-auto bg-[#2b2b2b] rounded-lg">
              <h3 className=" text-center ">Amount Distribution by Month</h3>
              <Bar className="" data={barChartData} options={chartOptions} />
            </div>

          </div>
        </>
      ) : (
        <p className="text-center">No accounts found.</p>
      )}
    </div>
  );
};

export default GetAccounts;
