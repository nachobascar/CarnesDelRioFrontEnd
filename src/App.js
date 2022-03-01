
import React from 'react';

import Header from "./components/header.js";
import Footer from "./components/footer.js";
import Home from "./components/home.js";
import Cart from "./components/cart.js";

function App() {
  return (
    <body>
      <Header/>
        <Home/>
        <Cart/>
      <Footer/>
    </body>
  );
}

export default App;
