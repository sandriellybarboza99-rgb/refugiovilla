import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { addDays, differenceInDays } from 'date-fns';
import { Calendar, Users, Calculator, Info } from 'lucide-react';
import './BookingSimulator.css';
import Button from '../Button/Button';
import { ConfigContext } from '../../context/ConfigContext';

const BookingSimulator = () => {
  const { config } = useContext(ConfigContext);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guests, setGuests] = useState(2);
  const [totalPrice, setTotalPrice] = useState(0);

  // Parse blocked dates from strings to Date objects
  const blockedDates = config.blockedDates.map(dateStr => new Date(dateStr));

  // Calcula o total quando as datas ou hóspedes mudam
  useEffect(() => {
    if (startDate && endDate) {
      const daysCount = differenceInDays(endDate, startDate);
      if (daysCount >= 2) {
        let total = 0;
        let current = new Date(startDate);
        // Itera pelos dias (excluindo o check-out)
        for (let i = 0; i < daysCount; i++) {
          const dateStr = current.toISOString().split('T')[0];
          const customPrices = config.customPrices || {};
          const priceForNight = customPrices[dateStr] || config.diaria;
          total += priceForNight;
          current.setDate(current.getDate() + 1);
        }
        setTotalPrice(total);
      } else {
        setTotalPrice(0);
      }
    } else {
      setTotalPrice(0);
    }
  }, [startDate, endDate, config.diaria, config.customPrices]);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleGuestsChange = (e) => {
    const val = parseInt(e.target.value) || 1;
    if (val >= 1 && val <= 16) {
      setGuests(val);
    }
  };

  const isInvalidStay = startDate && endDate && differenceInDays(endDate, startDate) < 2;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const handleConcluir = () => {
    if (!startDate || !endDate || isInvalidStay) {
      alert("Por favor, selecione um período válido de no mínimo 2 diárias.");
      return;
    }

    const checkin = startDate.toLocaleDateString('pt-BR');
    const checkout = endDate.toLocaleDateString('pt-BR');
    const diárias = differenceInDays(endDate, startDate);

    const message = `Olá! Gostaria de fechar uma reserva no Refúgio do Villa.\n\n*Detalhes da Simulação:*\n• *Check-in:* ${checkin}\n• *Check-out:* ${checkout}\n• *Total de Diárias:* ${diárias}\n• *Quantidade de Pessoas:* ${guests}\n\n• *Subtotal das Diárias:* ${formatCurrency(totalPrice)}\n• *Taxa de Faxina:* ${formatCurrency(config.taxaFaxina)}\n• *Energia:* Cobrado à parte (${formatCurrency(config.energiaKwh)}/kWh)\n\nPodemos fechar essa reserva?`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/5579981236700?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="booking-simulator-container">
      <div className="simulator-header">
        <h3>Simule sua Estadia</h3>
        <p>Preencha os dados para ver o orçamento (Mín. 2 diárias)</p>
      </div>

      <div className="simulator-body">
        <div className="input-group">
          <label><Calendar size={18} /> Período da Reserva</label>
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateChange}
            minDate={new Date()}
            excludeDates={blockedDates}
            placeholderText="Check-in - Check-out"
            className="date-picker-input"
            dateFormat="dd/MM/yyyy"
            withPortal
          />
          {isInvalidStay && (
            <span className="error-msg">A estadia mínima é de 2 diárias.</span>
          )}
        </div>

        <div className="input-group">
          <label><Users size={18} /> Quantidade de Hóspedes</label>
          <div className="guests-input-wrapper">
            <input
              type="number"
              min="1"
              max="16"
              value={guests}
              onChange={handleGuestsChange}
            />
            <span className="hint-msg">Max. 16 pessoas (incluindo crianças)</span>
          </div>
        </div>

        <div className="summary-card">
          <h4><Calculator size={18} /> Resumo</h4>

          <div className="summary-row">
            <span>
              Valor das Diárias
              {startDate && endDate && !isInvalidStay && (
                <span style={{ fontSize: '0.85rem', color: '#666', marginLeft: '6px' }}>
                  ({differenceInDays(endDate, startDate)} noites)
                </span>
              )}
            </span>
            <span>{totalPrice > 0 ? formatCurrency(totalPrice) : '--'}</span>
          </div>
          <div className="summary-row">
            <span>Taxa de Limpeza</span>
            <span>{formatCurrency(config.taxaFaxina)}</span>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-row info-row">
            <span><Info size={14} /> Consumo de Energia</span>
            <span>Cobrado à parte</span>
          </div>
          <p className="energy-detail">A energia é cobrada no check-out de acordo com o consumo pelo medidor: {formatCurrency(config.energiaKwh)} por kWh.</p>

          <div className="summary-divider"></div>

          <div className="summary-total">
            <span>Total Estimado (S/ Energia)</span>
            <span>{totalPrice > 0 ? formatCurrency(totalPrice + config.taxaFaxina) : '--'}</span>
          </div>
        </div>

        <Button
          variant="primary"
          onClick={handleConcluir}
          disabled={!startDate || !endDate || isInvalidStay}
          className="simulator-btn"
        >
          Enviar Orçamento no WhatsApp
        </Button>
      </div>
    </div>
  );
};

export default BookingSimulator;
