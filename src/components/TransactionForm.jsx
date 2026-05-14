import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown } from 'lucide-react';

const categories = {
  entrada: ['Vendas Balcão', 'Delivery', 'Encomenda', 'Outros'],
  saida: ['Ingredientes', 'Funcionários', 'Aluguel', 'Luz/Água', 'Equipamentos', 'Manutenção', 'Outros']
};

const paymentMethods = ['Dinheiro', 'PIX', 'Cartão Crédito', 'Cartão Débito', 'Vale Alimentação'];

export default function TransactionForm({ isOpen, onClose, onSave }) {
  const [type, setType] = useState('entrada');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount || !category) return;

    const transaction = {
      id: Date.now().toString(),
      type,
      description,
      amount: parseFloat(amount),
      category,
      paymentMethod: type === 'entrada' ? paymentMethod : '',
      date,
      createdAt: new Date().toISOString()
    };

    onSave(transaction);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setType('entrada');
    setDescription('');
    setAmount('');
    setCategory('');
    setPaymentMethod('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Nova Transação</h3>
              <button className="modal-close" onClick={onClose}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {/* Type Toggle */}
                <div className="form-group">
                  <label>Tipo</label>
                  <div className="type-toggle">
                    <button
                      type="button"
                      className={`type-toggle-btn ${type === 'entrada' ? 'active-entrada' : ''}`}
                      onClick={() => { setType('entrada'); setCategory(''); }}
                    >
                      <TrendingUp size={16} />
                      Entrada
                    </button>
                    <button
                      type="button"
                      className={`type-toggle-btn ${type === 'saida' ? 'active-saida' : ''}`}
                      onClick={() => { setType('saida'); setCategory(''); }}
                    >
                      <TrendingDown size={16} />
                      Saída
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div className="form-group">
                  <label>Descrição</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Ex: Venda de marmitex, Compra de carne..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                {/* Amount */}
                <div className="form-group">
                  <label>Valor (R$)</label>
                  <input
                    className="form-input"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0,00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>

                {/* Category */}
                <div className="form-group">
                  <label>Categoria</label>
                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories[type].map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Payment Method (only for entrada) */}
                {type === 'entrada' && (
                  <motion.div
                    className="form-group"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label>Forma de Pagamento</label>
                    <select
                      className="form-select"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="">Selecione</option>
                      {paymentMethods.map((pm) => (
                        <option key={pm} value={pm}>{pm}</option>
                      ))}
                    </select>
                  </motion.div>
                )}

                {/* Date */}
                <div className="form-group">
                  <label>Data</label>
                  <input
                    className="form-input"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={onClose}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {type === 'entrada' ? '💰' : '📦'} Registrar {type === 'entrada' ? 'Entrada' : 'Saída'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
