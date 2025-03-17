import React, { useState } from 'react';
import { useGetPaymentsQuery } from "../redux/api/PaymentApiSlice";
import { useParams } from "react-router-dom";
import { useGetAccountsQuery } from '../redux/api/WalletApiSlice';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import * as XLSX from "xlsx";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
import { useEffect } from 'react';
const CategorizedTransaction = () => {

     const {userInfo} = useSelector((state)=>(state.auth))
      const navigate = useNavigate()
      useEffect(() => {
        if (!userInfo) {
          navigate("/login");
        }
      }, [userInfo, navigate]);
    const { data, error, isError, isLoading } = useGetPaymentsQuery();
    const { walletkey } = useParams();
    const { data: AccountData, error: AccountError, isError: isAccountError, isLoading: isAccountLoading } = useGetAccountsQuery();
    const account = AccountData?.message?.find(acc => acc.public_key === walletkey);
    console.log(AccountData);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [amountFilter, setAmountFilter] = useState([0, 1000000]); // Default range
    const [dateFilter, setDateFilter] = useState({ start: '', end: '' });

    if (isLoading) {
        return <div>Loading transactions...</div>;
    }

    if (isError) {
        return <div>Error fetching transactions: {error.message}</div>;
    }

    const filteredTransactions = data?.payments?.filter((transaction) => {
        const matchesWallet = transaction.sender_key === walletkey;

        const matchesCategory = categoryFilter ? transaction.category.toLowerCase().includes(categoryFilter.toLowerCase()) : true;

        const matchesAmount = transaction.amount >= amountFilter[0] && transaction.amount <= amountFilter[1];

        const transactionDate = new Date(transaction.time);
        const matchesDate = (!dateFilter.start || transactionDate >= new Date(dateFilter.start)) &&
            (!dateFilter.end || transactionDate <= new Date(dateFilter.end));

        return matchesWallet && matchesCategory && matchesAmount && matchesDate;
    }).sort((a, b) => new Date(b.time) - new Date(a.time));

    const stringToColor = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const r = (hash & 0xFF0000) >> 16;
        const g = (hash & 0x00FF00) >> 8;
        const b = hash & 0x0000FF;
        return `rgb(${r},${g},${b})`;
    };

    const categoryAmount = filteredTransactions?.reduce((acc, txn) => {
        const category = txn.category.trim().toLowerCase();
        acc[category] = (acc[category] || 0) + txn.amount;
        return acc;
    }, {});
    console.log(categoryAmount)
    // Pie chart data
    const pieChartData = {
        labels: Object.keys(categoryAmount),
        datasets: [
            {
                data: Object.values(categoryAmount),
                backgroundColor: Object.keys(categoryAmount).map((category) => stringToColor(category)),
                borderColor: '#ffffff',
                borderWidth: 1
            }
        ]
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
            },
        },
    };

    // Bar chart data
    const categoryData = filteredTransactions?.reduce((acc, txn) => {
        const category = txn.category.trim().toLowerCase(); // Normalize category
        if (!acc[category]) {
            acc[category] = { amount: 0, count: 0 };
        }
        acc[category].amount += txn.amount;
        acc[category].count += 1;
        return acc;
    }, {});


    // Bar chart data
    const barChartData = {
        labels: Object.keys(categoryData),
        datasets: [
            {
                label: 'Amount Spent (SOL)',
                data: Object.values(categoryData).map((data) => data.amount),
                backgroundColor: Object.keys(categoryData).map((category) => stringToColor(category)),
                borderColor: '#ffffff',
                borderWidth: 1
            },
            {
                label: 'Number of Payments',
                data: Object.values(categoryData).map((data) => data.count),
                backgroundColor: 'rgba(255, 159, 64, 0.6)',
                borderColor: '#ffffff',
                borderWidth: 1,
                hidden: true
            }
        ]
    };


    const downloadExcel = () => {
        if (!filteredTransactions || filteredTransactions.length === 0) {
            alert("No transactions available for download!");
            return;
        }

        // Create worksheet
        const ws = XLSX.utils.json_to_sheet(filteredTransactions.map((txn, index) => ({
            "S.No": index + 1,
            "Receiver Key": txn.receiver_key,
            "Receiver Name": txn.receivername,
            "Amount (SOL)": txn.amount.toFixed(4),
            "Category": txn.category,
            "Date": new Date(txn.time).toLocaleString(),
        })));

        // Create workbook and append worksheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Transactions");

        XLSX.writeFile(wb, `Transactions_${walletkey}.xlsx`);
    };
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
      };
    return (
        <div className='p-4 sm:p-6 md:p-10'>
    <div className="bg-[#36a1b6] flex flex-col md:flex-row justify-between p-3 rounded-lg mb-6 text-center md:text-left">
        <h2><strong>Transactions for Wallet:</strong> {walletkey}</h2>
        <p><strong>Balance:</strong> {account?.balance ? parseFloat(account.balance).toFixed(2) : "0"} SOL</p>
    </div>

    {/* Filters */}
    <div className="flex flex-col lg:flex-row md:items-center justify-between gap-4 my-6">
        <span className='bg-[#36a1b6] p-2 rounded-xl text-center md:text-left'>Apply Filters</span>
        <div className="flex flex-col lg:flex-row gap-2">
            <label htmlFor="category" className="bg-white text-black p-2 rounded-xl">Category:</label>
            <input
                type="text"
                id="category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                placeholder="Search by category"
                className="p-2 rounded-md border border-white w-full md:w-auto"
            />
        </div>
        <div className="flex flex-col lg:flex-row gap-2">
            <label htmlFor="amount" className="bg-white text-black p-2 rounded-xl">Amount:</label>
            <input
                type="number"
                id="minAmount"
                value={amountFilter[0]}
                onChange={(e) => setAmountFilter([+e.target.value, amountFilter[1]])}
                className="p-2 rounded-md border border-white w-full md:w-auto"
                placeholder="Min Amount"
            />
            <input
                type="number"
                id="maxAmount"
                value={amountFilter[1]}
                onChange={(e) => setAmountFilter([amountFilter[0], +e.target.value])}
                className="p-2 rounded-md border border-white w-full md:w-auto"
                placeholder="Max Amount"
            />
        </div>
        <div className="flex flex-col lg:flex-row gap-2">
            <label htmlFor="date" className="bg-white text-black p-2 rounded-xl">Date Range:</label>
            <input
                type="date"
                id="startDate"
                value={dateFilter.start}
                onChange={(e) => setDateFilter({ ...dateFilter, start: e.target.value })}
                className="p-2 rounded-md border border-white w-full md:w-auto"
            />
            <input
                type="date"
                id="endDate"
                value={dateFilter.end}
                onChange={(e) => setDateFilter({ ...dateFilter, end: e.target.value })}
                className="p-2 rounded-md border border-white w-full md:w-auto"
            />
        </div>
    </div>

    {/* Charts */}
    <div className="flex flex-col md:flex-row justify-between gap-6 sm:flex-wrap">
        {filteredTransactions?.length > 0 && (
            <div className="flex-1 h-[300px] sm:h-[400px] bg-[#2b2b2b] p-6 rounded-lg">
                <h3 className="text-center text-lg font-semibold">Amount Distribution by Category</h3>
                <Pie data={pieChartData} options={pieChartOptions} />
            </div>
        )}
        {filteredTransactions?.length > 0 && (
            <div className="flex-1 h-[300px] sm:h-[400px] bg-[#2b2b2b] p-6 rounded-lg">
                <h3 className="text-center text-lg font-semibold">Amount Distribution by Category</h3>
                <Bar data={barChartData} options={chartOptions} />
            </div>
        )}
    </div>

    <button
        onClick={downloadExcel}
        className="hover:bg-[#2f8a9d] bg-[#36a1b6] text-white p-2 rounded-md mt-4 flex justify-center mx-auto w-full sm:w-auto"
    >
        Download Transactions
    </button>

    {/* Transaction Table */}
    {filteredTransactions?.length > 0 ? (
        <div className="overflow-x-auto p-4 mt-6">
            <table className="w-full bg-[#2b2b2b] text-white border border-gray-700 rounded-lg text-sm sm:text-base">
                <thead>
                    <tr className="bg-[#1a1a1a] text-center">
                        <th className="p-2 border border-gray-600">S.No</th>
                        <th className="p-2 border border-gray-600">Receiver Key</th>
                        <th className="p-2 border border-gray-600">Receiver Name</th>
                        <th className="p-2 border border-gray-600">Amount (SOL)</th>
                        <th className="p-2 border border-gray-600">Category</th>
                        <th className="p-2 border border-gray-600">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTransactions.map((txn, index) => (
                        <tr key={index} className="hover:bg-[#3a3a3a] text-center">
                            <td className="p-2 border border-gray-600">{index + 1}</td>
                            <td className="p-2 border border-gray-600">{txn.receiver_key}</td>
                            <td className="p-2 border border-gray-600">{txn.receivername}</td>
                            <td className="p-2 border border-gray-600">{txn.amount?.toFixed(4)}</td>
                            <td className="p-2 border border-gray-600">{txn.category}</td>
                            <td className="p-2 border border-gray-600">
                                {new Date(txn.time).toLocaleString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    hour12: true,
                                })}
                            </td>
                        </tr>
                    ))}
                    <tr className="bg-[#1a1a1a] font-semibold text-center">
                        <td colSpan="3" className="p-2 border border-gray-600">Total</td>
                        <td className="p-2 border border-gray-600">
                            {filteredTransactions.reduce((sum, txn) => sum + txn.amount, 0).toFixed(2)} SOL
                        </td>
                        <td colSpan="2" className="p-2 border border-gray-600"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    ) : (
        <span className='bg-[#36a1b6] text-white p-2 rounded-md mt-4 flex justify-center mx-auto w-full sm:w-1/3'>
            No transactions found for this wallet.
        </span>
    )}
</div>

    );
};

export default CategorizedTransaction;
