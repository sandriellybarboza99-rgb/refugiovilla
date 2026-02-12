import React, { useState, useEffect } from 'react';
import { Star, MapPin, MessageCircle, Instagram, UtensilsCrossed } from 'lucide-react';
import Section from './components/Section/Section';
import Button from './components/Button/Button';
import { amenities, reviews } from './data';
import './App.css'; 

// --- IMAGENS ---
import imgLogo from './assets/logorefugio.png';
import imgFrente from './assets/frente-casa.JPG'; 
import imgDestaque from './assets/areagourmet2.jpeg'; 
import imgSala1 from './assets/sala.JPG'; 
import imgSala2 from './assets/sala1.JPG'; 
import imgDetalhe from './assets/imagem2.jpg'; 

// --- GALERIA DE BAIXO ---
import imgQuartoSuite2 from './assets/quarto-suite2.jpg';

// --- IMAGENS PARA O CARROSSEL ---
import imgVilla1 from './assets/villa1.jpeg';
import imgImagem4 from './assets/imagem4.jpg';

// --- IMAGENS DOS RESTAURANTES ---
import imgRest1 from './assets/restaurante1.jpg';
import imgRest2 from './assets/restaurante2.jpg';
import imgRest3 from './assets/restaurante3.jpg';
import imgRest4 from './assets/restaurante4.jpg';

// --- LISTA DO CARROSSEL DA CAPA ---
const heroImages = [
  imgFrente,
  imgVilla1,
  imgImagem4,
  imgDetalhe
];

function App() {

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // --- LINKS ---
  const abrirAirbnb = () => { window.open('https://www.airbnb.com.br/rooms/40076062', '_blank'); };
  const abrirMaps = () => { window.open('https://www.google.com/maps/search/?api=1&query=Condomínio+Villa+das+Águas+Praia+do+Saco', '_blank'); };
  const abrirWhatsApp = () => { window.open('https://wa.me/5579981236700', '_blank'); };
  const abrirInstagram = () => { window.open('https://instagram.com/refugiodovilla', '_blank'); };

  return (
    <div className="app">
      
      {/* --- HERO / CAPA --- */}
      <div className="hero animate-fade">
        {heroImages.map((img, index) => (
          <div 
            key={index}
            className={`hero-bg ${index === currentImageIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${img})` }}
          ></div>
        ))}
        <div className="hero-overlay"></div>
        
        <div className="hero-content animate-slide">
          <h1>Refúgio do Villa</h1>
          <p>Sua casa de praia exclusiva no Condomínio Villa das Águas.</p>
          <div className="hero-buttons">
            <Button variant="primary" onClick={abrirAirbnb}>Ver Disponibilidade</Button>
          </div>
          <div className="hero-dots">
            {heroImages.map((_, index) => (
              <span key={index} className={`dot ${index === currentImageIndex ? 'active' : ''}`} onClick={() => setCurrentImageIndex(index)}></span>
            ))}
          </div>
        </div>
      </div>

      {/* --- O ESPAÇO --- */}
      <Section id="sobre">
        <div className="section-header animate-slide">
          <h2>O Refúgio</h2>
          <p>Muito mais que uma hospedagem, um refúgio. Localizada na Praia do Saco, dentro do condomínio Villa das Águas, nossa casa oferece área gourmet, cozinha equipada e 4 suítes perfeitas para acomodar até 14 hóspedes com conforto, segurança e exclusividade.</p>
        </div>
        <div className="gallery-grid animate-fade">
          <div className="photo-highlight"><img src={imgDestaque} alt="Área Gourmet" /></div>
          <div className="photo-standard"><img src={imgSala1} alt="Ambiente Interno" /></div>
          <div className="photo-standard"><img src={imgSala2} alt="Sala" /></div>
          <div className="photo-wide"><img src={imgQuartoSuite2} alt="Suíte" /></div>
        </div>
      </Section>

      {/* --- COMODIDADES --- */}
      <Section className="bg-cream animate-slide">
        <div className="section-header">
          <h2>O Que Oferecemos</h2>
          <p>Tudo o que você precisa para dias inesquecíveis.</p>
        </div>
        <div className="amenities-grid">
          {amenities.map((item, index) => (
            <div key={index} className="amenity-card hover-animate">
              <item.icon size={40} color="#b68c27" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* --- RESTAURANTES --- */}
      <Section>
        <div className="section-header animate-slide">
          <h2>Gastronomia Local</h2>
          <p>Restaurantes incríveis a poucos minutos do condomínio.</p>
        </div>
        <div className="restaurants-grid">
            <div className="restaurant-card animate-pop"><div className="rest-img-container"><img src={imgRest1} alt="Restaurante 1" /><div className="rest-overlay"><UtensilsCrossed /></div></div><h3>Frutos do Mar JG</h3></div>
            <div className="restaurant-card animate-pop" style={{animationDelay: '0.2s'}}><div className="rest-img-container"><img src={imgRest2} alt="Restaurante 2" /><div className="rest-overlay"><UtensilsCrossed /></div></div><h3>Ó Pascásio</h3></div>
            <div className="restaurant-card animate-pop" style={{animationDelay: '0.4s'}}><div className="rest-img-container"><img src={imgRest3} alt="Restaurante 3" /><div className="rest-overlay"><UtensilsCrossed /></div></div><h3>Pizzaria do Careca</h3></div>
            <div className="restaurant-card animate-pop" style={{animationDelay: '0.6s'}}><div className="rest-img-container"><img src={imgRest4} alt="Restaurante 4" /><div className="rest-overlay"><UtensilsCrossed /></div></div><h3>Villa Grill</h3></div>
        </div>
      </Section>

      {/* --- DEPOIMENTOS --- */}
      <Section>
        <div className="section-header animate-slide">
          <h2>Experiências Reais</h2>
        </div>
        <div className="reviews-grid">
          {reviews.map((rev) => (
            <div key={rev.id} className="review-card hover-animate">
              <div className="stars">{[...Array(rev.stars)].map((_, i) => (<Star key={i} size={18} fill="#b68c27" stroke="none" />))}</div>
              <p>"{rev.text}"</p>
              <div className="user-info"><img src={rev.avatar} alt={rev.name} /><span>{rev.name}</span></div>
            </div>
          ))}
        </div>
      </Section>

      {/* --- LOCALIZAÇÃO E CONTATO --- */}
      <Section>
        <div className="final-cta-card animate-fade">
          <h2>Localização e Contato</h2>
          <p>Estamos dentro do Condomínio Villa das Águas, na Praia do Saco - SE.</p>
          <div className="map-button-container">
             <button onClick={abrirMaps} className="map-btn hover-animate"><MapPin size={22} /> Ver Localização Exata no Google Maps</button>
          </div>
          <div className="contact-buttons-grid">
            <button onClick={abrirWhatsApp} className="contact-btn whatsapp hover-animate"><MessageCircle size={24} /> <span>Falar no WhatsApp</span></button>
            <button onClick={abrirInstagram} className="contact-btn instagram hover-animate"><Instagram size={24} /> <span>@refugiodovilla</span></button>
          </div>
          <div className="airbnb-fallback">
            <p>Ou reserve diretamente pela plataforma:</p>
            <Button variant="primary" onClick={abrirAirbnb}>Reservar pelo Airbnb</Button>
          </div>
        </div>
      </Section>

      {/* --- RODAPÉ --- */}
      <footer className="footer">
        <div className="footer-logo-container">
            <img src={imgLogo} alt="Logo Refúgio do Villa" className="footer-logo" />
        </div>
        <p>© 2026 Refúgio do Villa. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default App;