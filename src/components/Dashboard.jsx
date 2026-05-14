import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Plus,
  Trash2,
  Receipt
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Filler,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } }
};

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

export default function Dashboard({ transactions, onOpenForm, onDelete }) {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // ── Computed stats ──
  const stats = useMemo(() => {
    const todayEntradas = transactions
      .filter(t => t.date === todayStr && t.type === 'entrada')
      .reduce((sum, t) => sum + t.amount, 0);

    const todaySaidas = transactions
      .filter(t => t.date === todayStr && t.type === 'saida')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthEntradas = transactions
      .filter(t => {
        const d = new Date(t.date + 'T12:00:00');
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear && t.type === 'entrada';
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const monthSaidas = transactions
      .filter(t => {
        const d = new Date(t.date + 'T12:00:00');
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear && t.type === 'saida';
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const totalTransactions = transactions.filter(t => {
      const d = new Date(t.date + 'T12:00:00');
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;

    return {
      todayEntradas,
      todaySaidas,
      todayBalance: todayEntradas - todaySaidas,
      monthEntradas,
      monthSaidas,
      monthBalance: monthEntradas - monthSaidas,
      totalTransactions
    };
  }, [transactions, todayStr, currentMonth, currentYear]);

  // ── Chart: Monthly Comparison (Bar) ──
  const barChartData = useMemo(() => {
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const prevEntradas = transactions
      .filter(t => {
        const d = new Date(t.date + 'T12:00:00');
        return d.getMonth() === prevMonth && d.getFullYear() === prevYear && t.type === 'entrada';
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const prevSaidas = transactions
      .filter(t => {
        const d = new Date(t.date + 'T12:00:00');
        return d.getMonth() === prevMonth && d.getFullYear() === prevYear && t.type === 'saida';
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const months = [
      new Date(prevYear, prevMonth).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''),
      new Date(currentYear, currentMonth).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')
    ];

    return {
      labels: months,
      datasets: [
        {
          label: 'Entradas',
          data: [prevEntradas, stats.monthEntradas],
          backgroundColor: ['rgba(16, 185, 129, 0.25)', 'rgba(16, 185, 129, 0.5)'],
          borderColor: ['#10b981', '#10b981'],
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        },
        {
          label: 'Saídas',
          data: [prevSaidas, stats.monthSaidas],
          backgroundColor: ['rgba(239, 68, 68, 0.2)', 'rgba(239, 68, 68, 0.4)'],
          borderColor: ['#ef4444', '#ef4444'],
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        }
      ]
    };
  }, [transactions, currentMonth, currentYear, stats]);

  // ── Chart: Daily trend (Line) ──
  const lineChartData = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const dayLabels = [];
    const dailyEntradas = [];
    const dailySaidas = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const dayStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      dayLabels.push(String(i));

      const dayE = transactions
        .filter(t => t.date === dayStr && t.type === 'entrada')
        .reduce((sum, t) => sum + t.amount, 0);
      const dayS = transactions
        .filter(t => t.date === dayStr && t.type === 'saida')
        .reduce((sum, t) => sum + t.amount, 0);

      dailyEntradas.push(dayE);
      dailySaidas.push(dayS);
    }

    return {
      labels: dayLabels,
      datasets: [
        {
          label: 'Entradas',
          data: dailyEntradas,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.08)',
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#10b981',
          borderWidth: 2.5,
        },
        {
          label: 'Saídas',
          data: dailySaidas,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.05)',
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#ef4444',
          borderWidth: 2.5,
        }
      ]
    };
  }, [transactions, currentMonth, currentYear]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          color: '#94a3b8',
          font: { family: 'Inter', size: 12, weight: '500' },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 20, 35, 0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(16, 185, 129, 0.2)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 10,
        titleFont: { family: 'Inter', weight: '600' },
        bodyFont: { family: 'Inter' },
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${formatCurrency(ctx.parsed.y)}`
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.03)', drawBorder: false },
        ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } },
        border: { display: false }
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.03)', drawBorder: false },
        ticks: {
          color: '#64748b',
          font: { family: 'Inter', size: 11 },
          callback: (v) => formatCurrency(v)
        },
        border: { display: false }
      }
    }
  };

  // ── Recent Transactions ──
  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 15);
  }, [transactions]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div className="page-header" variants={itemVariants}>
        <div className="header-row">
          <div>
            <h2>Dashboard</h2>
            <p>Visão geral do seu negócio — {today.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
          <button className="btn btn-primary" onClick={onOpenForm}>
            <Plus size={18} />
            Nova Transação
          </button>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <motion.div className="stats-grid" variants={itemVariants}>
        {[
          {
            icon: TrendingUp,
            label: 'Entradas Hoje',
            value: formatCurrency(stats.todayEntradas),
            color: 'emerald',
            sub: `${formatCurrency(stats.monthEntradas)} este mês`,
            subClass: 'positive'
          },
          {
            icon: TrendingDown,
            label: 'Saídas Hoje',
            value: formatCurrency(stats.todaySaidas),
            color: 'red',
            sub: `${formatCurrency(stats.monthSaidas)} este mês`,
            subClass: 'negative'
          },
          {
            icon: DollarSign,
            label: 'Saldo do Dia',
            value: formatCurrency(stats.todayBalance),
            color: stats.todayBalance >= 0 ? 'gold' : 'red',
            sub: `Saldo mensal: ${formatCurrency(stats.monthBalance)}`,
            subClass: stats.monthBalance >= 0 ? 'positive' : 'negative'
          },
          {
            icon: ShoppingCart,
            label: 'Transações no Mês',
            value: stats.totalTransactions,
            color: 'blue',
            sub: 'Total registrado',
            subClass: ''
          }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="glass-card stat-card"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div className={`stat-icon ${stat.color}`}>
              <stat.icon size={22} />
            </div>
            <div className="stat-info">
              <div className="stat-label">{stat.label}</div>
              <div className={`stat-value ${stat.color}`}>{stat.value}</div>
              <div className={`stat-change ${stat.subClass}`}>{stat.sub}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts */}
      <motion.div className="charts-grid" variants={itemVariants}>
        <motion.div className="glass-card chart-card" variants={itemVariants}>
          <div className="chart-header">
            <h3>📈 Fluxo Diário — {today.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</h3>
            <span className="badge">Tempo real</span>
          </div>
          <div className="chart-container">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </motion.div>

        <motion.div className="glass-card chart-card" variants={itemVariants}>
          <div className="chart-header">
            <h3>📊 Mês Atual vs Anterior</h3>
            <span className="badge">Comparativo</span>
          </div>
          <div className="chart-container">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </motion.div>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div className="transactions-section" variants={itemVariants}>
        <div className="transactions-header">
          <h3>🧾 Transações Recentes</h3>
          <button className="btn btn-ghost" onClick={onOpenForm}>
            <Plus size={16} /> Adicionar
          </button>
        </div>

        <div className="glass-card table-card">
          {recentTransactions.length === 0 ? (
            <div className="empty-state">
              <Receipt className="empty-state-icon" size={64} />
              <h4>Nenhuma transação registrada</h4>
              <p>Clique em "Nova Transação" para começar a monitorar suas finanças</p>
            </div>
          ) : (
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Tipo</th>
                  <th>Descrição</th>
                  <th>Categoria</th>
                  <th>Valor</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((t, i) => (
                  <motion.tr
                    key={t.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <td>{formatDate(t.date)}</td>
                    <td>
                      <span className={`type-badge ${t.type}`}>
                        {t.type === 'entrada' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {t.type === 'entrada' ? 'Entrada' : 'Saída'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{t.description}</td>
                    <td><span className="category-tag">{t.category}</span></td>
                    <td className={`amount-cell ${t.type === 'entrada' ? 'positive' : 'negative'}`}>
                      {t.type === 'entrada' ? '+' : '-'} {formatCurrency(t.amount)}
                    </td>
                    <td>
                      <button
                        className="action-btn-delete"
                        onClick={() => onDelete(t.id)}
                        title="Excluir"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
