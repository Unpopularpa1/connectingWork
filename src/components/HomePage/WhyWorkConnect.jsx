const WhyWorkConnect = ({
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  Star,
  Users,
  Building,
}) => {
  const features = [
    {
      icon: Users,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      title: "Verified Community",
      description:
        "All users undergo identity verification with citizenship cards and personal details for maximum security.",
    },
    {
      icon: Building,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      title: "Diverse Job Categories",
      description:
        "From tutoring and cleaning to security and pet care - find work that matches your skills and schedule.",
    },
    {
      icon: MessageSquare,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      title: "Secure Messaging",
      description:
        "Communicate safely with job posters and workers through our built-in messaging system.",
    },
    {
      icon: Star,
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
      title: "Rating System",
      description:
        "Build your reputation with honest reviews and ratings that help you stand out from the crowd.",
    },
    {
      icon: DollarSign,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      title: "Fair Payment",
      description:
        "Set your rates, negotiate terms, and get paid fairly for your valuable work and services.",
    },
    {
      icon: Clock,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      title: "Flexible Schedule",
      description:
        "Work when you want, where you want. Perfect for part-time income or full-time opportunities.",
    },
    {
      icon: AlertTriangle,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
      title: "Safety First",
      description:
        "Emergency contact system, profile verification, and community guidelines ensure everyone's safety.",
    },
    {
      icon: CheckCircle,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      title: "Quality Assurance",
      description:
        "Job completion tracking, milestone payments, and dispute resolution keep everyone protected.",
    },
  ];

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose WorkConnect?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We've built the most comprehensive platform for connecting job
            seekers with meaningful work opportunities in their community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
              >
                <div
                  className={`${feature.bgColor} w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyWorkConnect;
