import type { SVGProps } from "react";
// const SpinnerIcon = (props: SVGProps<SVGSVGElement>) => <svg {...props} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 6l0 -3"></path><path d="M6 12l-3 0"></path><path d="M7.75 7.75l-2.15 -2.15"></path></svg>
// export default SpinnerIcon;


const SpinnerIcon = (props: SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 3a9 9 0 1 0 9 9" /></svg>
export default SpinnerIcon;
