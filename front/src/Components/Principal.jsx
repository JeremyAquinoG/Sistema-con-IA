import React, { useState, useEffect } from "react";
import './Principal.css';
import { FaLightbulb, FaNetworkWired, FaUsers } from "react-icons/fa";

const frases = [
  {
    texto: "“Creemos en el poder de la metrología como motor de confianza y precisión en la industria nacional.”",
    autor: "– Equipo de Calidad"
  },
  {
    texto: "“La metrología no solo mide magnitudes, sino que construye confianza y excelencia.”",
    autor: "– Dirección Técnica"
  },
  {
    texto: "“Cada calibración es un compromiso con la seguridad y la mejora continua.”",
    autor: "– Laboratorio de Metrología"
  }
];

const Principal = () => {
  const nombres = localStorage.getItem("nombres") || "Nombre";
  const apellidos = localStorage.getItem("apellidos") || "Apellido";
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % frases.length);
    }, 5000); // cambia cada 5 segundos

    return () => clearInterval(intervalo);
  }, []);

  return (
    <div
      className="principal-page"
      style={{
        backgroundImage: `url("/smc.jpg")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh'
      }}
    >
      <div className="overlay"></div>
      <div className="wave-top"></div>

      <div className="contenido">
       <div className="testimonio fade" key={index}>
  <div className="cita">
    <p>{frases[index].texto}</p>
    <span className="autor">{frases[index].autor}</span>
  </div>
</div>


        <div className="texto-principal">
          <h2 className="titulo">Bienvenido(a), {nombres} {apellidos}</h2>

          <div className="bloques-mv">
            <div className="bloque-mv">
              <h3>Misión</h3>
              <p>
                Brindar servicios de calibración con altos estándares técnicos, asegurando la trazabilidad y precisión de los equipos de medición que impulsan la industria.
              </p>
            </div>
            <div className="bloque-mv">
              <h3>Visión</h3>
              <p>
                Ser referentes nacionales en metrología industrial, promoviendo la mejora continua, la innovación y la confianza en cada servicio prestado.
              </p>
            </div>
          </div>

          <div className="tarjetas-info">
            <div className="tarjeta">
              <FaLightbulb className="icono-tarjeta" />
              <h4>Liderazgo tecnológico</h4>
              <p>Somos líderes en tecnología y en ofrecer soluciones avanzadas a nuestros clientes en diversos sectores.</p>
            </div>
            <div className="tarjeta">
              <FaNetworkWired className="icono-tarjeta" />
              <h4>Amplia red de servicios</h4>
              <p>Contamos con gran red de soporte a nivel nacional, lo que nos permite brindarte asistencia en cualquier lugar.</p>
            </div>
            <div className="tarjeta">
              <FaUsers className="icono-tarjeta" />
              <h4>Compromiso con los clientes</h4>
              <p>Nos comprometemos a proporcionar a nuestros clientes los productos y servicios que realmente requieren.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="wave-bottom"></div>
    </div>
  );
};

export default Principal;
