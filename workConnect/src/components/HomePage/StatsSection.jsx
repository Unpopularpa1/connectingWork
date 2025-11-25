const StatsSection = () => {
  const stats = [
    { value: "10,000+", label: "Active Users" },
    { value: "50,000+", label: "Jobs Completed" },
    { value: "4.9/5", label: "Average Rating" },
    { value: "Rs2.5Cr+", label: "Earned by Workers" },
  ];

  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-blue-100 text-lg">
            Join a thriving community of workers and job posters
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-blue-100">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
