import { Routes, Route, useLocation } from "react-router-dom";

import "./styles/App.css";
import "./styles/styles.css";

import Intro from "./pages/Intro";
import Home from "./pages/Home";
import Erdgechoss from "./pages/Erdgechoss";
import Dachgeschoss from "./pages/Dachgeschoss";
import About from "./pages/About";
import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FAQ from "./pages/FAQ";
import Password from "./pages/Password";

import { Link } from "react-router-dom";

function App() {
  const isIntroPage = useLocation().pathname === "/";
  return (
    <div className="app">
      {!isIntroPage && <NavigationBar />}
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/home" element={<Home />} />
        <Route path="/lowerapartment" element={<Erdgechoss />} />
        <Route path="/upperapartment" element={<Dachgeschoss />} />
        <Route path="/sent" element={<About />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/password-change" element={<Password />} />
        <Route
          path="*"
          element={
            <div
              style={{
                paddingTop: "var(--nav-height)",
                display: "flex",
                height:
                  "calc(100vh - var(--nav-height) - var(--footer-height))",
                flexDirection: "column",
                flexGrow: 1,
                justifyContent: "center",
                alignItems: "center",
                fontSize: "16px",
              }}
            >
              <h1>404 - Not found</h1>
              <Link to="/home">Press here to go to Home</Link>
            </div>
          }
        />
      </Routes>
      {!isIntroPage && <Footer />}
    </div>
  );
}

export default App;
