import Link from "next/link";
import "../styles/gamify.css";

export default function Footer() {
  return (
    <footer className="dark:bg-[#1e293b] border-t border-gray-200 bg-gradient-to-r from-[#010229] to-[#01056b] py-6 w-full mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center justify-center md:justify-start mb-2">
              <span className="text-gray-200 dark:text-white text-xl font-bold">Arbitrum</span>
              <span className="ml-1 bg-blue-600 text-white dark:bg-[#152241] dark:text-blue-400 px-2 py-0.5 rounded text-xs font-bold">
                Quest
              </span>
            </div>
            <p className="text-center md:text-left text-gray-100 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} CodeQuest. All rights reserved.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            <Link
              href="/"
              className="text-gray-100 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              About
            </Link>
            <Link
              href="/"
              className="text-gray-100 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/"
              className="text-gray-100 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/"
              className="text-gray-100 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Contact
            </Link>
          </div>
          
          {/* <div className="mt-4 md:mt-0 hidden md:flex items-center space-x-4">
            <a href="https://github.com/arbitrum-foundation" target="_blank" rel="noopener noreferrer" className="text-gray-100 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
            <a href="https://discord.gg/arbitrum" target="_blank" rel="noopener noreferrer" className="text-gray-100 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 9a5 5 0 0 0-5-5H9a5 5 0 0 0-5 5v4a5 5 0 0 0 5 5h2l2 2 2-2h2a5 5 0 0 0 5-5V9Z"></path>
                <path d="M8 11v.01M12 11v.01M16 11v.01"></path>
              </svg>
            </a>
            <a href="https://twitter.com/arbitrum" target="_blank" rel="noopener noreferrer" className="text-gray-100 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </a>
          </div> */}
        </div>
      </div>
    </footer>
  );
}
