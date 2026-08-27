import React, { useState, useContext, useEffect } from 'react';
import { ConfigContext } from '../../context/ConfigContext';
import { supabase } from '../../supabaseClient';
import { Save, LogOut, Lock, Calendar, Settings, Image as ImageIcon, LayoutDashboard, Plus, Trash2 } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './Admin.css';
import Button from '../../components/Button/Button';

const Admin = () => {
  const { config, updateConfig, fetchData, loading } = useContext(ConfigContext);
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [formData, setFormData] = useState({
    diaria: 850,
    taxaFaxina: 150,
    energiaKwh: 1.30
  });

  useEffect(() => {
    if (!loading) {
      setFormData({
        diaria: config.diaria,
        taxaFaxina: config.taxaFaxina,
        energiaKwh: config.energiaKwh
      });
    }
  }, [config, loading]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') { // Futuramente usar Supabase Auth aqui
      setIsAuthenticated(true);
    } else {
      alert('Senha incorreta!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    await updateConfig({
      diaria: formData.diaria,
      taxaFaxina: formData.taxaFaxina,
      energiaKwh: formData.energiaKwh
    });
    alert('Configurações salvas com sucesso!');
  };

  // --- Calendário ---
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedRangeInfo, setSelectedRangeInfo] = useState(null);

  const blockedDatesArray = (config.blockedDates || []).map(d => new Date(d));

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

    if (start && !end) {
      checkDateInfo(start);
    } else if (start && end) {
      checkDateInfo(start);
    } else {
      setSelectedRangeInfo(null);
    }
  };

  const checkDateInfo = (start) => {
    const startStr = start.toISOString().split('T')[0];
    const isBlocked = config.blockedDates.includes(startStr);
    const customPrice = config.customPrices[startStr] || config.diaria;
    setSelectedRangeInfo({ isBlocked, customPrice });
  };

  const applyCustomSettings = async (action) => {
    if (!startDate) return;
    
    let datesToUpdate = [];
    let current = new Date(startDate);
    const end = endDate || startDate;
    
    while (current <= end) {
      datesToUpdate.push(new Date(current).toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }

    try {
      if (action === 'block') {
         const upserts = datesToUpdate.map(d => ({ date: d, is_blocked: true, custom_price: null }));
         await supabase.from('calendar_overrides').upsert(upserts);
      } else if (action === 'unblock' || action === 'clearPrice') {
         await supabase.from('calendar_overrides').delete().in('date', datesToUpdate);
      } else if (action === 'setPrice') {
         const upserts = datesToUpdate.map(d => ({ date: d, is_blocked: false, custom_price: selectedRangeInfo.customPrice }));
         await supabase.from('calendar_overrides').upsert(upserts);
      }
      
      alert('Datas atualizadas com sucesso!');
      await fetchData(); // Recarrega do banco
      setStartDate(null);
      setEndDate(null);
      setSelectedRangeInfo(null);
    } catch (err) {
      alert('Erro ao atualizar datas: ' + err.message);
    }
  };

  // --- Fotos ---
  const [uploadingEnv, setUploadingEnv] = useState(null);

  const handlePhotoUpload = async (e, envId) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setUploadingEnv(envId);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${envId}/${fileName}`;
      
      // Upload para Storage
      const { error: uploadError } = await supabase.storage
        .from('house-images')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Pega URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('house-images')
        .getPublicUrl(filePath);
        
      // Insere no banco
      const { error: dbError } = await supabase.from('environment_photos').insert({
        environment_id: envId,
        image_url: publicUrl
      });
      
      if (dbError) throw dbError;
      
      await fetchData();
      alert('Foto adicionada!');
    } catch (error) {
      alert('Erro ao enviar foto: ' + error.message);
    } finally {
      setUploadingEnv(null);
    }
  };

  const removePhoto = async (photoUrl) => {
    if(!window.confirm("Deseja realmente apagar esta foto?")) return;
    try {
      // 1. Apaga do banco
      const { error: dbError } = await supabase.from('environment_photos').delete().eq('image_url', photoUrl);
      if (dbError) throw dbError;
      
      // 2. Idealmente apaga do bucket também, mas só apagar do banco já some da tela.
      // const path = photoUrl.split('/house-images/')[1];
      // await supabase.storage.from('house-images').remove([path]);
      
      await fetchData();
    } catch (err) {
      alert('Erro ao remover: ' + err.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <form onSubmit={handleLogin} className="admin-login-box">
          <div className="lock-icon"><Lock size={40} color="#b68c27" /></div>
          <h2>Acesso Administrativo</h2>
          <p>Área restrita (conectado à nuvem Supabase).</p>
          <input 
            type="password" 
            placeholder="Senha" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="admin-input"
          />
          <Button type="submit" variant="primary" style={{width: '100%'}}>Entrar</Button>
          <p style={{fontSize: '0.8rem', color: '#666', marginTop: '10px'}}>Dica: admin123</p>
        </form>
      </div>
    );
  }

  if (loading) {
    return <div style={{textAlign: 'center', padding: '100px', color: 'white'}}>Carregando banco de dados...</div>;
  }

  return (
    <div className="admin-dashboard">
      <nav className="admin-nav">
        <h2>Painel do Refúgio (Supabase)</h2>
        <div className="admin-nav-actions">
          <a href="/" target="_blank" rel="noopener noreferrer" className="view-site-link">Ver Site</a>
          <button onClick={handleLogout} className="logout-btn"><LogOut size={18} /> Sair</button>
        </div>
      </nav>

      <div className="admin-layout">
        <aside className="admin-sidebar">
          <button className={`sidebar-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button className={`sidebar-btn ${activeTab === 'calendar' ? 'active' : ''}`} onClick={() => setActiveTab('calendar')}>
            <Calendar size={18} /> Calendário e Preços
          </button>
          <button className={`sidebar-btn ${activeTab === 'photos' ? 'active' : ''}`} onClick={() => setActiveTab('photos')}>
            <ImageIcon size={18} /> Gerenciar Fotos
          </button>
        </aside>

        <main className="admin-main-content">
          
          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="tab-pane animate-fade">
              <div className="admin-card">
                <div className="admin-card-header">
                  <LayoutDashboard size={20} />
                  <h3>Visão Geral</h3>
                </div>
                <div className="dashboard-stats">
                  <div className="stat-box">
                    <span className="stat-value">{config.totalViews || 0}</span>
                    <span className="stat-label">Visitas registradas no Banco</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CALENDÁRIO E PREÇOS */}
          {activeTab === 'calendar' && (
            <div className="tab-pane animate-fade">
              <div className="admin-content-grid">
                <div className="admin-card">
                  <div className="admin-card-header">
                    <Settings size={20} />
                    <h3>Valores Padrão e Taxas</h3>
                  </div>
                  <form onSubmit={handleSaveConfig} className="admin-form">
                    <div className="form-group">
                      <label>Diária Base Padrão (R$)</label>
                      <input type="number" name="diaria" value={formData.diaria} onChange={handleChange} className="admin-input" />
                    </div>
                    <div className="form-group">
                      <label>Taxa de Faxina Padrão (R$)</label>
                      <input type="number" name="taxaFaxina" value={formData.taxaFaxina} onChange={handleChange} className="admin-input" />
                    </div>
                    <div className="form-group">
                      <label>Energia Padrão (R$/kWh)</label>
                      <input type="number" step="0.01" name="energiaKwh" value={formData.energiaKwh} onChange={handleChange} className="admin-input" />
                    </div>
                    <Button type="submit" variant="primary"><Save size={18} style={{marginRight: 5}}/> Salvar Valores na Nuvem</Button>
                  </form>
                </div>

                <div className="admin-card">
                  <div className="admin-card-header">
                    <Calendar size={20} />
                    <h3>Preços Específicos e Bloqueios</h3>
                  </div>
                  <div className="calendar-admin-section">
                    <p>Selecione uma data (ou clique e arraste para um período) para customizar o preço ou bloquear.</p>
                    
                    <DatePicker
                      inline
                      selectsRange
                      startDate={startDate}
                      endDate={endDate}
                      onChange={handleDateChange}
                      highlightDates={blockedDatesArray}
                      minDate={new Date()}
                      renderDayContents={(day, date) => {
                        const dateStr = date.toISOString().split('T')[0];
                        const customPrice = config.customPrices && config.customPrices[dateStr];
                        const isBlocked = config.blockedDates && config.blockedDates.includes(dateStr);
                        
                        return (
                          <div style={{ position: 'relative', paddingBottom: '10px' }}>
                            {day}
                            {customPrice && !isBlocked && (
                              <div style={{ 
                                position: 'absolute', 
                                bottom: '-8px', 
                                left: '50%', 
                                transform: 'translateX(-50%)', 
                                fontSize: '0.6rem', 
                                color: '#b68c27',
                                fontWeight: 'bold'
                              }}>
                                R${customPrice}
                              </div>
                            )}
                          </div>
                        );
                      }}
                    />
                    
                    {startDate && selectedRangeInfo && (
                      <div className="date-action-panel animate-slide">
                        <h4>Ações para o período selecionado</h4>
                        <div className="date-action-row">
                          <label>Preço Diária Customizado:</label>
                          <input 
                            type="number" 
                            className="admin-input-small"
                            value={selectedRangeInfo.customPrice}
                            onChange={(e) => setSelectedRangeInfo({...selectedRangeInfo, customPrice: parseFloat(e.target.value) || 0})}
                          />
                          <button className="btn-sm primary" onClick={() => applyCustomSettings('setPrice')}>Salvar Preço</button>
                          <button className="btn-sm outline" onClick={() => applyCustomSettings('clearPrice')}>Restaurar Padrão</button>
                        </div>
                        
                        <div className="date-action-row mt-2">
                          {selectedRangeInfo.isBlocked ? (
                            <button className="btn-sm success" onClick={() => applyCustomSettings('unblock')}>Desbloquear</button>
                          ) : (
                            <button className="btn-sm danger" onClick={() => applyCustomSettings('block')}>Bloquear Período</button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: FOTOS */}
          {activeTab === 'photos' && (
            <div className="tab-pane animate-fade">
              <div className="admin-card">
                <div className="admin-card-header">
                  <ImageIcon size={20} />
                  <h3>Galeria (Supabase Storage)</h3>
                </div>

                <div className="environments-list">
                  {config.environments.map(env => (
                    <div key={env.id} className="env-photo-manager">
                      <div className="env-photo-header">
                        <h4>{env.title} ({env.photos.length} fotos)</h4>
                        
                        <label className="upload-btn">
                          {uploadingEnv === env.id ? 'Enviando...' : <><Plus size={16} /> Adicionar Foto</>}
                          <input 
                            type="file" 
                            accept="image/*" 
                            style={{display: 'none'}} 
                            disabled={uploadingEnv !== null}
                            onChange={(e) => handlePhotoUpload(e, env.id)} 
                          />
                        </label>
                      </div>
                      
                      <div className="env-photos-grid">
                        {env.photos.map((photoUrl, idx) => (
                          <div key={idx} className="env-photo-item">
                            <img src={photoUrl} alt="Thumb" />
                            <button className="delete-photo-btn" onClick={() => removePhoto(photoUrl)}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default Admin;
