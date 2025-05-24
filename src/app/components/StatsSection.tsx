export default function StatsSection() {
  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">6</div>
            <div className="text-gray-600 dark:text-gray-300">
              Learning Modules
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">59+</div>
            <div className="text-gray-600 dark:text-gray-300">
              Interactive Challenges
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">1</div>
            <div className="text-gray-600 dark:text-gray-300">
              Available Now
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">5</div>
            <div className="text-gray-600 dark:text-gray-300">Coming Soon</div>
          </div>
        </div>
      </div>
    </section>
  );
}
