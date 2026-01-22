import Link from "next/link";
import Image from "next/image";
import "../styles/gamify.css";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#010229] to-[#01056b] border-t border-gray-700/50 py-8 w-full mt-auto">
      <div className="container mx-auto px-4">
        {/* Main footer content */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          {/* Brand section */}
          <div className="mb-6 md:mb-0">
            <div className="flex items-center justify-center md:justify-start mb-3">
              <div className="relative">
                <span className="text-2xl font-bold text-white">Modules</span>
                <span className="absolute -bottom-2 right-0 text-xs text-blue-300 translate-x-2">
                  (by Xcan)
                </span>
              </div>
            </div>
          </div>

          {/* Navigation links */}
          <div className="flex flex-wrap justify-center md:justify-end gap-6 md:gap-8">
          <p className="text-center text-gray-200 text-xs">
            © {new Date().getFullYear()} Modules by Xcan. All rights
            reserved.
          </p>
          </div>
        </div>

        {/* Copyright section - separated for better visual hierarchy */}
        {/* <div className="border-t border-gray-700/30 pt-4">
          <p className="text-center text-gray-200 text-xs">
            © {new Date().getFullYear()} Modules by Xcan. All rights
            reserved.
          </p>
        </div> */}
      </div>
    </footer>
  );
}
