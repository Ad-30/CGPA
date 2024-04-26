
export function Loader() {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative w-12 h-12 text-gray-500 dark:text-gray-400 animate-spin">
          <svg className="absolute inset-0" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="20" strokeWidth="4" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 6v6l4 2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Calculating your SGPA...</p>
      </div>
    )
  }
  