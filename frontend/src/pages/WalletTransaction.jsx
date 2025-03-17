import React, { useState, useEffect } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { useParams } from "react-router-dom";
import { useGetPaymentsQuery, useSendPaymentMutation } from "../redux/api/PaymentApiSlice.js";
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";

const WalletTransactions = () => {
  
  const { userInfo } = useSelector((state) => (state.auth))
  const navigate = useNavigate()

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [userInfo, navigate]);

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextSignature, setNextSignature] = useState(null);
  const { walletkey } = useParams();
  const walletAddress = walletkey;
  const [categoryInputs, setCategoryInputs] = useState({});
  const [receivernameInputs, setReceivernameInputs] = useState({}); // New state for receiver name
  const { data, error, isError, isLoading } = useGetPaymentsQuery();
  const [sendPayment] = useSendPaymentMutation();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!walletAddress) return;

      const connection = new Connection(
        "https://solemn-frequent-star.solana-devnet.quiknode.pro/7353cafcf2125f083c4ef4480b952c0ae9786b6c/"
      );
      try {
        const fetchChunk = async (before = null) => {
          const signatures = await connection.getSignaturesForAddress(
            new PublicKey(walletAddress),
            { limit: 10, before }
          );

          if (signatures.length === 0) {
            setLoading(false);
            return;
          }

          const transactionsDetails = await Promise.all(
            signatures.map(async (signatureInfo) => {
              const transaction = await connection.getTransaction(signatureInfo.signature, {
                commitment: "confirmed",
              });
              return transaction;
            })
          );

          setTransactions((prevTransactions) => [
            ...prevTransactions,
            ...transactionsDetails,
          ]);
          setNextSignature(signatures[signatures.length - 1].signature);
        };

        await fetchChunk(nextSignature);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [walletAddress, nextSignature]);

  const loadMore = () => {
    if (!loading && nextSignature) {
      setLoading(true);
      fetchTransactions();
    }
  };

  if (isLoading) {
    return <div>Loading transactions...</div>;
  }

  if (isError) {
    return <div>Error fetching transactions: {error.message}</div>;
  }

  const storedSignatures = new Set(data?.payments?.map((payment) => payment.signature));

  const filteredTransactions = transactions.filter((t) => {
    if (!t?.meta || !t?.transaction) return false;

    const senderKey = t.transaction.message.accountKeys[0].toString();
    const amountDeducted =
      (t.meta.preBalances[0] - t.meta.postBalances[0] + t.meta.fee) / 1e9;

    return (
      !storedSignatures.has(t.transaction.signatures[0]) &&
      senderKey === walletAddress &&
      amountDeducted > 0
    );
  });

  const handleCategoryChange = (signature, value) => {
    setCategoryInputs((prev) => ({ ...prev, [signature]: value }));
  };

  const handleReceiverNameChange = (signature, value) => {
    setReceivernameInputs((prev) => ({ ...prev, [signature]: value }));
  };

  const handleAddPayment = async (transaction) => {
    const signature = transaction.transaction.signatures[0];
    const category = categoryInputs[signature];
    const receiver_name = receivernameInputs[signature];

    if (!category) {
      alert("Category is required");
      return;
    }
    if (!receiver_name) {
      alert("Receiver Name is required");
      return;
    }

    const blockTime = transaction.blockTime ? new Date(transaction.blockTime * 1000) : null;

    const paymentData = {
      sender_key: transaction.transaction.message.accountKeys[0].toString(),
      receiver_key: transaction.transaction.message.accountKeys[1].toString(),
      amount: ((transaction.meta.preBalances[0] - transaction.meta.postBalances[0] + transaction.meta.fee) / 1e9).toFixed(5),
      signature: signature,
      category: category,
      receivername: receiver_name, // Added receiver name field
      time: blockTime ? blockTime : "", // Ensure time is formatted
    };

    try {
      await sendPayment(paymentData);
      window.location.reload();
      alert("Payment added successfully!");
    } catch (error) {
      console.error("Error adding payment:", error);
      alert("Failed to add payment.");
    }
  };


  return (
    <div className="p-4">
      <div className="bg-[#36a1b6] flex flex-wrap justify-between p-3 rounded-lg m-5 text-white text-center sm:text-left">
        <h2 className="text-sm sm:text-base md:text-lg font-bold">
          Transactions for Wallet: {walletkey}
        </h2>
      </div>

      {filteredTransactions && filteredTransactions.length > 0 ? (
        <div className="overflow-x-auto p-4">
          <table className="min-w-full bg-[#2b2b2b] text-white border border-gray-700 rounded-lg">
            <thead>
              <tr className="bg-[#1a1a1a] text-center text-xs sm:text-sm">
                <th className="p-2 border border-gray-600 min-w-[50px]">S.No</th>
                <th className="p-2 border border-gray-600 min-w-[120px]">Sender Key</th>
                <th className="p-2 border border-gray-600 min-w-[120px]">Receiver Key</th>
                <th className="p-2 border border-gray-600 min-w-[150px]">Receiver Name</th>
                <th className="p-2 border border-gray-600 min-w-[100px]">Amount (SOL)</th>
                <th className="p-2 border border-gray-600 min-w-[120px]">Category</th>
                <th className="p-2 border border-gray-600 min-w-[150px]">Date</th>
                <th className="p-2 border border-gray-600 min-w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction, index) => {
                const signature = transaction.transaction.signatures[0];
                const amount = ((transaction.meta.preBalances[0] -
                  transaction.meta.postBalances[0] +
                  transaction.meta.fee) / 1e9).toFixed(4);
                const senderKey = transaction.transaction.message.accountKeys[0].toString();
                const receiverKey = transaction.transaction.message.accountKeys[1].toString();
                const blockTime = transaction.blockTime ?
                  new Date(transaction.blockTime * 1000).toLocaleString() : 'N/A';

                return (
                  <tr key={index} className="hover:bg-[#3a3a3a] text-center text-xs sm:text-sm">
                    <td className="p-2 border border-gray-600">{index + 1}</td>
                    <td className="p-2 border border-gray-600">{`${senderKey.slice(0, 5)}.....${senderKey.slice(-5)}`}</td>
                    <td className="p-2 border border-gray-600">{`${receiverKey.slice(0, 5)}.....${receiverKey.slice(-5)}`}</td>
                    <td className="p-2 border border-gray-600">
                      <input
                        type="text"
                        placeholder="Receiver Name"
                        value={receivernameInputs[signature] || ""}
                        onChange={(e) => handleReceiverNameChange(signature, e.target.value)}
                        className="bg-transparent text-center w-full p-1 text-white placeholder-gray-400 border border-gray-600 rounded-md"
                      />
                    </td>
                    <td className="p-2 border border-gray-600">{amount}</td>
                    <td className="p-2 border border-gray-600">
                      <input
                        type="text"
                        placeholder="Category"
                        value={categoryInputs[signature] || ""}
                        onChange={(e) => handleCategoryChange(signature, e.target.value)}
                        className="bg-transparent text-center w-full p-1 text-white placeholder-gray-400 border border-gray-600 rounded-md"
                      />
                    </td>
                    <td className="p-2 border border-gray-600">{blockTime}</td>
                    <td className="p-2 border border-gray-600">
                      <button
                        onClick={() => handleAddPayment(transaction)}
                        className="bg-[#36a1b6] hover:bg-[#2f8a9d] cursor-pointer text-white py-1 px-3 rounded text-xs sm:text-sm"
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <span className="bg-[#36a1b6] text-white w-full sm:w-[50%] p-2 rounded-md mt-4 flex justify-center text-center mx-auto">
          No transactions found for this wallet.
        </span>
      )}

      {loading && <div className="text-center mt-3">Loading more transactions...</div>}
      {!loading && nextSignature && (
        <button
          onClick={loadMore}
          className="bg-[#36a1b6] hover:bg-[#2f8a9d] text-white px-4 py-2 rounded-md mt-3 block mx-auto"
        >
          Load More
        </button>
      )}
    </div>
  );

};

export default WalletTransactions;
