import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Register from "./pages/Register";
import LogoutButton from "./components/LogoutButton.jsx";
import WalletTransactions from "./pages/WalletTransaction.jsx";
// import GetAccounts from "./components/getAccounts.jsx";
function App() {
  const [transactions, setTransactions] = useState([]);

  // useEffect(() => {
  //   async function fetchTransactions() {
  //     const data = await getTransactions(); // Fetch transaction data
  //     setTransactions(data);
  //   }
  //   fetchTransactions();
  // }, []);

  return (
    <>
    {/* <WalletTransactions/> */}
    {/* <WalletTransactions walletAddress="EV9ZmjC2htgiv6bjRTwWXv9abF8qsmUpS3Be8eELSNi8" /> */}

    {/* <LogoutButton/> */}
    {/* <GetAccounts/> */}
      {/* <h1>Solana Budget Tracker</h1>
      <h2>Transaction History</h2>
      <ul>
        {transactions.length > 0 ? (
          transactions.map((tx, index) => (
            <li key={index}>
              <strong>Signature:</strong> {tx.transaction.signatures[0]}
            </li>
          ))
        ) : (
          <p>Loading transactions...</p>
        )}
      </ul> */}

      {/* <Register /> */}
    </>
  );
}

export default App;
