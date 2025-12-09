import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { FaSearch, FaMapMarkerAlt, FaWarehouse, FaCheckCircle, FaTimes } from "react-icons/fa";
import L from "leaflet";

// Fix for default marker icon issue in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom marker icon for warehouses
const warehouseIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component to fly to location
function FlyToLocation({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, {
        duration: 1.5,
      });
    }
  }, [center, zoom, map]);

  return null;
}

const Coverage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredWarehouses, setFilteredWarehouses] = useState([]);
  const [mapCenter, setMapCenter] = useState([23.685, 90.3563]);
  const [mapZoom, setMapZoom] = useState(7);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchInputRef = useRef(null);

  // Bangladesh center coordinates
  const bangladeshCenter = [23.685, 90.3563];

  // Fetch warehouses from public folder
  useEffect(() => {
    fetch("/warehouses.json")
      .then((response) => response.json())
      .then((data) => {
        setWarehouses(data);
        setFilteredWarehouses(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching warehouses:", error);
        setLoading(false);
      });
  }, []);

  // Get unique districts from warehouses
  const districts = [...new Set(warehouses.map((w) => w.district))].sort();

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    // Search in warehouses
    const results = warehouses.filter(
      (warehouse) =>
        warehouse.district.toLowerCase().includes(query.toLowerCase()) ||
        warehouse.city.toLowerCase().includes(query.toLowerCase()) ||
        warehouse.region.toLowerCase().includes(query.toLowerCase()) ||
        warehouse.covered_area.some((area) => area.toLowerCase().includes(query.toLowerCase()))
    );

    setSearchResults(results);
    setShowResults(true);
  };

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();

    if (searchQuery.trim() === "") {
      resetSearch();
      return;
    }

    const filtered = warehouses.filter(
      (warehouse) =>
        warehouse.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        warehouse.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        warehouse.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        warehouse.covered_area.some((area) => area.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    setFilteredWarehouses(filtered);
    setShowResults(false);

    // Fly to first result if available
    if (filtered.length > 0) {
      setMapCenter([filtered[0].latitude, filtered[0].longitude]);
      setMapZoom(12);
    }
  };

  // Handle search result click
  const handleResultClick = (warehouse) => {
    setSearchQuery(warehouse.city);
    setFilteredWarehouses([warehouse]);
    setShowResults(false);
    setMapCenter([warehouse.latitude, warehouse.longitude]);
    setMapZoom(13);
  };

  // Reset search
  const resetSearch = () => {
    setSearchQuery("");
    setFilteredWarehouses(warehouses);
    setSearchResults([]);
    setShowResults(false);
    setMapCenter(bangladeshCenter);
    setMapZoom(7);
  };

  // Handle district card click
  const handleDistrictClick = (district) => {
    const filtered = warehouses.filter((w) => w.district === district);
    setFilteredWarehouses(filtered);
    setSearchQuery(district);
    setShowResults(false);

    // Fly to first warehouse in that district
    if (filtered.length > 0) {
      setMapCenter([filtered[0].latitude, filtered[0].longitude]);
      setMapZoom(10);
    }
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600 text-xl">Loading coverage data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1e3a4c] mb-8 text-center">
            We are available in {districts.length} districts
          </h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-12 relative" ref={searchInputRef}>
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => searchQuery && setShowResults(true)}
                  placeholder="Search district, city or area"
                  className="w-full pl-12 pr-12 py-4 rounded-full border-2 border-gray-200 focus:border-[#caeb66] focus:outline-none text-gray-700"
                  autoComplete="off"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={resetSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-[#caeb66] hover:bg-[#b8d959] text-gray-800 font-bold rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Search
              </button>
            </div>

            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-16 mt-2 bg-white rounded-2xl shadow-xl border-2 border-gray-100 max-h-96 overflow-y-auto z-50">
                {searchResults.map((warehouse, index) => (
                  <div
                    key={index}
                    onClick={() => handleResultClick(warehouse)}
                    className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <FaWarehouse className="text-green-600 text-xl mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-bold text-[#1e3a4c] mb-1">{warehouse.city}</h4>
                        <p className="text-sm text-gray-600 mb-1">
                          {warehouse.district}, {warehouse.region}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {warehouse.covered_area.slice(0, 3).map((area, idx) => (
                            <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {area}
                            </span>
                          ))}
                          {warehouse.covered_area.length > 3 && (
                            <span className="text-xs text-gray-500 px-2 py-1">
                              +{warehouse.covered_area.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Results */}
            {showResults && searchResults.length === 0 && searchQuery && (
              <div className="absolute top-full left-0 right-16 mt-2 bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-6 text-center z-50">
                <p className="text-gray-500">No warehouses found for "{searchQuery}"</p>
                <button
                  onClick={resetSearch}
                  className="mt-3 text-[#caeb66] hover:text-[#b8d959] font-semibold"
                >
                  View All Warehouses
                </button>
              </div>
            )}
          </form>

          {/* Subtitle */}
          <h2 className="text-xl md:text-2xl font-bold text-[#1e3a4c] mb-6">
            We deliver almost all over Bangladesh
          </h2>

          {/* Leaflet Map */}
          <div className="relative rounded-3xl overflow-hidden shadow-lg h-[600px]  z-0">
            <MapContainer
              center={bangladeshCenter}
              zoom={7}
              scrollWheelZoom={false}
              className="h-full w-full rounded-3xl"
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Fly to location component */}
              <FlyToLocation center={mapCenter} zoom={mapZoom} />

              {/* Markers for warehouses */}
              {filteredWarehouses.map((warehouse, index) => (
                <Marker key={index} position={[warehouse.latitude, warehouse.longitude]} icon={warehouseIcon}>
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <div className="flex items-center gap-2 mb-2">
                        <FaWarehouse className="text-green-600 text-xl" />
                        <h3 className="font-bold text-[#1e3a4c] text-lg">{warehouse.city}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>District:</strong> {warehouse.district}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Region:</strong> {warehouse.region}
                      </p>
                      <div className="mb-2">
                        <p className="text-sm font-semibold text-gray-700 mb-1">Covered Areas:</p>
                        <div className="flex flex-wrap gap-1">
                          {warehouse.covered_area.map((area, idx) => (
                            <span key={idx} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-green-600">
                        <FaCheckCircle />
                        <span className="text-sm font-semibold capitalize">{warehouse.status}</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Showing results info */}
          {searchQuery && (
            <div className="mt-4 text-center">
              <p className="text-gray-600">
                Showing <span className="font-bold text-[#caeb66]">{filteredWarehouses.length}</span>{" "}
                warehouse(s)
                {searchQuery && ` for "${searchQuery}"`}
                {filteredWarehouses.length > 0 && (
                  <button
                    onClick={resetSearch}
                    className="ml-3 text-[#caeb66] hover:text-[#b8d959] font-semibold underline"
                  >
                    Clear Filter
                  </button>
                )}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Districts Grid Section */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a4c] mb-8 text-center">
            Our Service Coverage
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {districts.map((district, index) => {
              const warehouseCount = warehouses.filter((w) => w.district === district).length;
              return (
                <div
                  key={index}
                  onClick={() => handleDistrictClick(district)}
                  className="bg-white rounded-xl p-4 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-[#caeb66] group"
                >
                  <FaMapMarkerAlt className="text-2xl text-gray-400 group-hover:text-[#caeb66] mx-auto mb-2 transition-colors" />
                  <p className="text-[#1e3a4c] font-semibold mb-1">{district}</p>
                  <p className="text-xs text-gray-500">
                    {warehouseCount} warehouse{warehouseCount !== 1 ? "s" : ""}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600 text-lg">
              <span className="font-bold text-[#caeb66]">{districts.length} Districts</span> covered with{" "}
              <span className="font-bold text-[#caeb66]">{warehouses.length} warehouses</span> across
              Bangladesh
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <h3 className="text-4xl md:text-5xl font-bold text-[#caeb66] mb-2">{districts.length}</h3>
              <p className="text-gray-600 text-lg">Districts Covered</p>
            </div>
            <div className="p-6">
              <h3 className="text-4xl md:text-5xl font-bold text-[#caeb66] mb-2">{warehouses.length}</h3>
              <p className="text-gray-600 text-lg">Active Warehouses</p>
            </div>
            <div className="p-6">
              <h3 className="text-4xl md:text-5xl font-bold text-[#caeb66] mb-2">
                {warehouses.reduce((sum, w) => sum + w.covered_area.length, 0)}
              </h3>
              <p className="text-gray-600 text-lg">Areas Covered</p>
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
              <button
                onClick={resetSearch}
                className="px-8 py-4 bg-transparent hover:bg-white/10 text-white font-bold rounded-full border-2 border-white transition-all duration-300"
              >
                View All Warehouses
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Coverage;
