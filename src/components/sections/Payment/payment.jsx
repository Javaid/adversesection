import React from "react";
import { LuDollarSign } from "react-icons/lu";
import { AiOutlineRise } from "react-icons/ai";
import { BsCheckCircle } from "react-icons/bs";

function Payment({ provider }) {
  if (!provider) {
    return <div className="text-red-500">Provider data not available</div>;
  }

  const payments = provider.overview?.payments || {};
  const mipsScore = provider.overview?.mipsScore || {};
  const paymentCategories = payments.categories || [];

  const paymentValues = [
    payments.total2021 || 0,
    payments.total2022 || 0,
    payments.total2023 || 0,
  ];

  const svgWidth = 300;
  const svgHeight = 160;

  const xStep = svgWidth / (paymentValues.length - 1);
  const xPositions = paymentValues.map((_, idx) => idx * xStep);

  const maxPayment = Math.max(...paymentValues, 1);
  const yPositions = paymentValues.map(
    (val) => svgHeight - (val / maxPayment) * svgHeight
  );

  const linePath = xPositions
    .map((x, i) => `${i === 0 ? "M" : "L"}${x} ${yPositions[i]}`)
    .join(" ");
  const areaPath = `${linePath} L${svgWidth} ${svgHeight} L0 ${svgHeight} Z`;

  return (
    <div className="p-6 bg-gray-50">
      <h2 className="text-xl font-semibold mb-6">Payments & Medicare Data</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-700 rounded-md">
                <LuDollarSign size={20} />
              </div>
              <h3 className="font-semibold text-lg">Open Payments Summary</h3>
            </div>
            <span className="text-sm text-gray-500">Last 3 Years</span>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-7">
              <div className="relative h-44">
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400">
                  <span>${(maxPayment / 1e3).toFixed(0)}k</span>
                  <span>${((maxPayment * 0.75) / 1e3).toFixed(0)}k</span>
                  <span>${((maxPayment * 0.5) / 1e3).toFixed(0)}k</span>
                  <span>${((maxPayment * 0.25) / 1e3).toFixed(0)}k</span>
                  <span>$0k</span>
                </div>

                <svg
                  className="ml-10"
                  width="100%"
                  height="100%"
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                >
                  <defs>
                    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  <path d={areaPath} fill="url(#fade)" />

                  <path
                    d={linePath}
                    stroke="#1d4ed8"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>

                <div className="flex justify-between text-xs text-gray-500 mt-2 ml-10">
                  <span>2021</span>
                  <span>2022</span>
                  <span>2023</span>
                </div>
              </div>
            </div>

            <div className="col-span-5 text-sm">
              <h4 className="text-gray-500 mb-3 tracking-wide">
                2023 BREAKDOWN
              </h4>

              {paymentCategories.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between py-1 text-gray-700"
                >
                  <span>{item.name}</span>
                  <span className="font-medium">
                    ${item.amount.toLocaleString()}
                  </span>
                </div>
              ))}

              <hr className="my-3" />

              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-blue-700">
                  ${payments.total2023?.toLocaleString() || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-white border rounded-xl p-6 text-center">
            <div className="flex justify-center mb-2 text-blue-700">
              <AiOutlineRise size={24} />
            </div>
            <h4 className="font-semibold text-gray-700 mb-4">
              Medicare MIPS Score
            </h4>

            <div className="text-4xl font-bold text-blue-800">
              {mipsScore.current || 0}
            </div>
            <span className="text-sm text-gray-500">out of 100</span>

            <hr className="my-4" />

            <div className="text-left text-sm">
              <p className="text-gray-500 mb-2">HISTORICAL SCORES</p>
              {(mipsScore.trend || []).map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{item.year}</span>
                  <span>{item.score}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border rounded-xl p-6 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">MEDICARE OPT-OUT</p>
              <p className="font-medium">Affidavit Status</p>
            </div>
            <span className="flex items-center gap-1 text-green-700 bg-green-100 px-3 py-1 rounded-full text-sm">
              <BsCheckCircle size={16} />
              Participating
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
