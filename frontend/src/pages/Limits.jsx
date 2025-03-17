import React, { useState, useEffect } from "react";
import Loader from "../components/Loader.jsx";
import {
    useAddLimitMutation,
    useDeleteLimitMutation,
    useGetLimitsQuery,
    useUpdateLimitMutation,
} from "../redux/api/limitSlice.js";
import { useGetAccountsQuery } from "../redux/api/WalletApiSlice.js";
import { useGetPaymentsQuery } from "../redux/api/PaymentApiSlice.js";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

const Limits = () => {

    const { userInfo } = useSelector((state) => (state.auth))
    const navigate = useNavigate()

    useEffect(() => {
        if (!userInfo) {
            navigate("/login");
        }
    }, [userInfo, navigate]);

    const [addLimit, { isLoading }] = useAddLimitMutation();

    const { data: limits, isLoading: isFetchingLimits } = useGetLimitsQuery();
    const { data: accountsData, isLoading: isFetchingAccounts } = useGetAccountsQuery();
    const { data: paymentsData, isLoading: isFetchingPayments } = useGetPaymentsQuery();

    const [updateLimit] = useUpdateLimitMutation();
    const [deleteLimit] = useDeleteLimitMutation();

    const [category, setCategory] = useState("");
    const [amount, setAmount] = useState("");
    const [period, setPeriod] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [editingId, setEditingId] = useState(null);

    if (isFetchingAccounts || isFetchingLimits || isFetchingPayments) return <p> Loading ...</p> ;

    const calculateProgress = (limit) => {
        if (!paymentsData?.payments || !accountsData?.message) return 0;

        const publicKeys = accountsData.message.map(account => account.public_key);

        const limitStartDate = new Date(limit.startDate);
        const limitEndDate = new Date(limit.endDate);

        // Set time components to cover entire days
        limitStartDate.setHours(0, 0, 0, 0); 
        limitEndDate.setHours(23, 59, 59, 999); 

        // Filter relevant payments
        const relevantPayments = paymentsData.payments.filter(payment => {
            const paymentDate = new Date(payment.time);

            // Convert payment date to UTC
            const utcPaymentDate = new Date(Date.UTC(
                paymentDate.getUTCFullYear(),
                paymentDate.getUTCMonth(),
                paymentDate.getUTCDate()
            ));

            console.log(payment.category.trim(), limit.category.trim())
            console.log("Comparison:", {
                categoryMatch: payment.category.trim() === limit.category.trim(),
                dateInRange: utcPaymentDate >= limitStartDate && utcPaymentDate <= limitEndDate,
                senderMatch: publicKeys.includes(payment.sender_key),
                paymentDate: utcPaymentDate.toISOString(),
                limitStart: limitStartDate.toISOString(),
                limitEnd: limitEndDate.toISOString()
            });

            return (
                payment.category.trim() === limit.category.trim() &&
                utcPaymentDate >= limitStartDate &&
                utcPaymentDate <= limitEndDate &&
                publicKeys.includes(payment.sender_key)
            );
        });

        const totalSpent = relevantPayments.reduce((sum, payment) => sum + payment.amount, 0);
        const progress = (totalSpent / limit.amount) * 100;
        return Math.min(progress, 100);
    };
  

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateLimit({
                    limitId: editingId,
                    category,
                    amount,
                    // period,
                    startDate,
                    endDate
                }).unwrap();
                toast.success("Limit updated successfully");
            } else {
                await addLimit({ category, amount, period, startDate, endDate }).unwrap();
                toast.success("Limit added successfully");
            }
            window.location.reload();
            setCategory("");
            setAmount("");
            // setPeriod("");
            setStartDate("");
            setEndDate("");
            setEditingId(null);
        } catch (error) {
            console.error("Failed to save limit:", error);
            toast.error("Failed to save limit");
        }
    };

    const handleUpdate = (limit) => {
        setEditingId(limit._id);
        setCategory(limit.category);
        setAmount(limit.amount);
        setPeriod(limit.period);
        setStartDate(limit.startDate.split("T")[0]);
        setEndDate(limit.endDate.split("T")[0]);
    };

    const handleDelete = async (id) => {
        try {
            await deleteLimit({ limitId: id }).unwrap();
            toast.success("Limit deleted successfully");
            window.location.reload();
        } catch (error) {
            console.error("Failed to delete limit:", error);
            toast.error("Failed to delete limit");
        }
    };

    return (
        <>
            <div className="bg-[#36a1b6] flex justify-center p-3 text-xl rounded-lg m-6 text-white font-semibold">
                Manage your limits here
            </div>

            <div className="flex flex-col md:flex-row gap-8 mx-6 mb-10 ">
                <div className="w-full md:w-1/3 bg-[#2b2b2b] rounded-xl h-[50%] shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">
                        {editingId ? "UPDATE LIMIT" : "ADD LIMIT"}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block font-semibold text-white">Category</label>
                            <input
                                type="text"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                                placeholder="Enter Category name"
                                className="w-full p-3 border rounded-2xl mt-1 bg-black text-white"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold text-white">Amount</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                                placeholder="Enter amount"
                                className="w-full p-3 border rounded-2xl mt-1 bg-black text-white"
                            />
                        </div>
                        {/* <div>
                            <label className="block font-semibold text-white">Period</label>
                            <select
                                value={period}
                                onChange={(e) => setPeriod(e.target.value)}
                                required
                                className="cursor-pointer w-full p-3 border rounded-lg bg-black text-white"
                            >
                                <option value="">Select Period</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </div> */}
                        <div>
                            <label className="block font-semibold text-white">Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                                className="w-full p-3 border rounded-2xl mt-1 bg-black text-white"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold text-white">End Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                required
                                className="w-full p-3 border rounded-2xl mt-1 bg-black text-white"
                            />
                        </div>
                        <button type="submit" className="cursor-pointer w-full p-3 bg-[#36a1b6] text-white rounded-lg hover:bg-[#2b8c9e] transition">
                            {editingId ? "Update Limit" : "Add Limit"}
                        </button>
                    </form>
                    {isLoading &&  <p>Loading...</p>}
                </div>

                <div className="w-full md:w-2/3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                        {limits?.message.map((limit) => {
                            const progress = calculateProgress(limit);
                            const progressWidth = Math.min(progress, 100);
                            const progressColor = progress >= 100 ? 'bg-red-500' : 'bg-green-500';

                            return (
                                <div key={limit._id} className="p-5 text-white rounded-2xl shadow-lg bg-[#2b2b2b]">
                                    <p className="bg-white rounded-xl text-black text-center p-2 text-lg font-semibold">
                                        Limit on {limit.category}
                                    </p>
                                    <div className="mt-3 space-y-2">
                                        <p><strong>Amount:</strong> ₹{limit.amount}</p>
                                        {/* <p><strong>Period:</strong> {limit.period}</p> */}
                                        <p><strong>Start Date:</strong> {new Date(limit.startDate).toLocaleDateString()}</p>
                                        <p><strong>End Date:</strong> {new Date(limit.endDate).toLocaleDateString()}</p>

                                        <div className="pt-4">
                                            <div className="flex justify-between mb-1">
                                                <span className="text-sm font-medium">Progress</span>
                                                <span className="text-sm font-medium">{progress.toFixed(1)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className={`${progressColor} h-2.5 rounded-full transition-all duration-300`}
                                                    style={{ width: `${progressWidth}%` }}
                                                ></div>
                                            </div>
                                            {progress >= 100 && (
                                                <p className="text-red-400 text-sm mt-1">Limit exceeded!</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-between mt-6 gap-2">
                                        <button
                                            className="bg-[#36a1b6] cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-[#2b8c9e] transition w-[48%]"
                                            onClick={() => handleUpdate(limit)}
                                        >
                                            Update
                                        </button>
                                        <button
                                            className="bg-[#36a1b6] cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-[#2b8c9e] transition w-[48%]"
                                            onClick={() => handleDelete(limit._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Limits;