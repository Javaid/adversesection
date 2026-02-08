import { BrowserRouter, Routes, Route } from "react-router-dom";
import routesData from "./Component/Routes/route.json";
import routesComponents from "./Component/index";
import PrivateRoutes from "./Component/Routes/PrivateRoutes";

function App() {
  const renderRoutes = (routes) =>
    routes.map((route, i) => {
      const Component = routesComponents[route.component];

      if (!Component) {
        return (
          <Route
            key={i}
            path={route.path}
            element={<h2>Component "{route.component}" not found</h2>}
          />
        );
      }

      if (route.public) {
        return <Route key={i} path={route.path} element={<Component />} />;
      }

      return (
        <Route key={i} element={<PrivateRoutes allowedRoles={route.role ? [route.role] : null} />}>
          <Route
            path={route.path}
            element={
              <>
                {routesComponents.Header && <routesComponents.Header />}
                <Component />
              </>
            }
          />
        </Route>
      );
    });

  return (
    <BrowserRouter>
      <Routes>
        {renderRoutes(routesData.route)}
        <Route path="*" element={<h2>404 — Page Not Found</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;