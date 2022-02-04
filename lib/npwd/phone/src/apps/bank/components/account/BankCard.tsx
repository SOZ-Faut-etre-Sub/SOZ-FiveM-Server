import React from 'react';

export const BankCard = (props) => {
  return (
      <>
          <div className="relative mx-10 bg-[#604b9b] flex flex-col justify-between h-48 rounded-2xl" />
          <div className="relative -top-48 m-5 bg-[#4e4b49] flex flex-col justify-between h-48 rounded-2xl">
              <div className="flex justify-end font-bold text-white pr-5 pt-3">
                  BANK
              </div>
              <div className="m-3">
                  <svg width="42" height="34" viewBox="0 0 42 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <mask id="mask0_518_21" maskUnits="userSpaceOnUse" x="1" y="0" width="40" height="33">
                          <rect x="1" y="0.707764" width="40" height="32" rx="5" fill="#F0F0F0"/>
                      </mask>
                      <g mask="url(#mask0_518_21)">
                          <rect x="1" y="0.707764" width="40" height="32" rx="5" fill="#F0F0F0"/>
                          <path
                              d="M26 11.7078V11.2078H25.5V11.7078H26ZM50 11.7078H50.5V11.2078H50V11.7078ZM50 21.7078V22.2078H50.5V21.7078H50ZM26 21.7078H25.5V22.2078H26V21.7078ZM-8 11.7078V11.2078H-8.5V11.7078H-8ZM16 11.7078H16.5V11.2078H16V11.7078ZM16 21.7078V22.2078H16.5V21.7078H16ZM-8 21.7078H-8.5V22.2078H-8V21.7078ZM26 12.2078H50V11.2078H26V12.2078ZM49.5 11.7078V21.7078H50.5V11.7078H49.5ZM50 21.2078H26V22.2078H50V21.2078ZM26.5 21.7078V11.7078H25.5V21.7078H26.5ZM-8 12.2078H16V11.2078H-8V12.2078ZM15.5 11.7078V21.7078H16.5V11.7078H15.5ZM16 21.2078H-8V22.2078H16V21.2078ZM-7.5 21.7078V11.7078H-8.5V21.7078H-7.5ZM14 34.7078L19 28.7078L18.2318 28.0676L13.2318 34.0676L14 34.7078ZM23 28.7078L28.5227 34.2304L29.2298 33.5233L23.7071 28.0007L23 28.7078ZM13.2554 -0.525897L18.2673 5.4641L19.0343 4.82239L14.0223 -1.16761L13.2554 -0.525897ZM27.5649 -1.29224L23.0001 5.04512L23.8115 5.62959L28.3764 -0.707765L27.5649 -1.29224ZM23 22.7078V28.7078H24V22.7078H23ZM18 22.7078V28.7078H19V22.7078H18ZM18 4.70776V10.7078H19V4.70776H18ZM23 4.70776V10.7078H24V4.70776H23ZM26 21.7078H24V22.7078H26V21.7078ZM18 21.7078H16V22.7078H18V21.7078ZM26 10.7078H24V11.7078H26V10.7078ZM18 10.7078H16V11.7078H18V10.7078Z"
                              fill="black" fillOpacity="0.4"/>
                      </g>
                  </svg>
              </div>
              <div className="flex justify-between text-white font-thin mx-3 pb-3">
                  <h2>{props.name}</h2>
                  <h3>${props.balance}</h3>
              </div>
          </div>
      </>
  );
};
