import { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import Toast from './components/Toast';

// ── Sample data for demo (remove when Firebase is connected) ──
const SAMPLE_TRANSACTIONS = [
  {
    id: '1',
    type: 'entrada',
    description: 'Vendas do almoço — marmitex',
    amount: 1250.00,
    category: 'Vendas Balcão',
    paymentMethod: 'PIX',
    date: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    type: 'entrada',
    description: 'Delivery iFood — pedidos variados',
    amount: 890.50,
    category: 'Delivery',
    paymentMethod: 'Cartão Crédito',
    date: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    type: 'saida',
    description: 'Compra de carne bovina — Atacadão',
    amount: 420.00,
    category: 'Ingredientes',
    paymentMethod: '',
    date: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    type: 'saida',
    description: 'Conta de energia elétrica',
    amount: 380.00,
    category: 'Luz/Água',
    paymentMethod: '',
    date: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    type: 'entrada',
    description: 'Encomenda festa — 50 salgados',
    amount: 350.00,
    category: 'Encomenda',
    paymentMethod: 'Dinheiro',
    date: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString()
  },
  // Previous month data for comparison
  {
    id: '100',
    type: 'entrada',
    description: 'Vendas mês anterior',
    amount: 8500.00,
    category: 'Vendas Balcão',
    paymentMethod: 'PIX',
    date: (() => {
      const d = new Date();
      d.setMonth(d.getMonth() - 1);
      d.setDate(15);
      return d.toISOString().split('T')[0];
    })(),
    createdAt: new Date().toISOString()
  },
  {
    id: '101',
    type: 'saida',
    description: 'Despesas mês anterior',
    amount: 3200.00,
    category: 'Ingredientes',
    paymentMethod: '',
    date: (() => {
      const d = new Date();
      d.setMonth(d.getMonth() - 1);
      d.setDate(10);
      return d.toISOString().split('T')[0];
    })(),
    createdAt: new Date().toISOString()
  },
  {
    id: '102',
    type: 'entrada',
    description: 'Delivery mês anterior',
    amount: 4200.00,
    category: 'Delivery',
    paymentMethod: 'Cartão Crédito',
    date: (() => {
      const d = new Date();
      d.setMonth(d.getMonth() - 1);
      d.setDate(20);
      return d.toISOString().split('T')[0];
    })(),
    createdAt: new Date().toISOString()
  },
  {
    id: '103',
    type: 'saida',
    description: 'Aluguel mês anterior',
    amount: 2500.00,
    category: 'Aluguel',
    paymentMethod: '',
    date: (() => {
      const d = new Date();
      d.setMonth(d.getMonth() - 1);
      d.setDate(5);
      return d.toISOString().split('T')[0];
    })(),
    createdAt: new Date().toISOString()
  }
];

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [transactions, setTransactions] = useState(SAMPLE_TRANSACTIONS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);

  // ── Toast system ──
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // ── CRUD Operations ──
  // TODO: Replace with Firebase operations
  // import { collection, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
  // import { db } from './firebaseConfig';

  const handleSaveTransaction = useCallback((transaction) => {
    setTransactions(prev => [transaction, ...prev]);
    addToast(
      transaction.type === 'entrada'
        ? `✅ Entrada de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(transaction.amount)} registrada!`
        : `📦 Saída de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(transaction.amount)} registrada!`
    );
  }, [addToast]);

  const handleDeleteTransaction = useCallback((id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    addToast('🗑️ Transação removida', 'error');
  }, [addToast]);

  return (
    <div className={`app-layout ${sidebarOpen ? 'sidebar-visible' : ''}`}>
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(prev => !prev)}
      />

      <main className="main-content">
        {activePage === 'dashboard' && (
          <Dashboard
            transactions={transactions}
            onOpenForm={() => setIsFormOpen(true)}
            onDelete={handleDeleteTransaction}
          />
        )}

        {activePage === 'transactions' && (
          <Dashboard
            transactions={transactions}
            onOpenForm={() => setIsFormOpen(true)}
            onDelete={handleDeleteTransaction}
          />
        )}

        {activePage === 'reports' && (
          <Dashboard
            transactions={transactions}
            onOpenForm={() => setIsFormOpen(true)}
            onDelete={handleDeleteTransaction}
          />
        )}

        {activePage === 'settings' && (
          <div className="page-header">
            <h2>⚙️ Configurações</h2>
            <p>Em breve — integração com Firebase, temas, e notificações.</p>
          </div>
        )}

        {activePage === 'help' && (
          <div className="page-header">
            <h2>❓ Central de Ajuda</h2>
            <p>Em breve — tutoriais, FAQ e suporte.</p>
          </div>
        )}
      </main>

      <TransactionForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveTransaction}
      />

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
