import { render, screen } from "@testing-library/react";
import App from "./App";

test("redirects unauthenticated users to login", () => {
  localStorage.clear();
  window.history.pushState({}, "", "/");

  render(<App />);

  expect(screen.getByText("User Login")).toBeInTheDocument();
});
