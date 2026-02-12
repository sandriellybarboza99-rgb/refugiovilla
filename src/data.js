import { Wifi, Car, Wind, Utensils, Dog } from 'lucide-react';

export const amenities = [
  { icon: Wifi, label: "Wi-Fi Rápido" },
  { icon: Utensils, label: "Área Gourmet" },
  { icon: Wind, label: "Ar Condicionado" },
  { icon: Car, label: "Estacionamento" },
  { icon: Dog, label: "Pet Friendly" },
];

export const reviews = [
  {
    id: 1,
    name: "Fernanda Lima",
    text: "A casa é espetacular! O condomínio Villa das Águas é super seguro e a área gourmet é perfeita.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    stars: 5
  },
  {
    id: 2,
    name: "Ricardo Souza",
    text: "Fim de semana incrível em família. A casa é muito bem equipada e próxima da praia.",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop",
    stars: 5
  },
  {
    id: 3,
    name: "Juliana Martins",
    text: "Limpeza impecável e anfitriões atenciosos. O pôr do sol na varanda é inesquecível.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    stars: 5
  }
];