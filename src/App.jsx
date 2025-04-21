import React from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import RouteList from "./routes-nav/RouteList";
import NavBar from "./routes-nav/NavBar";
import UserProvider from "./context/UserProvider";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
          <div className="App">
            <NavBar />
            <RouteList />
          </div>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
