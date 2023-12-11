import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/md-light-indigo/theme.css";
import "primeicons/primeicons.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./app.css";

function App() {
  return (
    <PrimeReactProvider>
      <RouterProvider router={router} />
    </PrimeReactProvider>
  );
}

export default App;
