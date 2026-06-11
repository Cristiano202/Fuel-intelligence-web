import { CadastroPosto } from './components/CadastroPosto';

function App() {
  return (
    <div className="min-h-screen bg-[#f4f6f9] text-slate-800 antialiased">
      {/* Header Fino e Elegante */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm shadow-slate-100/40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 text-white w-7 h-7 flex items-center justify-center rounded-lg font-black text-sm">
              FI
            </div>
            <h1 className="text-sm font-bold tracking-tight text-slate-800">
              Fuel Intelligence <span className="text-xs font-normal text-slate-400 ml-1">| Admin</span>
            </h1>
          </div>
        </div>
      </header>

      <main className="py-6">
        <CadastroPosto />
      </main>
    </div>
  );
}

export default App;