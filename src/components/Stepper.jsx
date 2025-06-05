import React from "react";

const steps = ["Chọn phim / Rạp / Suất", "Chọn ghế", "Thanh toán", "Xác nhận"];

const Stepper = ({ currentStep }) => (
  <div className="flex items-center justify-center w-full mb-8">
    {steps.map((step, idx) => (
      <React.Fragment key={step}>
        <div className="flex flex-col items-center">
          <div
            className={`rounded-full w-8 h-8 flex items-center justify-center font-bold text-white ${
              idx <= currentStep ? "bg-orange-400" : "bg-gray-300"
            }`}
          >
            {idx + 1}
          </div>
          <span
            className={`mt-2 text-xs font-medium ${
              idx === currentStep ? "text-orange-500" : "text-gray-500"
            }`}
          >
            {step}
          </span>
        </div>
        {idx < steps.length - 1 && (
          <div
            className={`flex-1 h-1 mx-2 ${
              idx < currentStep ? "bg-orange-400" : "bg-gray-300"
            }`}
          ></div>
        )}
      </React.Fragment>
    ))}
  </div>
);

export default Stepper;
