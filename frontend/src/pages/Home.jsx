import React, { useEffect, useState } from "react";

const Home = () => {

  const [solPrice, setSolPrice] = useState(null);

  const features = [
      {
        title: "Secure Transactions",
        desc: "Uses blockchain validation to prevent fraud and unauthorized transactions.",
      },
      {
        title: "Connect Wallet",
        desc: "Easily link a Solana wallet via public key or integrations like Phantom/Sollet.",
      },
      {
        title: "Categorized Transactions",
        desc: "Provides a breakdown of spending by category for better financial insights using charts.",
      },
      {
        title: "Transaction Details",
        desc: "Access receiver, amount, date, and category for each transaction.",
      },
      {
        title: "Multiple Wallets",
        desc: "Enables management of transactions for multiple wallets while displaying balances.",
      },
      {
        title: "Search & Filter",
        desc: "Visualize transaction details by using different filters on category, date, or amount.",
      },
    ];
  useEffect(() => {
    const fetchSolanaPrice = async () => {
      try {
        const response = await fetch(
          "https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT"
        );
        const data = await response.json();
        setSolPrice(data.price);
      } catch (error) {
        console.error("Error fetching SOL price:", error);
      }
    };

    fetchSolanaPrice();
    const interval = setInterval(fetchSolanaPrice, 5000); // Refresh price every 5 seconds
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    const chartContainer = document.getElementById("tradingview-chart");

    // Prevent duplicate scripts
    if (chartContainer.children.length === 0) {
      const script = document.createElement("script");
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.async = true;
      script.innerHTML = JSON.stringify({
        symbol: "BINANCE:SOLUSDT",
        theme: "dark",
        width: "100%",
        height: 500,
        locale: "en",
      });

      chartContainer.appendChild(script);
    }
  }, []);


  return (
    <>
      <div className="flex">
        <section
          className="relative h-[70vh] w-full flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://cdn.create.vista.com/api/media/small/686496532/stock-photo-image-solana-sol-virtual-currency-digital-background-illustration")',
          }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative text-center text-white px-4 sm:px-6 md:px-8">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold uppercase tracking-wider" >
              Welcome to SolBudget
            </h1>
            <br></br>
            <p className="mt-4 text-lg sm:text-xl">
              SolBudget is a blockchain-based budget tracker designed for
              Solana transactions. It empowers users to track, categorize, and
              manage all payments made through their Solana wallet. The platform
              provides a user-friendly interface with powerful features,
              allowing seamless budgeting and transaction monitoring.
            </p>
          </div>
        </section>
      </div>



      <div className="col-span-1 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 m-10 my-20">
        {features.map((feature, index) => (
          <div key={index} className="bg-[#2b2b2b] p-3 rounded-2xl">
            <h1 className="font-bold text-lg mb-2">{feature.title}</h1>
            <p>{feature.desc}</p>
          </div>
        ))}
      </div>
      
      <div className="text-center my-6">
        <p className="text-xl mt-2">
          {solPrice ? `Live SOL Price: $${parseFloat(solPrice).toFixed(2)}` : "Loading..."}
        </p>
      </div>

      <div id="tradingview-chart" className="my-10 mx-auto max-w-7xl"></div>
    </>
  );
};

export default Home;
