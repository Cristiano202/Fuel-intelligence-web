import { useState } from 'react'

// Interface TypeScript para espelhar seu modelo de Posto
interface Posto {
  id: number;
  nome: string;
  bairro: string;
  precoGasolina: number;
}

function App() {
  // Dados simulados do seu sistema de postos
  const [postos] = useState<Posto[]>([
    { id: 100001, nome: "Posto Cajazeiras", bairro: "Centro", precoGasolina: 5.89 },
    { id: 100002, nome: "Posto Sertão", bairro: "Asilo", precoGasolina: 5.75 },
    { id: 100003, nome: "Posto Central", bairro: "Bela Vista", precoGasolina: 5.92 }
  ]);

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh', color: '#333' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ color: '#222', margin: 0 }}>⛽ Fuel Intelligence</h1>
        <p style={{ color: '#666', marginTop: '5px' }}>Gerenciamento estratégico de postos de combustíveis e cotações</p>
      </header>
      
      <hr style={{ border: '0', height: '1px', background: '#ccc', marginBottom: '30px' }} />

      <main>
        <h2 style={{ color: '#444', marginBottom: '20px' }}>Postos Cadastrados (Modo de Teste)</h2>
        
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {postos.map(posto => (
            <div 
              key={posto.id} 
              style={{ 
                border: '1px solid #ddd', 
                padding: '20px', 
                borderRadius: '8px', 
                minWidth: '250px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              <h3 style={{ margin: '0 0 10px 0', color: '#0056b3' }}>{posto.nome}</h3>
              <p style={{ margin: '5px 0', color: '#555' }}><strong>ID:</strong> {posto.id}</p>
              <p style={{ margin: '5px 0', color: '#555' }}><strong>Bairro:</strong> {posto.bairro}</p>
              <p style={{ margin: '15px 0 0 0', color: '#28a745', fontSize: '20px', fontWeight: 'bold' }}>
                R$ {posto.precoGasolina.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default App  