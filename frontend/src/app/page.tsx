"use client";

import { useState } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const connectWallet = async () => {
    try {
      const providerOptions = {
        injected: {
          display: {
            name: "MetaMask",
            description: "Connect with the MetaMask extension",
          },
          package: null,
        },
      };

      const web3Modal = new Web3Modal({
        cacheProvider: true,
        providerOptions,
      });

      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection);
      const signer = await provider.getSigner();
      setWalletAddress(await signer.getAddress());
      toast.success("Wallet connected successfully!");
    } catch (error) {
      toast.error("Wallet connection failed!");
      console.error("Wallet connection failed", error);
    }
  };

  const handleSubmit = async () => {
    if (!email || !walletAddress) return;

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address!");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/email-wallet",
        {
          email,
          walletAddress,
        }
      );
      console.log(response);

      toast.success("Data submitted successfully!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (
        error.response?.data?.message ===
        "Email or wallet address already exists."
      ) {
        toast.error("Email or wallet address already exists.");
      } else {
        toast.error("Failed to submit data. Please try again.");
      }
      console.log("Error submitting data:", error.response?.data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 p-6">
      <button
        onClick={connectWallet}
        className="absolute top-4 right-4 bg-gray-200 text-gray-900 px-8 py-3 rounded-full shadow-xl border border-gray-600 font-bold transition-all hover:bg-green-700 hover:text-white hover:scale-110 flex items-center gap-2"
      >
        {walletAddress ? "✅ Connected" : "🔗 Connect Wallet"}
      </button>
      <div className="bg-gray-100 p-10 rounded-3xl shadow-2xl w-full max-w-lg text-center transform transition-all hover:scale-105">
        <h1 className="text-4xl font-extrabold mb-6 text-gray-900">
          Submit Your Info
        </h1>
        <div className="relative mb-6 flex items-center">
          <input
            type="text"
            value={walletAddress}
            readOnly
            className="w-full p-4 border border-gray-400 rounded-lg bg-gray-300 text-center text-gray-800 font-medium shadow-md focus:ring-4 focus:ring-gray-500 focus:outline-none pr-12"
            placeholder="Wallet Address"
          />
          <span className="absolute right-4 text-gray-600 text-lg">🔗</span>
        </div>
        <div className="relative mb-6 flex items-center">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 border border-gray-400 rounded-lg text-center text-gray-900 font-medium shadow-md focus:ring-4 focus:ring-gray-500 focus:outline-none pr-12"
            placeholder="Enter your email"
          />
          <span className="absolute right-4 text-gray-600 text-lg">📧</span>
        </div>
        <button
          onClick={handleSubmit}
          disabled={
            !email || !walletAddress || isSubmitting || !isValidEmail(email)
          }
          className={`w-full px-6 py-3 rounded-lg shadow-xl font-bold transition-all flex items-center justify-center gap-2 ${
            !email || !walletAddress || isSubmitting || !isValidEmail(email)
              ? "bg-red-400 cursor-not-allowed"
              : "bg-gradient-to-r from-teal-400 to-blue-500 text-white hover:from-teal-500 hover:to-blue-600 hover:scale-110 hover:shadow-2xl"
          }`}
        >
          {isSubmitting ? "⏳ Submitting..." : "🚀 Submit"}
        </button>
      </div>
    </div>
  );
}
