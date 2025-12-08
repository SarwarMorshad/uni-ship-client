import { FaTruck, FaMoneyBillWave, FaWarehouse, FaBuilding } from "react-icons/fa";

const HowItWorks = () => {
  const services = [
    {
      id: 1,
      icon: <FaTruck className="text-4xl" />,
      title: "Booking Pick & Drop",
      description: "From personal packages to business shipments — we deliver on time, every time.",
    },
    {
      id: 2,
      icon: <FaMoneyBillWave className="text-4xl" />,
      title: "Cash On Delivery",
      description: "From personal packages to business shipments — we deliver on time, every time.",
    },
    {
      id: 3,
      icon: <FaWarehouse className="text-4xl" />,
      title: "Delivery Hub",
      description: "From personal packages to business shipments — we deliver on time, every time.",
    },
    {
      id: 4,
      icon: <FaBuilding className="text-4xl" />,
      title: "Booking SME & Corporate",
      description: "From personal packages to business shipments — we deliver on time, every time.",
    },
  ];

  return (
    <section className="bg-gray-100 py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a4c] mb-8 md:mb-12">How it Works</h2>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mb-4 text-[#1e3a4c]">
                {service.icon}
              </div>

              {/* Title */}
              <h3 className="text-lg md:text-xl font-bold text-[#1e3a4c] mb-3">{service.title}</h3>

              {/* Description */}
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
