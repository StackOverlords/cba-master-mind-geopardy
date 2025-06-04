export const GameNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md text-center border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <svg
          className="w-16 h-16 text-red-500 mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h1 className="text-3xl font-bold mb-2">404</h1>
        <h2>Game Not Found</h2>
        <p>The game you are looking for does not exist or has ended.</p>
      </div>
      <a
        href="/"
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Go Back
      </a>
    </div>
  );
};
