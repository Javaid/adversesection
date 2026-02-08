import { Route } from "react-router-dom";
import routesComponents from "../Routes/index";
// import PrivateRoutes from "./PrivateRoutes";


const routeRender = (routes) =>
  
  routes.map((route, i) => {
    const Component = routesComponents[route.component];
// debugger


    if (!Component) {
      console.error(`Component not found: ${route.component}`);
      return (
        <Route
          key={i}
          path={route.path}
          element={<h2>Component "{route.component}" Missing</h2>}
        />
      );
    }

    if (!route.public) {
      return (
        <Route key={i} element={<privateRoutes />}>
          <Route path={route.path} element={<Component />} />
        </Route>
      );
    }

    return <Route key={i} path={route.path} element={<Component />} />;
  });

export default routeRender;
