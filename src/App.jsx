import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, MessageCircle, Instagram, UtensilsCrossed, Image as ImageIcon, Circle, ChevronDown } from 'lucide-react';
import Section from './components/Section/Section';
import Button from './components/Button/Button';
import PhotoGalleryModal from './components/PhotoGalleryModal/PhotoGalleryModal';
import BookingModal from './components/BookingModal/BookingModal';
import { amenities, reviews } from './data';
import { ConfigContext } from './context/ConfigContext';
import './App.css';

// --- IMAGENS (Usadas apenas para o Hero) ---
import imgLogo from './assets/logorefugio.png';
import logoPng from './assets/logo.png';
import imgFrente from './assets/frente-casa.JPG';
import imgDestaque from './assets/areagourmet2.jpeg';
import imgDetalhe from './assets/imagem2.jpg';
import imgVilla1 from './assets/villa1.jpeg';
import imgImagem4 from './assets/imagem4.jpg';

// --- IMAGENS DOS RESTAURANTES ---
import imgRest1 from './assets/restaurante1.jpg';
import imgRest2 from './assets/restaurante2.jpg';
import imgRest3 from './assets/restaurante3.jpg';
import imgRest4 from './assets/restaurante4.jpg';

// --- REGRAS DA CASA ---
const houseRules = [
  {
    title: "Horários de Check-in e Check-out",
    content: "O horário de check-in é a partir das 14h, e o check-out deve ser realizado até as 12h. Exceções podem ser negociadas mediante disponibilidade prévia."
  },
  {
    title: "Horário de Silêncio",
    content: "Pedimos que respeitem o horário de silêncio das 22h às 08h, conforme regimento interno do condomínio, garantindo a tranquilidade de todos os vizinhos."
  },
  {
    title: "Política de Pets",
    content: "Aceitamos pets de pequeno porte! Lembre-se de manter seu amigo nas áreas permitidas do condomínio, sempre com guia, e de recolher qualquer sujeira."
  },
  {
    title: "Visitantes e Eventos",
    content: "Por motivos de segurança e regras do condomínio, não é permitida a entrada de visitantes extras não listados na reserva, nem a realização de festas e eventos."
  },
  {
    title: "Política de Cancelamento",
    content: "Cancelamentos feitos com até 7 dias de antecedência recebem reembolso integral. Após esse prazo, regras específicas da plataforma de reserva (como o Airbnb) poderão ser aplicadas."
  }
];

// --- LISTA DO CARROSSEL DA CAPA ---
const heroImages = [
  imgFrente,
  imgVilla1,
  imgImagem4,
  imgDetalhe
];

