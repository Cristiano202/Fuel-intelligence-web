import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import './CadastroCotacao.css';

interface Cotacao {
  id?: string;
  tipoCombustivel: string;
  preco: number;
  dataCotacao?: string;
  postoId: string;
}

interface Posto {
  id: number;
  nomeFantasia: string;
}

type ApiStatus = 'conectando' | 'online' | 'erro';

export function CadastroPosto() {
  const [tipoCombustivel, setTipoCombustivel] = useState('');
  const [preco, setPreco] = useState('');
  const [postoId, setPostoId] = useState('');

  const [cotacoes, setCotacoes] = useState<Cotacao[]>([]);
  const [postos, setPostos] = useState<Posto[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [carregandoInicial, setCarregandoInicial] = useState(true);
  const [apiStatus, setApiStatus] = useState<ApiStatus>('conectando');
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

  const combustiveis = ['Gasolina Comum', 'Gasolina Aditivada', 'Etanol', 'Diesel S10', 'GNV'];

  async function carregarDados() {
    try {
      setCarregandoInicial(true);
      setApiStatus('conectando');
      const [resCotacoes, resPostos] = await Promise.all([
        api.get('/api/cotacoes'),
        api.get('/api/postos'),
      ]);
      setCotacoes(resCotacoes.data);
      setPostos(resPostos.data);
      setApiStatus('online');
    } catch (error) {
      console.error('Erro ao carregar dados da API', error);
      setApiStatus('erro');
    } finally {
      setCarregandoInicial(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    if (mensagem) {
      const t = setTimeout(() => setMensagem(null), 4000);
      return () => clearTimeout(t);
    }
  }, [mensagem]);

  async function handleCadastrar(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setMensagem(null);

    if (!tipoCombustivel || !preco || !postoId) {
      setMensagem({ tipo: 'erro', texto: 'Preencha todos os campos antes de continuar.' });
      setCarregando(false);
      return;
    }

    try {
      await api.post('/api/cotacoes', {
        tipoCombustivel,
        preco: parseFloat(preco.replace(',', '.')),
        postoId,
      });
      setMensagem({ tipo: 'sucesso', texto: 'Preço registrado com sucesso!' });
      setTipoCombustivel('');
      setPreco('');
      setPostoId('');
      carregarDados();
    } catch (error: any) {
      const msgErro = error.response?.data || 'Erro ao conectar com a API de cotações.';
      setMensagem({ tipo: 'erro', texto: msgErro });
    } finally {
      setCarregando(false);
    }
  }

  const statusLabel: Record<ApiStatus, string> = {
    conectando: 'Conectando à API...',
    online: 'API conectada',
    erro: 'API offline',
  };

  const postoNome = (id: string) => {
    const p = postos.find((p) => String(p.id) === String(id));
    return p ? p.nomeFantasia : `Posto #${id}`;
  };

  return (
    <div className="fi-shell">

      {/* TOPBAR */}
      <header className="fi-topbar">
        <div className="fi-brand">
          <div className="fi-brand-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 22V8l9-6 9 6v14H3z"/><path d="M9 22V12h6v10"/>
            </svg>
          </div>
          <div>
            <div className="fi-brand-name">PostoFácil</div>
            <div className="fi-brand-sub">Painel Admin</div>
          </div>
        </div>

        <div className={`fi-api-badge fi-api-badge--${apiStatus}`}>
          <span className={`fi-api-dot fi-api-dot--${apiStatus}`} />
          {statusLabel[apiStatus]}
        </div>
      </header>

      {/* GRID PRINCIPAL */}
      <div className="fi-main">

        {/* BANNER DE STATUS */}
        <div className="fi-area-banner">
          <div className={`fi-banner fi-banner--${apiStatus}`}>
            {apiStatus === 'conectando' && (
              <>
                <span className="fi-spinner fi-banner-icon" />
                <div>
                  <div className="fi-banner-title">Conectando com o servidor</div>
                  <div className="fi-banner-desc">Aguardando resposta da API Java...</div>
                </div>
              </>
            )}
            {apiStatus === 'online' && (
              <>
                <span className="fi-banner-icon fi-icon-check">✓</span>
                <div>
                  <div className="fi-banner-title">API conectada</div>
                  <div className="fi-banner-desc">Servidor respondendo normalmente</div>
                </div>
                <button className="fi-banner-refresh" onClick={carregarDados} title="Recarregar dados">↻</button>
              </>
            )}
            {apiStatus === 'erro' && (
              <>
                <span className="fi-banner-icon fi-icon-warn">!</span>
                <div>
                  <div className="fi-banner-title">Falha na conexão</div>
                  <div className="fi-banner-desc">Não foi possível alcançar o servidor</div>
                </div>
                <button className="fi-banner-refresh" onClick={carregarDados} title="Tentar novamente">↻</button>
              </>
            )}
          </div>
        </div>

        {/* TOAST */}
        {mensagem && (
          <div className="fi-area-toast">
            <div className={`fi-toast fi-toast--${mensagem.tipo}`}>
              <span className="fi-toast-icon">{mensagem.tipo === 'sucesso' ? '✓' : '!'}</span>
              {mensagem.texto}
            </div>
          </div>
        )}

        {/* CARD — FORMULÁRIO */}
        <div className="fi-area-form">
          <div className="fi-card">
            <div className="fi-card-header">
              <div className="fi-card-title">
                <span className="fi-card-title-icon">⛽</span>
                Lançar novo preço
              </div>
              <p className="fi-card-desc">Atualize o valor de combustível por posto</p>
            </div>

            <form onSubmit={handleCadastrar} className="fi-form">
              <div className="fi-field">
                <label className="fi-label">Posto</label>
                <div className="fi-select-wrap">
                  <select
                    value={postoId}
                    onChange={(e) => setPostoId(e.target.value)}
                    className="fi-select"
                    disabled={carregandoInicial}
                  >
                    <option value="">
                      {carregandoInicial ? 'Buscando postos...' : 'Selecione um posto...'}
                    </option>
                    {postos.map((p) => (
                      <option key={p.id} value={p.id}>{p.nomeFantasia}</option>
                    ))}
                  </select>
                  <span className="fi-select-arrow" />
                </div>
              </div>

              <div className="fi-row">
                <div className="fi-field">
                  <label className="fi-label">Combustível</label>
                  <div className="fi-select-wrap">
                    <select
                      value={tipoCombustivel}
                      onChange={(e) => setTipoCombustivel(e.target.value)}
                      className="fi-select"
                    >
                      <option value="">Selecione...</option>
                      {combustiveis.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <span className="fi-select-arrow" />
                  </div>
                </div>

                <div className="fi-field">
                  <label className="fi-label">Preço por Litro (R$)</label>
                  <div className="fi-price-wrap">
                    <span className="fi-price-prefix">R$</span>
                    <input
                      type="text"
                      placeholder="0,00"
                      value={preco}
                      onChange={(e) => setPreco(e.target.value)}
                      className="fi-input fi-input--price"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={carregando || carregandoInicial || apiStatus === 'erro'}
                className="fi-btn-submit"
              >
                {carregando ? (
                  <><span className="fi-spinner fi-spinner--sm" /> Enviando...</>
                ) : (
                  'Lançar preço'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* CARD — HISTÓRICO */}
        <div className="fi-area-historico">
          <div className="fi-card">
            <div className="fi-card-header">
              <div className="fi-card-title">Histórico de cotações</div>
              <p className="fi-card-desc">Últimas atualizações monitoradas pelo sistema</p>
            </div>

            <div className="fi-table-wrap">
              <table className="fi-table">
                <thead>
                  <tr>
                    <th>Posto</th>
                    <th>Combustível</th>
                    <th>Preço / L</th>
                  </tr>
                </thead>
                <tbody>
                  {carregandoInicial ? (
                    <tr>
                      <td colSpan={3} className="fi-table-empty">
                        <span className="fi-spinner" style={{ borderColor: 'rgba(0,0,0,0.1)', borderTopColor: '#1D9E75' }} />
                        Carregando dados...
                      </td>
                    </tr>
                  ) : cotacoes.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="fi-table-empty">
                        Nenhuma cotação registrada ainda.
                      </td>
                    </tr>
                  ) : (
                    cotacoes.map((c, index) => (
                      <tr key={c.id || index}>
                        <td>{postoNome(c.postoId)}</td>
                        <td><span className="fi-badge">{c.tipoCombustivel}</span></td>
                        <td className="fi-preco">R$ {c.preco.toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}