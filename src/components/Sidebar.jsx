import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ArrowUpDown,
  BarChart3,
  Settings,
  HelpCircle,
  UtensilsCrossed,
  Menu,
  X
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'transactions', icon: ArrowUpDown, label: 'Transações' },
  { id: 'reports', icon: BarChart3, label: 'Relatórios' },
];

const footerItems = [
  { id: 'settings', icon: Settings, label: 'Configurações' },
  { id: 'help', icon: HelpCircle, label: 'Ajuda' },
];

export default function Sidebar({ activePage, onNavigate, isOpen, onToggle }) {
  const handleNav = (id) => {
    onNavigate(id);
    // Close sidebar on mobile after navigation
    if (window.innerWidth <= 768) {
      onToggle();
    }
  };

  return (
    <>
      {/* Hamburger Button — always visible on mobile */}
      <button className="hamburger-btn" onClick={onToggle} aria-label="Menu">
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`sidebar ${isOpen ? 'open' : ''}`}
        initial={{ x: -260 }}
        animate={{ x: isOpen ? 0 : -260 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <UtensilsCrossed size={20} />
          </div>
          <div className="sidebar-brand">
            <h1>FoodFinance</h1>
            <span>Controle Pro</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item, i) => (
            <motion.div
              key={item.id}
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => handleNav(item.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <item.icon className="icon" size={20} />
              <span className="nav-label">{item.label}</span>
            </motion.div>
          ))}
        </nav>

        <div className="sidebar-footer">
          {footerItems.map((item) => (
            <div
              key={item.id}
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => handleNav(item.id)}
            >
              <item.icon className="icon" size={20} />
              <span className="nav-label">{item.label}</span>
            </div>
          ))}
        </div>
      </motion.aside>
    </>
  );
}
