import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M11 20A7 7 0 0 1 4 13" />
      <path d="M11 20A7 7 0 0 0 18 13" />
      <path d="M11 20V3" />
      <path d="M13 11.5A2.5 2.5 0 0 0 8.5 9" />
      <path d="M13.5 6.5A2.5 2.5 0 0 1 9 4" />
    </svg>
  );
}
