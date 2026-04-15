import { BrowserRouter, Routes, Route } from "react-router-dom";
import routesData from "./Component/Routes/route.json";
import routesComponents from "./Component/index";
import PrivateRoutes from "./Component/Routes/PrivateRoutes";

function App() {
  const renderRoute = (route, keyPrefix = "") => {
    const routeKey = `${keyPrefix}${route.path}`;
    const Component = routesComponents[route.component];

    if (!Component) {
      return (
        <Route
          key={routeKey}
          path={route.path}
          element={<h2>Component "{route.component}" not found</h2>}
        />
      );
    }

    const children = Array.isArray(route.children)
      ? route.children.map((child) => renderRoute(child, `${routeKey}:`))
      : null;

    if (route.public) {
      return (
        <Route key={routeKey} path={route.path} element={<Component />}>
          {children}
        </Route>
      );
    }

    return (
      <Route
        key={`${routeKey}:private`}
        element={
          <PrivateRoutes
            allowedRoles={route.role ? [route.role] : null}
          />
        }
      >
        <Route
          path={route.path}
          element={
            <>
              {routesComponents.Header && <routesComponents.Header />}
              <Component />
            </>
          }
        >
          {children}
        </Route>
      </Route>
    );
  };

  const renderRoutes = (routes) => routes.map((route) => renderRoute(route));

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
