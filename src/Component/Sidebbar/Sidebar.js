import React from "react";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import {
  FiHome,
  FiShield,
  FiFileText,
  FiMapPin,
  FiAward,
  FiBookOpen,
  FiDollarSign,
  FiGlobe,
} from "react-icons/fi";

const Sidebar = () => {
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <nav className="space-y-1 sticky top-2">
      <SidebarItem
        icon={FiHome}
        label="Overview"
        onClick={() => scrollToSection("overview")}
      />

      <SidebarItem
        icon={FiShield}
        label="Compliance & Exclusions"
        onClick={() => scrollToSection("compliance")}
      />

      <SidebarItem
        icon={FiFileText}
        label="Identifiers & Licensing"
        onClick={() => scrollToSection("identifiers")}
      />

      <SidebarItem
        icon={FiFileText}
        label="Taxonomy"
        onClick={() => scrollToSection("taxonomy")}
      />

      <SidebarItem
        icon={MdOutlineHealthAndSafety}
        label="Health & Information"
        onClick={() => scrollToSection("healthInfoExchange")}
      />

      <SidebarItem
        icon={FiMapPin}
        label="Practice Locations"
        onClick={() => scrollToSection("practiceLocation")}
      />

      <SidebarItem
        icon={FiAward}
        label="Education & Credentials"
        onClick={() => scrollToSection("education")}
      />

      <SidebarItem
        icon={FiBookOpen}
        label="Research & Publication"
        onClick={() => scrollToSection("research")}
      />

      <SidebarItem
        icon={FiDollarSign}
        label="Payment & Medicare"
        onClick={() => scrollToSection("payment")}
      />

      <SidebarItem
        icon={FiGlobe}
        label="Digital Presence"
        onClick={() => scrollToSection("digitalPresence")}
      />
    </nav>
  );
};

const SidebarItem = ({ icon: Icon, label, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer text-sm transition whitespace-nowrap
      text-gray-600 hover:bg-blue-900 hover:text-white"
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="font-medium">{label}</span>
    </div>
  );
};

export default Sidebar;