import '../App.css';
import React from 'react';
import fondoimg from '../img/pngwing.com.png';

function Home() {
  console.log("Home component rendering");
  
  return (
    <div className="home-container">
      <img src={fondoimg} alt="Pizza" className="fondo-pizza" />
      <div className="content-overlay">
        <h1 className="titulo-principal">
          Mia Nonna <br/> Delivery de Pizzas
        </h1> 
      </div>
    </div>
  );
}

export default Home;