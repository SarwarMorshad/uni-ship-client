import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import L from "leaflet";

// Fix for default marker icon issue in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const Coverage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Bangladesh center coordinates
  const bangladeshCenter = [23.8103, 90.4125]; // Dhaka coordinates
  const zoomLevel = 7;

  // Sample major city coordinates - you can add all 64 districts
  const majorCities = [
    { name: "Dhaka", position: [23.8103, 90.4125] },
    { name: "Chittagong", position: [22.3569, 91.7832] },
    { name: "Rajshahi", position: [24.3745, 88.6042] },
    { name: "Khulna", position: [22.8456, 89.5403] },
    { name: "Sylhet", position: [24.8949, 91.8687] },
    { name: "Barisal", position: [22.701, 90.3535] },
    { name: "Rangpur", position: [25.7439, 89.2752] },
    { name: "Mymensingh", position: [24.7471, 90.4203] },
  ];

  // Sample districts data
  const districts = [
    "Dhaka",
    "Chittagong",
    "Rajshahi",
    "Khulna",
    "Barisal",
    "Sylhet",
    "Rangpur",
    "Mymensingh",
    "Comilla",
    "Gazipur",
    "Narayanganj",
    "Tangail",
    "Bogra",
    "Pabna",
    "Jessore",
    "Cox's Bazar",
    "Dinajpur",
    "Faridpur",
    "Kushtia",
    "Sirajganj",
    "Brahmanbaria",
    "Noakhali",
    "Feni",
    "Lakshmipur",
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Implement search functionality here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1e3a4c] mb-8 text-center">
            We are available in 64 districts
          </h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-12">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search area"
                  className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-gray-200 focus:border-[#caeb66] focus:outline-none text-gray-700"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-[#caeb66] hover:bg-[#b8d959] text-gray-800 font-bold rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Search
              </button>
            </div>
          </form>

          {/* Subtitle */}
          <h2 className="text-xl md:text-2xl font-bold text-[#1e3a4c] mb-6">
            We deliver almost all over Bangladesh
          </h2>

          {/* Leaflet Map */}
          <div className="relative rounded-3xl overflow-hidden shadow-lg h-[300px] md:h-[400px] z-0">
            <MapContainer
              center={bangladeshCenter}
              zoom={zoomLevel}
              scrollWheelZoom={false}
              className="h-full w-full rounded-3xl"
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Markers for major cities */}
              {majorCities.map((city, index) => (
                <Marker key={index} position={city.position}>
                  <Popup>
                    <div className="text-center">
                      <h3 className="font-bold text-[#1e3a4c]">{city.name}</h3>
                      <p className="text-sm text-gray-600">We deliver here!</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </section>

      {/* Districts Grid Section */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a4c] mb-8 text-center">
            Our Service Coverage
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {districts.map((district, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-4 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-[#caeb66] group"
              >
                <FaMapMarkerAlt className="text-2xl text-gray-400 group-hover:text-[#caeb66] mx-auto mb-2 transition-colors" />
                <p className="text-[#1e3a4c] font-semibold">{district}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600 text-lg">
              <span className="font-bold text-[#caeb66]">64 Districts</span> covered across Bangladesh
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <h3 className="text-4xl md:text-5xl font-bold text-[#caeb66] mb-2">64</h3>
              <p className="text-gray-600 text-lg">Districts Covered</p>
            </div>
            <div className="p-6">
              <h3 className="text-4xl md:text-5xl font-bold text-[#caeb66] mb-2">492</h3>
              <p className="text-gray-600 text-lg">Upazilas Served</p>
            </div>
            <div className="p-6">
              <h3 className="text-4xl md:text-5xl font-bold text-[#caeb66] mb-2">100%</h3>
              <p className="text-gray-600 text-lg">Coverage Nationwide</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-[#1e3a4c] rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
              Not sure if we deliver to your area?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Contact our support team to confirm coverage in your specific location. We're constantly
              expanding our service areas.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-8 py-4 bg-[#caeb66] hover:bg-[#b8d959] text-gray-800 font-bold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl">
                Contact Support
              </button>
              <button className="px-8 py-4 bg-transparent hover:bg-white/10 text-white font-bold rounded-full border-2 border-white transition-all duration-300">
                View All Districts
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Coverage;
