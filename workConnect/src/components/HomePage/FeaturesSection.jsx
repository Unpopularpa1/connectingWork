const FeaturesSection = ({ Search, Shield, TrendingUp }) => {
  const features = [
    {
      icon: Search,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      title: "Easy Job Discovery",
      description:
        `Browse thousands of verified job opportunities in your area, from tutoring to home services.`,
    },
    {
      icon: Shield,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      title: "Secure & Trusted",
      description:
        `All users are verified with personal details and citizenship cards for your safety and peace of mind.`,
    },
    {
      icon: TrendingUp,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      title: "Build Your Reputation",
      description:
        `Earn ratings and build a professional profile that showcases your skills and reliability.`,
    },
  ];

  return (
    <section className="py-16 px-4 bg-white sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto ">
        <div className="grid md:grid-cols-3 gap-8 ">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center border border-gray-200 hover:shadow-md transition-shadow bg-white p-6 rounded-xl ">
                <div
                  className={`${feature.bgColor} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <Icon className={`w-8 h-8 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
