import React, { useState, useEffect } from "react";
import { useGetPaymentsQuery } from "../redux/api/PaymentApiSlice";
import { useGetAccountsQuery } from "../redux/api/WalletApiSlice";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

import { Pie, Bar } from 'react-chartjs-2';
import * as XLSX from "xlsx";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

const GetTransaction = () => {

    const { userInfo } = useSelector((state) => (state.auth))
    const navigate = useNavigate()

    useEffect(() => {
        if (!userInfo) {
            navigate("/login");
        }
    }, [userInfo, navigate]);
    
    const { data: paymentsData, error, isError, isLoading } = useGetPaymentsQuery();
    const {
        data: accountsData,
        error: accountError,
        isLoading: accountLoading
    } = useGetAccountsQuery();

    const [categoryFilter, setCategoryFilter] = useState('');
    const [amountFilter, setAmountFilter] = useState([0, 1000000]);
    const [dateFilter, setDateFilter] = useState({ start: '', end: '' });

    if (isLoading || accountLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {error.message}</div>;
    if (accountError) return <div>Account Error: {accountError.message}</div>;

    const allAccounts = accountsData?.message || [];
    console.log(paymentsData)
    const allTransactions = paymentsData?.payments || [];
    const publicKeys = allAccounts.map(account => account.public_key);

    // another way for filtering transactions
    const filteredTransactions = allTransactions
        .filter(txn => publicKeys.includes(txn.sender_key))
        .filter(txn => {
            const txnDate = new Date(txn.createdAt);
            return (
                (!dateFilter.start || txnDate >= new Date(dateFilter.start)) &&
                (!dateFilter.end || txnDate <= new Date(dateFilter.end)) &&
                txn.amount >= amountFilter[0] &&
                txn.amount <= amountFilter[1] &&
                txn.category.toLowerCase().includes(categoryFilter.toLowerCase())
            );
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const stringToColor = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return `hsl(${hash % 360}, 70%, 50%)`;
    };

    const accountSpendingData = allAccounts.reduce((acc, account) => {
        acc[account.public_key] = allTransactions
            .filter(txn => txn.sender_key === account.public_key)
            .reduce((sum, txn) => sum + txn.amount, 0);
        return acc;
    }, {});

    const categorySpending = filteredTransactions.reduce((acc, txn) => {
        acc[txn.category] = (acc[txn.category] || 0) + txn.amount;
        return acc;
    }, {});

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "bottom" } }
    };

   
    const pieChartData1 = {
        labels: Object.keys(categorySpending),
        datasets: [{
            data: Object.values(categorySpending),
            backgroundColor: Object.keys(categorySpending).map(stringToColor),
            borderColor: '#ffffff',
            borderWidth: 1
        }]
    };

    const filteredAccountTransactions = allTransactions.filter(txn => {
        const txnDate = new Date(txn.createdAt);
        return (
            (!dateFilter.start || txnDate >= new Date(dateFilter.start)) &&
            (!dateFilter.end || txnDate <= new Date(dateFilter.end)) &&
            txn.amount >= amountFilter[0] &&
            txn.amount <= amountFilter[1] &&
            txn.category.toLowerCase().includes(categoryFilter.toLowerCase())
        );
    });

    const filteredAccountSpendingData = allAccounts.reduce((acc, account) => {
        acc[account.public_key] = filteredAccountTransactions
            .filter(txn => txn.sender_key === account.public_key)
            .reduce((sum, txn) => sum + txn.amount, 0);
        return acc;
    }, {});

    

    const pieChartData2 = {
        labels: Object.keys(filteredAccountSpendingData).map(label =>
            label.length > 10 ? label.slice(0, 5) + "..." + label.slice(-5) : label
        ),
        datasets: [{
            data: Object.values(filteredAccountSpendingData),
            backgroundColor: Object.keys(filteredAccountSpendingData).map(stringToColor),
            borderColor: '#ffffff',
            borderWidth: 1
        }]
    }
    const downloadExcel = () => {
        if (filteredTransactions.length === 0) {
            alert("No transactions to download!");
            return;
        }

        const ws = XLSX.utils.json_to_sheet(filteredTransactions.map((txn, index) => ({
            "S.No": index + 1,
            "Sender Key": txn.sender_key,
            "Receiver Key": txn.receiver_key,
            "Receiver Name": txn.receivername,
            "Amount (SOL)": txn.amount.toFixed(4),
            "Category": txn.category,
            "Date": new Date(txn.createdAt).toLocaleString(),
        })));

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Transactions");
        XLSX.writeFile(wb, `All_Accounts_Transactions.xlsx`);
    };

    return (
        <div className="p-6 md:p-10 text-white">
            {/* Header */}
            <div className="bg-[#36a1b6] flex justify-center p-2 text-lg md:text-xl rounded-lg mb-6 md:mb-10">
                <h2><strong>Transactions for all the accounts</strong></h2>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 my-6">
                <span className='bg-[#36a1b6] p-2 rounded-xl text-center md:text-left'>Apply Filters</span>
                <div className="flex flex-col md:flex-row gap-2">
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
                <div className="flex flex-col md:flex-row gap-2">
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
                <div className="flex flex-col md:flex-row gap-2">
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

            <div className="flex flex-col md:flex-row justify-between gap-6 sm:flex-wrap">
                {filteredTransactions?.length > 0 && (
                    <div className="flex-1 h-[300px] sm:h-[400px] bg-[#2b2b2b] p-6 rounded-lg">
                        <h3 className="text-center text-lg font-semibold">Amount Distribution by Category</h3>
                        <Pie data={pieChartData1} options={pieChartOptions} />
                    </div>
                )}
                {filteredTransactions?.length > 0 && (
                    <div className="flex-1 h-[300px] sm:h-[400px] bg-[#2b2b2b] p-6 rounded-lg">
                        <h3 className="text-center text-lg font-semibold">Amount Distribution by Category</h3>
                        <Pie data={pieChartData2} options={pieChartOptions} />
                    </div>
                )}
            </div>

            <button
                onClick={downloadExcel}
                className="hover:bg-[#2f8a9d] bg-[#36a1b6] cursor-pointer text-white p-2 rounded-md mt-6 flex justify-center mx-auto w-full md:w-1/3"
            >
                Download Transactions
            </button>

            {filteredTransactions && filteredTransactions.length > 0 ? (
                <div className="overflow-x-auto p-4 mt-6">
                    <table className="w-full bg-[#2b2b2b] text-white border border-gray-700 rounded-lg">
                        <thead>
                            <tr className="bg-[#1a1a1a] text-center">
                                <th className="p-2 border border-gray-600">S.No</th>
                                <th className="p-2 border border-gray-600">Sender Key</th>
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
                                    <td className="p-2 border border-gray-600">{txn.sender_key}</td>
                                    <td className="p-2 border border-gray-600">{txn.receiver_key}</td>
                                    <td className="p-2 border border-gray-600">{txn.receivername}</td>
                                    <td className="p-2 border border-gray-600">{txn.amount?.toFixed(4)}</td>
                                    <td className="p-2 border border-gray-600">{txn.category}</td>
                                    <td className="p-2 border border-gray-600">
                                        {new Date(txn.createdAt).toLocaleString("en-US", {
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
                            <tr className="bg-[#1a1a1a] font-semibold text-lg text-center">
                                <td colSpan="4" className="p-2 border border-gray-600">Total</td>
                                <td className="p-2 border border-gray-600">
                                    {filteredTransactions.reduce((sum, txn) => sum + txn.amount, 0).toFixed(2)} SOL
                                </td>
                                <td colSpan="2" className="p-2 border border-gray-600"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ) : (
                <span className='bg-[#36a1b6] cursor-pointer text-white w-full md:w-1/3 p-2 rounded-md mt-4 flex justify-center mx-auto'>No transactions found for this wallet.</span>
            )}
        </div>
    );

};

export default GetTransaction;
