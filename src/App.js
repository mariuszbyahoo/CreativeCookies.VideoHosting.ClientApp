import logo from "./logo.svg";
import { Layout } from "./components/Layout";
import { Route, Routes } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { AuthProvider } from "./components/Account/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          {AppRoutes.map((route, index) => {
            const { element, requireAuth, ...rest } = route;
            return <Route key={index} {...rest} element={element} />;
          })}
        </Routes>
      </Layout>
    </AuthProvider>
  );
}

export default App;
