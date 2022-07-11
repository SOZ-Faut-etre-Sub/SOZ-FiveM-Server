import React from 'react';

const CameraIcon: React.FC = props => {
    return (
        <svg {...props} viewBox="0 0 2048 2048" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="App Icon / Apple / Camera /">
                <rect id="Origin Color" width="2048" height="2048" fill="url(#paint0_linear_0_829)" />
                <g id="Group">
                    <path
                        id="Camera Icon"
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M838.96 460C793.093 460 751.239 486.145 731.12 527.364L720.36 549.409C696.888 597.497 648.058 628 594.547 628H394C332.144 628 282 678.144 282 740V1448C282 1509.86 332.144 1560 394 1560H1654C1715.86 1560 1766 1509.86 1766 1448V740C1766 678.144 1715.86 628 1654 628H1451.45C1397.94 628 1349.11 597.497 1325.64 549.409L1314.88 527.364C1294.76 486.145 1252.91 460 1207.04 460H838.96ZM484 514C464.118 514 448 530.118 448 550V586H590V550C590 530.118 573.882 514 554 514H484ZM1024.02 1396C847.27 1396 704 1252.74 704 1076C704 899.22 847.27 756 1024.02 756C1200.77 756 1344 899.22 1344 1076C1344 1252.74 1200.77 1396 1024.02 1396ZM1024 812C878.165 812 760 930.131 760 1076C760 1221.82 878.165 1340 1024 1340C1169.83 1340 1288 1221.82 1288 1076C1288 930.131 1169.83 812 1024 812Z"
                        fill="#2E2E30"
                    />
                    <path
                        id="Path"
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M1354 782.022C1354 807.414 1374.59 828 1400 828C1425.45 828 1446 807.414 1446 782.022C1446 756.631 1425.45 736 1400 736C1374.59 736 1354 756.631 1354 782.022Z"
                        fill="#F6D254"
                    />
                </g>
            </g>
            <defs>
                <linearGradient id="paint0_linear_0_829" x1="0" y1="0" x2="0" y2="2048" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#DBDDDE" />
                    <stop offset="1" stopColor="#898B91" />
                </linearGradient>
            </defs>
        </svg>
    );
};

export default CameraIcon;