function App() {
  const navigate = useNavigate();
  const { config, loading, incrementView } = useContext(ConfigContext);
  const environments = config.environments;

  useEffect(() => {
    // Registra visita assim que não estiver mais carregando o banco (para ter certeza que o banco existe)
    if (!loading) {
      incrementView();
    }
    // eslint-disable-next-line
  }, [loading]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  const [openRuleIndex, setOpenRuleIndex] = useState(null);
  const toggleRule = (index) => {
    setOpenRuleIndex(openRuleIndex === index ? null : index);
  };

  // --- ESTADOS DA GALERIA ---
  const [galleryState, setGalleryState] = useState({
    isOpen: false,
    activeGalleryId: null,
    title: '',
    photos: []
  });

  const openGallery = (env) => {
    setGalleryState({
      isOpen: true,
      activeGalleryId: env.id,
      title: env.title,
      photos: env.photos
    });
  };

  const closeGallery = () => {
    setGalleryState({ ...galleryState, isOpen: false });
  };

  // --- LINKS ---
  const abrirAirbnb = () => { window.open('https://www.airbnb.com.br/rooms/40076062', '_blank'); };
  const abrirMaps = () => { window.open('https://www.google.com/maps/search/?api=1&query=Condomínio+Villa+das+Águas+Praia+do+Saco', '_blank'); };
  const abrirWhatsApp = () => { window.open('https://wa.me/5579981236700', '_blank'); };
  const abrirInstagram = () => { window.open('https://instagram.com/refugiodovilla', '_blank'); };

  return (
    <div className="app">

      {/* --- NAVBAR --- */}
      <nav className="navbar animate-fade">
        <div className="nav-content">
          <div className="nav-logo">
            <img src={logoPng} alt="Refúgio do Villa" />
          </div>
          <div className="nav-links">
            <button className="nav-text-btn" onClick={() => setIsBookingModalOpen(true)}>Calendário / Disponibilidade</button>
          </div>
        </div>
      </nav>

      {/* --- NOVA HERO INSPIRADA EM CELEBRITY-HOTELS --- */}
      <div className="new-hero-section">
        <div className="bg-shape bg-shape-1"></div>
        <div className="bg-shape bg-shape-2"></div>
        <div className="new-hero-bg">
          <div className="new-hero-content animate-slide">
            <h2 className="new-hero-subtitle">BEM-VINDO AO SEU REFÚGIO NA PRAIA DO SACO</h2>
            <h1 className="new-hero-title">REFÚGIO DO VILLA,<br />O CENÁRIO PERFEITO PARA DIAS <span className="text-gold">INESQUECÍVEIS</span>.</h1>
          </div>
        </div>
      </div>

      <div className="middle-wrapper">
        {/* --- CARDS DE AMBIENTES SOBREPOSTOS --- */}
        <div className="overlapping-cards-container animate-fade">
          <div className="overlapping-cards-scroll">
            {environments.map((env, idx) => (
              <div key={env.id} className="celeb-card" onClick={() => openGallery(env)}>
                <div className="celeb-card-img">
                  <img src={env.cover} alt={env.title} />
                </div>
                <div className="celeb-card-info">
                  <span className="celeb-card-label">CONHEÇA O AMBIENTE</span>
                  <div className="celeb-card-title-row">
                    <h3>{env.title}</h3>
                    <span className="celeb-arrow">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- MARQUEE DE VANTAGENS --- */}
        <div className="marquee-container">
          <div className="marquee-content">
            <div className="marquee-group">
              <span>✦ ALUGAMOS PELO AIRBNB</span>
              <span>✦ ACEITAMOS PET</span>
              <span>✦ TODAS AS SUÍTES SÃO CLIMATIZADAS</span>
              <span>✦ CHURRASQUEIRA</span>
              <span>✦ WIFI</span>
              <span>✦ TODOS OS QUARTOS SÃO SUÍTES</span>
            </div>
            <div className="marquee-group" aria-hidden="true">
              <span>✦ ALUGAMOS PELO AIRBNB</span>
              <span>✦ ACEITAMOS PET</span>
              <span>✦ TODAS AS SUÍTES SÃO CLIMATIZADAS</span>
              <span>✦ CHURRASQUEIRA</span>
              <span>✦ WIFI</span>
              <span>✦ TODOS OS QUARTOS SÃO SUÍTES</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- NOVA SEÇÃO CONDOMÍNIO (ESTILO ACME) --- */}
      <div className="condo-section animate-fade">
        <div className="condo-layout">
          <div className="condo-text-col">
            <h2>VILLA DAS ÁGUAS</h2>
            <p className="condo-subtitle">Localizado na Praia do Saco - SE</p>
            <p className="condo-desc">
              Descubra um verdadeiro resort particular. A casa fica localizada no Condomínio Villa das Águas, que oferece infraestrutura completa com piscinas, restaurante, lagos, área de pesca, parque infantil, sala de jogos, churrasqueiras, quadras de vôlei, futebol, basquete, tênis, além de incríveis áreas verdes de lazer.
            </p>
          </div>
          <div className="condo-cards-col">
            {amenities.map((item, index) => (
              <div key={index} className="condo-card hover-animate">
                <item.icon size={36} color="#1b365d" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>



      {/* --- RESTAURANTES --- */}
      <Section>
        <div className="section-header animate-slide">
          <h2>Gastronomia Local</h2>
          <p>Restaurantes incríveis a poucos minutos do condomínio.</p>
        </div>
        <div className="restaurants-grid">
          <div className="restaurant-card animate-pop"><div className="rest-img-container"><img src={imgRest1} alt="Restaurante 1" /><div className="rest-overlay"><UtensilsCrossed /></div></div><h3>Frutos do Mar JG</h3></div>
          <div className="restaurant-card animate-pop" style={{ animationDelay: '0.2s' }}><div className="rest-img-container"><img src={imgRest2} alt="Restaurante 2" /><div className="rest-overlay"><UtensilsCrossed /></div></div><h3>Ó Pascásio</h3></div>
          <div className="restaurant-card animate-pop" style={{ animationDelay: '0.4s' }}><div className="rest-img-container"><img src={imgRest3} alt="Restaurante 3" /><div className="rest-overlay"><UtensilsCrossed /></div></div><h3>Pizzaria do Careca</h3></div>
          <div className="restaurant-card animate-pop" style={{ animationDelay: '0.6s' }}><div className="rest-img-container"><img src={imgRest4} alt="Restaurante 4" /><div className="rest-overlay"><UtensilsCrossed /></div></div><h3>Villa Grill</h3></div>
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

      {/* --- REGRAS DA CASA E CONDOMÍNIO --- */}
      <Section className="rules-section animate-slide">
        <div className="section-header">
          <h2>Informações e Regras</h2>
          <p>Tudo o que você precisa saber para uma estadia perfeita e sem surpresas.</p>
        </div>
        <div className="accordion-container">
          {houseRules.map((rule, index) => (
            <div 
              key={index} 
              className={`accordion-item ${openRuleIndex === index ? 'open' : ''}`}
            >
              <button 
                className="accordion-header" 
                onClick={() => toggleRule(index)}
              >
                <span>{rule.title}</span>
                <ChevronDown className="accordion-icon" />
              </button>
              <div className="accordion-body">
                <div className="accordion-content">
                  {rule.content}
                </div>
              </div>
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
        <p><span onClick={() => navigate('/admin')} style={{ cursor: 'default' }}>©</span> 2026 Refúgio do Villa. Todos os direitos reservados.</p>
      </footer>

      {/* --- MODAL DA GALERIA --- */}
      <PhotoGalleryModal
        isOpen={galleryState.isOpen}
        onClose={closeGallery}
        photos={galleryState.photos}
        title={galleryState.title}
      />

      {/* --- MODAL DE RESERVAS --- */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
}

export default App;