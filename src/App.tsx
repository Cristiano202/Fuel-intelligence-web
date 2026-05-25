import { useState, useEffect } from 'react'
import { api } from './services/api'

interface Posto {
  id: string;
  cnpj: string;
  nomeFantasia: string;
  bandeira: string;
  cidade: string;
  bairro: string | null;
  endereco: string | null;
  estado: string | null;
  telefone: string | null;
  cotacoes: any[];
}

function App() {
  const [postos, setPostos] = useState<Posto[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  const buscarPostos = async () => {
    try {
      setCarregando(true);
      console.log("🚀 Ligando à API no Render...");
      
      const response = await api.get<Posto[]>('/postos'); 
      
      console.log("✅ CONEXÃO EFETUADA COM SUCESSO!");
      console.log("📦 Dados recebidos:", response.data);
      
      setPostos(response.data);
      setErro(null);
    } catch (err: any) {
      console.log("❌ FALHA AO CONECTAR NA API!");
      console.error(err);
      setErro("Não foi possível carregar os dados do Render. Verifique o console (F12).");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarPostos();
  }, []);

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh', color: '#333' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ color: '#222', margin: 0 }}>⛽ Fuel Intelligence</h1>
        <p style={{ color: '#666', marginTop: '5px' }}>Gerenciamento estratégico de postos de combustíveis e cotações</p>
      </header>
      
      <hr style={{ border: '0', height: '1px', background: '#ccc', marginBottom: '30px' }} />

      <main>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#444', margin: 0 }}>Postos Cadastrados (Dados Reais)</h2>
          <button 
            onClick={buscarPostos}
            style={{ padding: '8px 16px', backgroundColor: '#0056b3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            🔄 Atualizar Dados
          </button>
        </div>

        {carregando && (
          <p style={{ color: '#666', fontStyle: 'italic' }}>⏳ Carregando dados do Render...</p>
        )}

        {erro && !carregando && (
          <div style={{ padding: '15px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '20px', border: '1px solid #f5c6cb' }}>
            {erro} <br />
            <small style={{ color: '#555' }}>Nota: Garanta que adicionou a anotação @CrossOrigin(origins = "http://localhost:5173") no PostoController do Java para liberar o acesso.</small>
          </div>
        )}
        
        {!carregando && !erro && (
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {postos.length === 0 ? (
              <p>Conectou, mas a lista de postos voltou vazia do banco.</p>
            ) : (
              postos.map(posto => (
                <div 
                  key={posto.id} 
                  style={{ 
                    border: '1px solid #ddd', 
                    padding: '20px', 
                    borderRadius: '8px', 
                    minWidth: '280px',
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                >
                  <h3 style={{ margin: '0 0 10px 0', color: '#0056b3' }}>{posto.nomeFantasia}</h3>
                  <p style={{ margin: '5px 0', color: '#555' }}><strong>ID:</strong> {posto.id}</p>
                  <p style={{ margin: '5px 0', color: '#555' }}><strong>CNPJ:</strong> {posto.cnpj}</p>
                  <p style={{ margin: '5px 0', color: '#555' }}><strong>Bandeira:</strong> {posto.bandeira}</p>
                  <p style={{ margin: '5px 0', color: '#555' }}><strong>Cidade:</strong> {posto.cidade}</p>
                  
                  <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px dashed #eee', fontSize: '14px', color: '#777' }}>
                    Cotações ativas: {posto.cotacoes ? posto.cotacoes.length : 0}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default App