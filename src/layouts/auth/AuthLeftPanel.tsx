import { useDispatch, useSelector } from "react-redux";
import { Select } from "antd";
import type { RootState } from "../../app/store";
import { toggleTheme } from "../../features/setting/ThemeSlice";

const { Option } = Select;

const AuthLeftPanel = () => {
  const dispatch = useDispatch();
  const isDark = useSelector((state: RootState) => state.theme.darkMode);

  const currentTheme = isDark ? "dark" : "light";

  const handleThemeChange = (value: string) => {
    if (value !== currentTheme) {
      dispatch(toggleTheme());
    }
  };

  return (
    <div className="card flex flex-col flex-shrink-0 border-[#000000]/0 bg-[#bfbfbf]/[.6]">
      <div className="body-card-2 flex flex-col justify-center items-start py-3 px-2 ">
        {/* SVG logo */}
        <svg
          width={150}
          height={120}
          viewBox="0 0 150 151"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M62.1625 19.7H87.85C99.35 19.7 108.413 19.7 115.538 20.6375C122.85 21.6375 128.788 23.7 133.475 28.3875C138.163 33.075 140.225 39.0125 141.225 46.325C141.788 50.5125 142.038 55.45 142.1 61.075C142.1 61.325 142.163 61.575 142.163 61.8875V83.7625C142.163 86.325 140.038 88.45 137.475 88.45C134.913 88.45 132.788 86.325 132.788 83.7625V66.575H54.6625V94.7H74.975C77.5375 94.7 79.6625 96.825 79.6625 99.3875C79.6625 101.95 77.5375 104.075 74.975 104.075H54.6625V132.2H74.975C77.5375 132.2 79.6625 134.325 79.6625 136.888C79.6625 139.45 77.5375 141.575 74.975 141.575H49.975C49.725 141.575 49.4125 141.575 49.1625 141.513C43.475 141.388 38.6 141.2 34.4125 140.638C27.1 139.638 21.1625 137.575 16.475 132.888C11.7875 128.2 9.72501 122.263 8.72501 114.95C8.16251 110.763 7.91251 105.825 7.85001 100.2C7.85001 99.95 7.78751 99.7 7.78751 99.3875V61.95C7.78751 61.7 7.78751 61.3875 7.85001 61.1375C7.97501 55.45 8.16251 50.575 8.72501 46.3875C9.72501 39.075 11.7875 33.1375 16.475 28.45C21.1625 23.7625 27.1 21.7 34.4125 20.7C38.6 20.1375 43.5375 19.8875 49.1625 19.825C49.4125 19.825 49.6625 19.7625 49.975 19.7625H62.1L62.1625 19.7ZM45.35 29.2625C41.6625 29.3875 38.5375 29.575 35.725 29.95C29.4125 30.825 25.7875 32.3875 23.1625 35.0125C20.5375 37.6375 18.9125 41.2625 18.1 47.575C17.725 50.3875 17.5375 53.5125 17.4125 57.2H45.35V29.2625ZM54.725 57.2V29.075H87.5375C99.475 29.075 107.912 29.075 114.35 29.95C120.662 30.825 124.288 32.3875 126.913 35.0125C129.538 37.6375 131.162 41.2625 131.975 47.575C132.35 50.3875 132.538 53.5125 132.663 57.2H54.725ZM45.35 66.575H17.225V94.7H45.35V66.575ZM45.35 104.075H17.4125C17.5375 107.763 17.725 110.888 18.1 113.7C18.975 120.013 20.5375 123.638 23.1625 126.263C25.7875 128.888 29.4125 130.513 35.725 131.325C38.5375 131.7 41.6625 131.888 45.35 132.013V104.075ZM105.663 86.575C108.35 80.7625 116.663 80.7625 119.413 86.575L123.35 94.95C124.6 97.6375 126.787 99.825 129.475 101.075L137.85 105.013C143.663 107.7 143.663 116.013 137.85 118.763L129.475 122.7C126.787 123.95 124.6 126.138 123.35 128.825L119.413 137.2C116.725 143.013 108.413 143.013 105.663 137.2L101.725 128.825C100.475 126.138 98.2875 123.95 95.6 122.7L87.225 118.763C81.4125 116.075 81.4125 107.763 87.225 105.013L95.6 101.075C98.2875 99.825 100.475 97.6375 101.725 94.95L105.663 86.575ZM112.538 94.0125L110.225 98.95C108.045 103.669 104.257 107.458 99.5375 109.638L94.6 111.95L99.5375 114.263C104.225 116.45 108.038 120.2 110.225 124.95L112.538 129.888L114.85 124.95C117.037 120.263 120.788 116.45 125.538 114.263L130.475 111.95L125.538 109.638C120.818 107.458 117.03 103.669 114.85 98.95L112.538 94.0125Z"
            fill="url(#paint0_linear_32_33)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_32_33"
              x1={8}
              y1={20}
              x2={142}
              y2={142}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="0.5" stopColor="#E476AD" />
              <stop offset={1} stopColor="#6610F2" />
            </linearGradient>
          </defs>
        </svg>

        {/* Title */}
        <div className="frame_20 flex flex-col items-start self-stretch pt-10">
          <div className="frame_4 flex flex-col items-start self-stretch">
            <div className="text-[#985ff6] font-['Poppins'] text-5xl font-medium leading-[48px] capitalize">
              Google Sheet
            </div>
            <div
              className={`opacity-[0.8] font-['Poppins'] text-[2rem] leading-[normal] capitalize ${
                isDark ? "text-neutral-100" : "text-[#2c2c2c]"
              }`}
            >
              Work Space
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col items-start gap-1 self-stretch pt-10">
            <div className="text-[#9e9e9e] font-['Poppins'] text-xs leading-[normal]">
              Product by Cloud.com Group Inc.
            </div>
            <div className="self-stretch text-[#9e9e9e] font-['Poppins'] text-xs leading-[normal]">
              Welcome to the workspace, please log in to continue.
            </div>
          </div>
        </div>

        {/* Theme Dropdown */}
        <div className="row flex flex-col items-start pt-15 gap-2">
          <div className="flex items-center gap-4 min-h-[3rem] max-h-12 rounded-lg border border-[#4b3b61] bg-white/[.6] px-4 py-2">
            {isDark ? (
              // DARK MODE SVG
              <svg
                width={18}
                height={19}
                viewBox="0 0 18 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.883 3.00801L10.812 3.59376L11.883 4.17951L12.4688 5.25051L13.0545 4.17951L14.1255 3.59376L13.0545 3.00801L12.4688 1.93701L11.883 3.00801ZM7.809 3.61851C6.82673 3.81782 5.91004 4.26002 5.14264 4.90473C4.37523 5.54944 3.78156 6.37613 3.41583 7.3093C3.05009 8.24248 2.92396 9.2524 3.04894 10.2469C3.17392 11.2413 3.54603 12.1886 4.1313 13.0023C4.71656 13.8159 5.49634 14.47 6.39941 14.9048C7.30248 15.3396 8.30008 15.5412 9.30112 15.4912C10.3022 15.4413 11.2747 15.1414 12.13 14.6188C12.9854 14.0963 13.6961 13.3679 14.1975 12.5C12.4164 12.4862 10.713 11.7689 9.45843 10.5045C8.20389 9.24014 7.49995 7.53116 7.5 5.75001C7.5 5.01501 7.59825 4.29726 7.809 3.61851ZM1.5 9.50001C1.5 5.35776 4.85775 2.00001 9 2.00001H10.3005L9.6495 3.12501C9.21525 3.87501 9 4.76751 9 5.75001C8.99989 6.52522 9.17145 7.29084 9.50237 7.99187C9.83329 8.69291 10.3154 9.31196 10.9139 9.80456C11.5125 10.2972 12.2128 10.6511 12.9644 10.8409C13.716 11.0308 14.5003 11.0518 15.261 10.9025L16.5225 10.6573L16.1152 11.8768C15.1215 14.8528 12.3127 17 9 17C4.85775 17 1.5 13.6423 1.5 9.50001ZM15.375 5.31201L16.0605 6.56451L17.313 7.25001L16.0605 7.93551L15.375 9.18801L14.6895 7.93551L13.437 7.25001L14.6895 6.56451L15.375 5.31201Z"
                  fill="#F8F9FA"
                />
              </svg>
            ) : (
              // LIGHT MODE SVG
              <svg
                width={18}
                height={19}
                viewBox="0 0 18 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_50_128)">
                  <path
                    d="M17.1 8.7791H16.218C15.7203 8.7791 15.318 9.1022 15.318 9.5C15.318 9.8969 15.7203 10.2191 16.218 10.2191H17.1C17.5968 10.2191 18 9.8978 18 9.5C18 9.1031 17.5959 8.7791 17.1 8.7791ZM9 4.55C8.34939 4.54798 7.7048 4.67464 7.10333 4.92268C6.50186 5.17073 5.95537 5.53526 5.49532 5.99532C5.03526 6.45537 4.67073 7.00186 4.42268 7.60333C4.17464 8.2048 4.04798 8.84939 4.05 9.5C4.05 12.2459 6.2541 14.45 9 14.45C11.745 14.45 13.95 12.2459 13.95 9.5C13.95 6.7541 11.7441 4.55 9 4.55ZM9 13.1C7.0101 13.1 5.4 11.4881 5.4 9.5C5.4 7.5101 7.0101 5.9 9 5.9C9.95478 5.9 10.8705 6.27928 11.5456 6.95442C12.2207 7.62955 12.6 8.54522 12.6 9.5C12.6 10.4548 12.2207 11.3705 11.5456 12.0456C10.8705 12.7207 9.95478 13.1 9 13.1ZM2.7 9.5C2.7 9.1031 2.2959 8.7791 1.8 8.7791H0.9C0.4023 8.7791 0 9.1022 0 9.5C0 9.8969 0.4023 10.2191 0.9 10.2191H1.8C2.2959 10.2191 2.7 9.8969 2.7 9.5ZM9 3.2C9.3969 3.2 9.7191 2.7977 9.7191 2.3V1.4C9.7191 0.9023 9.3969 0.5 9 0.5C8.6031 0.5 8.2791 0.9023 8.2791 1.4V2.3C8.2791 2.7977 8.6022 3.2 9 3.2ZM9 15.8C8.6022 15.8 8.2791 16.2023 8.2791 16.7V17.6C8.2791 18.0977 8.6022 18.5 9 18.5C9.3969 18.5 9.7191 18.0977 9.7191 17.6V16.7C9.7191 16.2023 9.3969 15.8 9 15.8ZM..." // tiếp tục path
                    fill="#212529"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_50_128">
                    <rect
                      width={18}
                      height={18}
                      fill="white"
                      transform="translate(0 0.5)"
                    />
                  </clipPath>
                </defs>
              </svg>
            )}

            <div className="w-px h-3 bg-[#cecaca]" />

            <Select
              value={currentTheme}
              onChange={handleThemeChange}
              bordered={false}
              dropdownStyle={{ fontFamily: "Poppins" }}
              className="font-['Poppins'] text-sm text-[#f8f9fa] w-[100px] bg-transparent"
              popupClassName="theme-select-dropdown"
            >
              <Option value="light">Light</Option>
              <Option value="dark">Dark</Option>
            </Select>
          </div>

          <div className="text-[#9e9e9e] font-['Poppins'] text-xs leading-[normal] mt-4 ">
            © Cloud.com Group Inc. 2025. All rights reserved
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLeftPanel;
