"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { FiCheckCircle, FiGithub, FiArrowRight } from "react-icons/fi";

export default function AuthSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const githubUsername = searchParams.get("github_username");

  useEffect(() => {
    // Redirect to main app after 3 seconds
    const timer = setTimeout(() => {
      router.push("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

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
            className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FiCheckCircle className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-2xl font-bold text-white mb-4">
            GitHub Connected Successfully!
          </h1>

          <div className="flex items-center justify-center space-x-2 mb-6">
            <FiGithub className="w-5 h-5 text-gray-300" />
            <span className="text-gray-300">
              Connected as: <span className="text-blue-400 font-semibold">@{githubUsername}</span>
            </span>
          </div>

          <p className="text-gray-300 mb-6 leading-relaxed">
            Your GitHub account has been successfully linked to your wallet.
            You now have full access to all features.
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
              <FiArrowRight className="w-4 h-4" />
              <span>Redirecting to dashboard...</span>
            </div>

            <button
              onClick={() => router.push("/")}
              className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Go to Dashboard Now
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
} 