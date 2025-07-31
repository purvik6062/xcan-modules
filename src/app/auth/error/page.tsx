"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiAlertCircle, FiArrowLeft, FiRefreshCw } from "react-icons/fi";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get("error");

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case "access_denied":
        return "GitHub access was denied. Please try again and authorize the application.";
      case "missing_params":
        return "Missing required parameters. Please try connecting again.";
      case "token_error":
        return "Failed to exchange authorization code. Please try again.";
      case "user_error":
        return "Failed to fetch user information from GitHub. Please try again.";
      case "server_error":
        return "An internal server error occurred. Please try again later.";
      case "invalid_state":
        return "Invalid state parameter. Please try connecting again.";
      default:
        return "An unexpected error occurred. Please try again.";
    }
  };

  const handleRetry = () => {
    router.push("/");
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020816] to-[#0D1221] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full text-center"
      >
        <div className="bg-[#0D1221] p-8 rounded-2xl shadow-2xl border border-gray-700">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FiAlertCircle className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-2xl font-bold text-white mb-4">
            Connection Failed
          </h1>

          <p className="text-gray-300 mb-6 leading-relaxed">
            {getErrorMessage(error)}
          </p>

          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <FiRefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>

            <button
              onClick={handleGoBack}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 