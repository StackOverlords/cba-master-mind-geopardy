import type { SVGProps } from "react";

const ExcelIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`text-green-600 ${props.className || ""}`}
  >
    <path d="M4 4h16v16H4z" fill="#1D6F42" />
    <path d="M8 8h1.5l1 2 1-2H13l-1.75 3L13 14h-1.5l-1.125-2-1.125 2H8l1.75-3z" fill="#fff" />
  </svg>
);

export default ExcelIcon;
