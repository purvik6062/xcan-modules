import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-[#010229] via-[#01056b] to-[#1e40af] text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
          Master Stylus Core Concepts
        </h1>
        <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
          Learn, build, and master Arbitrum through comprehensive learning
          modules. From precompiles to Stylus, from DeFi to cross-chain
          development.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/challenges"
            className="bg-white text-blue-600 hover:bg-gray-800 hover:text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Start Learning
          </Link>
          <Link
            href="#modules"
            className="border-2 border-white text-white hover:bg-green-500 hover:text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Explore Modules
          </Link>
          <Link
            href="https://arbitrum-university.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-orange-500 text-white hover:bg-pink-600 font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Explore University
          </Link>
        </div>
      </div>
    </section>
  );
}
