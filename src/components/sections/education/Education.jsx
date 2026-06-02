import React from "react";
import { FaGraduationCap, FaStethoscope, FaAward } from "react-icons/fa";

function Education({ provider }) {
  if (!provider) {
    return <div className="text-red-500">Provider data not available</div>;
  }

  const timeline = (provider.overview?.education || []).map((item) => {
    let icon = <FaGraduationCap />; 

    if (item.type.toLowerCase().includes("residency") || item.type.toLowerCase().includes("fellowship")) {
      icon = <FaStethoscope />;
    } else if (item.type.toLowerCase().includes("board")) {
      icon = <FaAward />;
    }

    return {
      title: item.type + (item.specialty ? ` - ${item.specialty}` : ""),
      institution: item.institution,
      year: item.year,
      current: item.status === "Current",
      icon: icon,
    };
  });

  return (
    <div className="px-6 pb-6 bg-gray-50">
    
      <h2 className="text-xl font-semibold mb-4">Education & Credentials</h2>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold mb-6">Training & Certification Timeline</h3>

        <div className="relative">
        
          <div className="absolute left-6 top-0 h-full w-px bg-gray-200" />

          <div className="space-y-8">
            {timeline.map((item, index) => (
              <div key={index} className="flex items-start gap-6 relative">
              
                <div className="relative z-10 w-12 h-12 flex items-center justify-center rounded-full border-2 border-blue-200 bg-white text-blue-700 text-lg">
                  {item.icon}
                </div>

          
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{item.title}</p>
                  <p className="text-gray-500 text-sm">{item.institution}</p>
                </div>

            
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">{item.year}</span>
                  {item.current && (
                    <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-medium">
                      Current
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Education;
