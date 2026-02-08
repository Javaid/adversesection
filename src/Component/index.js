import Login from "./Login/Login";
import Register from "./Login/Register";
//import Home from "./Home/Home";
 import Header from "./Header/Header";

import SummaryCard from "./Cards/SummaryCard";
import Search from "./SearchBar/Search";
import ProviderPage from "./Providers/ProviderPage";
import ProviderLayout from "./Providers/Layout/Providerlayout";

// Provider Pages
import Overview from "./Providers/Layout/Overview";
import Compliance from "./Providers/Layout/Compliance";
import Identifiers from "./Providers/Layout/Identifiers";
import PracticeLocation from "./Providers/Layout/PracticeLocation";
import Education from "./Providers/Layout/Education";
import Research from "./Providers/Layout/Research";
import Payment from "./Providers/Layout/Payment";
import DigitalPresence from "./Providers/Layout/DigitalPresence";

const routeComponents = {
  Login,
  Register,
  Header,
  SummaryCard,
  Search,
  ProviderPage,
  ProviderLayout,
  Overview,
  Compliance,
  Identifiers,
  PracticeLocation,
  Education,
  Research,
  Payment,
  DigitalPresence,
};
export default routeComponents;