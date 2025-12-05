import { Link, useNavigate } from "react-router-dom";

const CtaSection = ({ Users, Building }) => {
  const navigate=useNavigate();

  const cards = [
    {
      icon: Users,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      title: "For Workers",
      description:
        "Find flexible work opportunities, build your reputation, and earn money on your own terms.",
      buttonText: "Start Finding Work →",
      buttonStyle: "bg-blue-600 hover:bg-blue-700",
    },
    {
      icon: Building,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      title: "For Job Posters",
      description:
        "Post your tasks, find qualified workers, and get things done quickly and reliably.",
      buttonText: "Post Your First Job →",
      buttonStyle: "bg-green-600 hover:bg-green-700",
    },
  ];

  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Whether you're looking for work or need tasks completed, WorkConnect
            is your trusted platform for success.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className="bg-white rounded-lg p-8 text-center">
                <div
                  className={`${card.bgColor} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <Icon className={`w-8 h-8 ${card.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {card.title}
                </h3>
                <p className="text-gray-600 mb-6">{card.description}</p>
               
                  <button onClick={()=>navigate(token?"/dashboard":"/login")}
                    className={`w-full ${card.buttonStyle} text-white py-3 rounded-lg font-semibold transition-colors cursor-pointer`}
                  >
                    {card.buttonText}
                  </button>
           
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
