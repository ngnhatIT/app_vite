import React from "react";
import { useNavigate } from "react-router-dom";

const CheckMail = () => {
  const navigate = useNavigate();

  return (
    <div className="card-2 inline-flex flex-col flex-shrink-0 justify-center items-start gap-11 pt-[4.25rem] pb-[4.25rem] px-[5.5rem] h-[606px] rounded-[32px] border-2 border-[#985ff6]/50 bg-[#bfbfbf]/[.6] w-[600px]">
      {/* ICON */}
      <svg
        width={100}
        height={100}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.4">
          <path
            opacity="0.3"
            d="M75.7106 9.70834H24.2897C13.7515 9.70834 5.2085 18.7538 5.2085 29.912V70.1297C5.2085 81.2878 13.7515 90.3333 24.2897 90.3333H75.7106C86.2489 90.3333 94.7918 81.2878 94.7918 70.1297V29.912C94.7918 18.7538 86.2489 9.70834 75.7106 9.70834Z"
            fill="#EFE6FD"
          />
          <path
            d="M50.0007 52.2603C46.4345 52.2464 42.9834 50.9958 40.2362 48.7218L25.007 36.1353C24.3239 35.5413 23.9048 34.7004 23.8418 33.7973C23.7788 32.8943 24.0771 32.0033 24.6711 31.3202C25.265 30.6371 26.106 30.218 27.009 30.155C27.912 30.092 28.8031 30.3903 29.4862 30.9843L44.6257 43.5707C46.168 44.869 48.1192 45.5808 50.1351 45.5808C52.151 45.5808 54.1022 44.869 55.6445 43.5707L70.3809 31.0739C71.0361 30.5601 71.8606 30.3118 72.6905 30.3782C73.5204 30.4446 74.295 30.8208 74.8601 31.4322C75.4329 32.1134 75.7161 32.9918 75.6491 33.8792C75.5822 34.7667 75.1703 35.5926 74.5018 36.1801L59.7653 48.677C57.0338 50.9837 53.576 52.2527 50.0007 52.2603Z"
            fill="#EFE6FD"
          />
        </g>
      </svg>

      {/* TITLE */}
      <div className="flex flex-col justify-center items-start self-stretch">
        <h2 className="text-[#f8f9fa] font-['Poppins'] text-5xl font-medium leading-[normal] capitalize">
          Check Your Email
        </h2>
        <p className="text-[#9e9e9e] font-['Poppins'] text-sm leading-5 mt-2">
          A confirmation email has been sent to your email address. Please check your inbox to verify your account. Thank you!
        </p>
      </div>

      {/* ACTION */}
      <div className="flex flex-col items-start w-[518px]">
        <div className="flex items-start gap-4 self-stretch">
          <button
            className="button-primary flex justify-center items-center gap-3 py-4 px-6 rounded-lg bg-[#6610f2] text-white font-['Poppins'] text-[.9375rem] font-medium leading-5"
            onClick={() => navigate("/dashboard")}
          >
            Skip For Now
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex justify-center items-center gap-2">
        <span className="text-[#9e9e9e] font-['Poppins'] text-sm leading-5">
          Didn't receive an email?
        </span>
        <button
          onClick={() => console.log("Resend clicked")}
          className="text-[#e476ad] font-['Poppins'] text-sm leading-5 underline"
        >
          Resend
        </button>
      </div>
    </div>
  );
};

export default CheckMail;
