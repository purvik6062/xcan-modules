import Link from "next/link";
import Image from "next/image";
import "../styles/gamify.css";

export default function Footer() {
  return (
    <footer className="bg-[#1e293b] border-t border-gray-200 bg-gradient-to-r from-[#010229] to-[#01056b] py-6 w-full mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center justify-center md:justify-start mb-2">
              <Image 
                src="/inorbit2.svg" 
                alt="Arbitrum Quest Logo" 
                width={150} 
                height={32} 
                className="h-auto" 
              />
            </div>
            <p className="text-center md:text-left text-gray-400 text-sm ml-[7px]">
              © {new Date().getFullYear()} CodeQuest. All rights reserved.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            <Link
              href="/"
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              About
            </Link>
            <Link
              href="/"
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/"
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/"
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
