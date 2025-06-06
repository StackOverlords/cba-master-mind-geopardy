const BackgroundPattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-5" viewBox="0 0 100 100">
    <defs>
      <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
        <path d="m 10,0 l 0,10 l -10,0 z" fill="none" stroke="currentColor" strokeWidth="0.5"/>
      </pattern>
    </defs>
    <rect width="100" height="100" fill="url(#grid)" />
  </svg>
);
export default BackgroundPattern;