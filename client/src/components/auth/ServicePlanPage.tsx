import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const BTC_ADDRESS = "bc1qexamplebtcaddress1234567890";

const allPlans = [
  {
    name: "Standard Mentorship",
    id: "standard-mentorship",
    price: 210,
    duration: "1 MONTH",
  },
  {
    name: "VIP Mentorship Package",
    id: "vip-mentorship-package",
    price: 1000,
    duration: "1 MONTH",
  },
  //   {
  //     name: "Basic Account Management",
  //     id: "basic-account-management",
  //     price: 500,
  //     duration: "1 MONTH",
  //   },
  //   {
  //     name: "Advanced Account Management",
  //     id: "advanced-account-management",
  //     price: "1000 - 5000",
  //     duration: "1 MONTH",
  //   },
  //   {
  //     name: "Premium Account Management",
  //     id: "premium-account-management",
  //     price: "5000 - 10000",
  //     duration: "1 MONTH",
  //   },
  {
    name: "Signal Provision Service",
    id: "signal-provision-service",
    price: 80,
    duration: "1 MONTH",
  },
];

const ServicePlanPage = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const plan = allPlans.find((p) => p.id === planId);

  const [btcRate, setBtcRate] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Fetch BTC/USD rate from CoinGecko
    fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.bitcoin && data.bitcoin.usd) {
          setBtcRate(1 / data.bitcoin.usd);
        }
      })
      .catch(() => setBtcRate(null));
  }, []);

  function getBtcPrice(price: number | string) {
    if (!btcRate) return "-";
    if (typeof price === "string" && price.includes("-")) {
      // Handle price ranges
      const [min, max] = price.split("-").map((p) => parseFloat(p.trim()));
      if (isNaN(min) || isNaN(max)) return "-";
      return `${(min * btcRate).toFixed(6)} - ${(max * btcRate).toFixed(
        6
      )} BTC`;
    }
    const num = typeof price === "number" ? price : parseFloat(price);
    if (isNaN(num)) return "-";
    return `${(num * btcRate).toFixed(6)} BTC`;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(BTC_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-dark">
        <h2 className="text-gold text-2xl font-bold mb-4">Plan Not Found</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/dashboard/service")}
        >
          Back to Services
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark">
      <div className="card-glass p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gold mb-2">{plan.name}</h1>
        <div className="text-3xl font-bold text-gray-900 mb-1">
          ${plan.price}
        </div>
        <div className="text-lg font-semibold text-gray-400 mb-2">
          ≈ {btcRate ? getBtcPrice(plan.price) : "Loading..."}
        </div>
        <div className="text-sm text-gray-400 mb-4">{plan.duration}</div>
        <h2 className="text-lg font-semibold text-gold mb-2">
          Payment Options
        </h2>
        <div className="mb-4">
          <div className="text-gray-300 mb-2">
            <span className="font-semibold">Bank Account:</span>
            <br />
            Account Name: SBM Forex Academy
            <br />
            Account Number: <span className="font-mono">1234567890</span>
            <br />
            Bank: Example Bank
          </div>
          <div className="text-gray-300 mb-2">
            <span className="font-semibold">BTC Wallet:</span>
            <br />
            <span className="font-mono select-all">{BTC_ADDRESS}</span>
            <button
              className="ml-2 px-2 py-1 text-xs rounded bg-gold text-dark font-semibold hover:bg-amber-400 transition"
              onClick={handleCopy}
              type="button"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="text-gray-300 mt-4">
            <span className="font-semibold text-gold">
              After payment, send proof of payment to WhatsApp:
            </span>
            <br />
            <a
              href="https://wa.me/2349032085666"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 underline font-semibold"
            >
              Click here to chat on WhatsApp
            </a>
          </div>
        </div>
        <button
          className="btn btn-outline"
          onClick={() => navigate("/dashboard/service")}
        >
          Back to Services
        </button>
      </div>
      <footer className="text-center text-gray-400 py-6 border-t border-gray-800 bg-dark-darker w-full mt-8">
        © 2021–2025 SBM Forex Academy. All rights reserved.
      </footer>
    </div>
  );
};

export default ServicePlanPage;
