import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const emptyProduct = { name: '', description: '', price: '', image: '', category: 'men', stock: '' };

const ADMIN_CSS = `
  .admin-layout {
    display: grid;
    grid-template-columns: 240px 1fr;
    gap: 40px;
    margin-top: 20px;
    align-items: start;
  }
  .admin-sidebar {
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: var(--ink-2);
    border: 1px solid var(--border);
    padding: 24px 16px;
    border-radius: 4px;
  }
  .admin-tab-btn {
    background: none;
    border: none;
    color: var(--muted);
    text-align: left;
    padding: 14px 20px;
    font-size: 11px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    font-weight: 600;
    cursor: pointer;
    border-radius: 2px;
    transition: all 0.25s;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .admin-tab-btn:hover {
    background: rgba(255,255,255,0.03);
    color: #fff;
  }
  .admin-tab-btn.active {
    background: rgba(201, 168, 76, 0.08);
    color: var(--gold);
    border-left: 2px solid var(--gold);
    padding-left: 18px;
  }
  .dashboard-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 40px;
  }
  .stat-card {
    background: var(--ink-2);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 24px;
    position: relative;
    overflow: hidden;
  }
  .stat-card::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0; height: 3px;
    background: var(--gold);
  }
  .stat-card.revenue::after { background: #2ecc71; }
  .stat-card.orders::after { background: #3498db; }
  .stat-card.products::after { background: #e67e22; }
  .stat-card.users::after { background: #9b59b6; }
  
  .stat-val {
    font-size: 28px;
    font-weight: 700;
    color: #fff;
    margin-top: 8px;
  }
  .stat-label {
    font-size: 11px;
    text-transform: uppercase;
    color: var(--muted);
    letter-spacing: 1.5px;
    font-weight: 600;
  }
  .dashboard-charts {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 30px;
    margin-bottom: 40px;
  }
  .chart-panel {
    background: var(--ink-2);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 24px;
  }
  .chart-panel h4 {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--gold);
    margin-bottom: 24px;
    font-weight: 600;
    border-bottom: 1px solid var(--border);
    padding-bottom: 10px;
  }
  .progress-row {
    margin-bottom: 20px;
  }
  .progress-labels {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .progress-bar-bg {
    height: 6px;
    background: rgba(255,255,255,0.05);
    border-radius: 3px;
    overflow: hidden;
  }
  .progress-bar-fill {
    height: 100%;
    background: var(--gold);
    border-radius: 3px;
    transition: width 0.5s ease;
  }
  .admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    flex-wrap: wrap;
    gap: 16px;
  }
  .admin-header h2 {
    font-size: 28px;
    font-weight: 300;
    font-style: italic;
    font-family: var(--serif);
    text-transform: uppercase;
    letter-spacing: 1.5px;
  }
  .empty-state {
    text-align: center;
    padding: 60px 20px;
    background: var(--ink-2);
    border: 1px dashed var(--border);
    color: var(--muted);
    border-radius: 4px;
  }
  .empty-state p {
    font-size: 15px;
    font-weight: 300;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
  }
  .product-form-container {
    background: var(--ink-2);
    border: 1px solid var(--border);
    padding: 32px;
    border-radius: 4px;
    margin-bottom: 32px;
  }
  .chart-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border);
    padding-bottom: 10px;
    margin-bottom: 24px;
  }
  .chart-header-row h4 {
    margin-bottom: 0 !important;
    border-bottom: none !important;
    padding-bottom: 0 !important;
  }
  .chart-toggle-btn {
    background: none;
    border: 1px solid var(--border);
    color: var(--muted);
    font-size: 10px;
    padding: 6px 12px;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-radius: 2px;
    transition: all 0.25s;
  }
  .chart-toggle-btn:hover {
    color: #fff;
    background: rgba(255,255,255,0.03);
  }
  .chart-toggle-btn.active {
    background: var(--gold);
    color: #000;
    border-color: var(--gold);
    font-weight: 600;
  }

  @media(max-width: 1024px) {
    .admin-layout {
      grid-template-columns: 1fr;
    }
    .dashboard-stats {
      grid-template-columns: 1fr 1fr;
    }
    .dashboard-charts {
      grid-template-columns: 1fr;
    }
  }
`;

export default function Admin() {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  
  // Product Form states
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  
  // Global loading/error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chartView, setChartView] = useState('monthly');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [resProducts, resOrders, resUsers] = await Promise.all([
        api.get('/products'),
        api.get('/orders'),
        api.get('/auth/users')
      ]);
      setProducts(resProducts.data);
      setOrders(resOrders.data);
      setUsers(resUsers.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Product actions
  const submitProduct = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, form);
      } else {
        await api.post('/products', form);
      }
      setForm(emptyProduct);
      setEditingId(null);
      setShowForm(false);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const startEditProduct = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name,
      description: p.description || '',
      price: p.price,
      image: p.image || '',
      category: p.category || 'men',
      stock: p.stock || 0
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  // Order actions
  const toggleDeliverOrder = async (id) => {
    try {
      await api.put(`/orders/${id}/deliver`);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const deleteOrder = async (id) => {
    if (!confirm('Are you sure you want to delete this order record?')) return;
    try {
      await api.delete(`/orders/${id}`);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  // User actions
  const toggleAdminUser = async (id) => {
    try {
      await api.put(`/auth/users/${id}`);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const deleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/auth/users/${id}`);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  // Analytics derivations
  const totalSales = orders.reduce((sum, o) => sum + (o.isPaid ? o.totalPrice : 0), 0);
  
  const categoryStats = products.reduce((acc, p) => {
    const cat = (p.category || 'general').toLowerCase();
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, { men: 0, women: 0, kids: 0 });

  const totalProdsCount = products.length || 1; // avoid divide by zero
  const percentMen = Math.round((categoryStats.men / totalProdsCount) * 100);
  const percentWomen = Math.round((categoryStats.women / totalProdsCount) * 100);
  const percentKids = Math.round((categoryStats.kids / totalProdsCount) * 100);

  // SVG Chart representation
  const salesByMonth = orders.slice(0, 7).reverse(); // take last 7 orders for chart

  // Group orders by month for monthly sales trend
  const getMonthlySales = () => {
    const monthlyData = {};
    
    // Sort orders chronological
    const sortedOrders = [...orders].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    sortedOrders.forEach(o => {
      if (!o.isPaid) return; // Only count paid orders
      const date = new Date(o.createdAt);
      const monthLabel = date.toLocaleString('default', { month: 'short' }) + ' ' + date.getFullYear().toString().slice(-2);
      
      if (!monthlyData[monthLabel]) {
        monthlyData[monthLabel] = {
          label: monthLabel,
          totalPrice: 0,
          orderCount: 0
        };
      }
      monthlyData[monthLabel].totalPrice += o.totalPrice;
      monthlyData[monthLabel].orderCount += 1;
    });
    
    return Object.values(monthlyData);
  };

  const monthlySales = getMonthlySales();

  // Group orders by day for daily sales trend
  const getDailySales = () => {
    const dailyData = {};
    
    // Sort orders chronological
    const sortedOrders = [...orders].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    sortedOrders.forEach(o => {
      if (!o.isPaid) return; // Only count paid orders
      const date = new Date(o.createdAt);
      const dayLabel = date.toLocaleString('default', { day: 'numeric', month: 'short' });
      
      if (!dailyData[dayLabel]) {
        dailyData[dayLabel] = {
          label: dayLabel,
          totalPrice: 0,
          orderCount: 0
        };
      }
      dailyData[dayLabel].totalPrice += o.totalPrice;
      dailyData[dayLabel].orderCount += 1;
    });
    
    return Object.values(dailyData);
  };

  const dailySales = getDailySales();

  return (
    <div>
      <style>{ADMIN_CSS}</style>

      <div className="admin-header">
        <h2>Administrative Dashboard</h2>
        <button className="secondary" onClick={loadData}>
          🔄 Refresh Data
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="admin-layout">
        {/* Sidebar tab links */}
        <aside className="admin-sidebar">
          <button className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            📊 Overview
          </button>
          <button className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
            🛍️ Products ({products.length})
          </button>
          <button className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            📦 Orders ({orders.length})
          </button>
          <button className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            👥 Users ({users.length})
          </button>
        </aside>

        {/* Content Tabs */}
        <main style={{ minWidth: 0 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--muted)', letterSpacing: '1px' }}>
              <span className="spinner" style={{ marginRight: '12px' }} />
              RETRIEVING CONTROL MATRIX...
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div>
                  <div className="dashboard-stats">
                    <div className="stat-card revenue">
                      <div className="stat-label">Total Revenue</div>
                      <div className="stat-val">₹{totalSales.toLocaleString()}</div>
                    </div>
                    <div className="stat-card orders">
                      <div className="stat-label">Total Orders</div>
                      <div className="stat-val">{orders.length}</div>
                    </div>
                    <div className="stat-card products">
                      <div className="stat-label">Creations</div>
                      <div className="stat-val">{products.length}</div>
                    </div>
                    <div className="stat-card users">
                      <div className="stat-label">Registered Users</div>
                      <div className="stat-val">{users.length}</div>
                    </div>
                  </div>

                  <div className="dashboard-charts">
                    {/* SVG Sales Trend Chart */}
                    <div className="chart-panel">
                      <div className="chart-header-row">
                        <h4>{chartView === 'daily' ? 'Daily Sales Trend (₹)' : chartView === 'monthly' ? 'Monthly Sales Trend (₹)' : 'Recent Orders Value (₹)'}</h4>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            className={`chart-toggle-btn ${chartView === 'daily' ? 'active' : ''}`}
                            onClick={() => setChartView('daily')}
                          >
                            Daily Sales
                          </button>
                          <button
                            type="button"
                            className={`chart-toggle-btn ${chartView === 'monthly' ? 'active' : ''}`}
                            onClick={() => setChartView('monthly')}
                          >
                            Monthly Sales
                          </button>
                          <button
                            type="button"
                            className={`chart-toggle-btn ${chartView === 'recent' ? 'active' : ''}`}
                            onClick={() => setChartView('recent')}
                          >
                            Recent Orders
                          </button>
                        </div>
                      </div>

                      {chartView === 'daily' ? (
                        dailySales.length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--muted)' }}>No daily sales history yet.</div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <svg viewBox="0 0 500 200" style={{ width: '100%', height: '200px' }}>
                              {/* Gridlines */}
                              <line x1="40" y1="20" x2="480" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
                              <line x1="40" y1="80" x2="480" y2="80" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
                              <line x1="40" y1="140" x2="480" y2="140" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
                              <line x1="40" y1="170" x2="480" y2="170" stroke="rgba(255,255,255,0.1)" />

                              {/* Dynamic Bars */}
                              {dailySales.slice(-10).map((dayData, idx, arr) => {
                                const maxVal = Math.max(...dailySales.map(d => d.totalPrice), 100);
                                const height = (dayData.totalPrice / maxVal) * 130;
                                const colWidth = Math.min(45, 400 / arr.length);
                                const x = 50 + idx * colWidth;
                                const y = 170 - height;
                                return (
                                  <g key={dayData.label}>
                                    <rect
                                      x={x}
                                      y={y}
                                      width={colWidth * 0.6}
                                      height={height}
                                      fill="var(--gold)"
                                      rx="2"
                                      opacity="0.8"
                                      style={{ transition: 'all 0.3s' }}
                                    />
                                    <text
                                      x={x + (colWidth * 0.3)}
                                      y={y - 8}
                                      fill="#fff"
                                      fontSize="7"
                                      textAnchor="middle"
                                      fontWeight="bold"
                                    >
                                      ₹{Math.round(dayData.totalPrice).toLocaleString()}
                                    </text>
                                    <text
                                      x={x + (colWidth * 0.3)}
                                      y="185"
                                      fill="var(--muted)"
                                      fontSize="7"
                                      textAnchor="middle"
                                    >
                                      {dayData.label}
                                    </text>
                                  </g>
                                );
                              })}
                            </svg>
                          </div>
                        )
                      ) : chartView === 'monthly' ? (
                        monthlySales.length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--muted)' }}>No monthly sales history yet.</div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <svg viewBox="0 0 500 200" style={{ width: '100%', height: '200px' }}>
                              {/* Gridlines */}
                              <line x1="40" y1="20" x2="480" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
                              <line x1="40" y1="80" x2="480" y2="80" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
                              <line x1="40" y1="140" x2="480" y2="140" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
                              <line x1="40" y1="170" x2="480" y2="170" stroke="rgba(255,255,255,0.1)" />

                              {/* Dynamic Bars */}
                              {monthlySales.slice(-6).map((monthData, idx, arr) => {
                                const maxVal = Math.max(...monthlySales.map(m => m.totalPrice), 100);
                                const height = (monthData.totalPrice / maxVal) * 130;
                                const colWidth = Math.min(60, 400 / arr.length);
                                const x = 50 + idx * colWidth;
                                const y = 170 - height;
                                return (
                                  <g key={monthData.label}>
                                    <rect
                                      x={x}
                                      y={y}
                                      width={colWidth * 0.6}
                                      height={height}
                                      fill="var(--gold)"
                                      rx="2"
                                      opacity="0.8"
                                      style={{ transition: 'all 0.3s' }}
                                    />
                                    <text
                                      x={x + (colWidth * 0.3)}
                                      y={y - 8}
                                      fill="#fff"
                                      fontSize="8"
                                      textAnchor="middle"
                                      fontWeight="bold"
                                    >
                                      ₹{Math.round(monthData.totalPrice).toLocaleString()}
                                    </text>
                                    <text
                                      x={x + (colWidth * 0.3)}
                                      y="185"
                                      fill="var(--muted)"
                                      fontSize="8"
                                      textAnchor="middle"
                                    >
                                      {monthData.label}
                                    </text>
                                  </g>
                                );
                              })}
                            </svg>
                          </div>
                        )
                      ) : (
                        salesByMonth.length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--muted)' }}>No sales history yet.</div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <svg viewBox="0 0 500 200" style={{ width: '100%', height: '200px' }}>
                              {/* Gridlines */}
                              <line x1="40" y1="20" x2="480" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
                              <line x1="40" y1="80" x2="480" y2="80" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
                              <line x1="40" y1="140" x2="480" y2="140" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
                              <line x1="40" y1="170" x2="480" y2="170" stroke="rgba(255,255,255,0.1)" />

                              {/* Dynamic Bars */}
                              {salesByMonth.map((order, idx) => {
                                const maxVal = Math.max(...salesByMonth.map(o => o.totalPrice), 100);
                                const height = (order.totalPrice / maxVal) * 130;
                                const x = 50 + idx * 60;
                                const y = 170 - height;
                                return (
                                  <g key={order._id}>
                                    <rect
                                      x={x}
                                      y={y}
                                      width="30"
                                      height={height}
                                      fill="var(--gold)"
                                      rx="2"
                                      opacity="0.8"
                                    />
                                    <text
                                      x={x + 15}
                                      y={y - 8}
                                      fill="#fff"
                                      fontSize="8"
                                      textAnchor="middle"
                                      fontWeight="bold"
                                    >
                                      ₹{order.totalPrice}
                                    </text>
                                    <text
                                      x={x + 15}
                                      y="185"
                                      fill="var(--muted)"
                                      fontSize="8"
                                      textAnchor="middle"
                                    >
                                      #{order._id.slice(-4).toUpperCase()}
                                    </text>
                                  </g>
                                );
                              })}
                            </svg>
                          </div>
                        )
                      )}
                    </div>

                    {/* Category Distribution panel */}
                    <div className="chart-panel">
                      <h4>Category Distribution</h4>
                      <div className="progress-row">
                        <div className="progress-labels">
                          <span>Men's Apparel</span>
                          <span>{percentMen}% ({categoryStats.men})</span>
                        </div>
                        <div className="progress-bar-bg">
                          <div className="progress-bar-fill" style={{ width: `${percentMen}%` }} />
                        </div>
                      </div>

                      <div className="progress-row">
                        <div className="progress-labels">
                          <span>Women's Apparel</span>
                          <span>{percentWomen}% ({categoryStats.women})</span>
                        </div>
                        <div className="progress-bar-bg">
                          <div className="progress-bar-fill" style={{ width: `${percentWomen}%`, background: '#3498db' }} />
                        </div>
                      </div>

                      <div className="progress-row">
                        <div className="progress-labels">
                          <span>Kids Collection</span>
                          <span>{percentKids}% ({categoryStats.kids})</span>
                        </div>
                        <div className="progress-bar-bg">
                          <div className="progress-bar-fill" style={{ width: `${percentKids}%`, background: '#e74c3c' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sales Breakdown Table */}
                  <div className="chart-panel" style={{ marginTop: '30px' }}>
                    <div className="chart-header-row" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px', marginBottom: '20px' }}>
                      <h4 style={{ color: 'var(--gold)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1.5px', margin: 0, fontWeight: 600 }}>
                        {chartView === 'daily' ? 'Daily Sales Breakdown' : 'Monthly Sales Breakdown'}
                      </h4>
                      <span style={{ fontSize: '11px', color: 'var(--muted)', letterSpacing: '0.5px' }}>
                        All recorded sales analytics
                      </span>
                    </div>
                    {chartView === 'daily' ? (
                      dailySales.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--muted)' }}>No daily sales data available.</div>
                      ) : (
                        <div style={{ overflowX: 'auto' }}>
                          <table style={{ background: 'var(--ink-2)', width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                <th style={{ textAlign: 'left', padding: '12px', color: 'var(--muted)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Date</th>
                                <th style={{ textAlign: 'center', padding: '12px', color: 'var(--muted)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Orders Count</th>
                                <th style={{ textAlign: 'right', padding: '12px', color: 'var(--muted)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Sales</th>
                                <th style={{ textAlign: 'right', padding: '12px', color: 'var(--muted)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Avg. Order Value</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[...dailySales].reverse().map((data) => (
                                <tr key={data.label} style={{ borderBottom: '1px solid var(--border)' }}>
                                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{data.label}</td>
                                  <td style={{ padding: '12px', textAlign: 'center' }}>{data.orderCount}</td>
                                  <td style={{ padding: '12px', textAlign: 'right', color: 'var(--gold)', fontWeight: 'bold' }}>
                                    ₹{data.totalPrice.toLocaleString()}
                                  </td>
                                  <td style={{ padding: '12px', textAlign: 'right' }}>
                                    ₹{Math.round(data.totalPrice / data.orderCount).toLocaleString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )
                    ) : (
                      monthlySales.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--muted)' }}>No monthly sales data available.</div>
                      ) : (
                        <div style={{ overflowX: 'auto' }}>
                          <table style={{ background: 'var(--ink-2)', width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                <th style={{ textAlign: 'left', padding: '12px', color: 'var(--muted)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Month</th>
                                <th style={{ textAlign: 'center', padding: '12px', color: 'var(--muted)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Orders Count</th>
                                <th style={{ textAlign: 'right', padding: '12px', color: 'var(--muted)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Sales</th>
                                <th style={{ textAlign: 'right', padding: '12px', color: 'var(--muted)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Avg. Order Value</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[...monthlySales].reverse().map((data) => (
                                <tr key={data.label} style={{ borderBottom: '1px solid var(--border)' }}>
                                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{data.label}</td>
                                  <td style={{ padding: '12px', textAlign: 'center' }}>{data.orderCount}</td>
                                  <td style={{ padding: '12px', textAlign: 'right', color: 'var(--gold)', fontWeight: 'bold' }}>
                                    ₹{data.totalPrice.toLocaleString()}
                                  </td>
                                  <td style={{ padding: '12px', textAlign: 'right' }}>
                                    ₹{Math.round(data.totalPrice / data.orderCount).toLocaleString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: PRODUCTS */}
              {activeTab === 'products' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '18px', textTransform: 'uppercase', letterSpacing: '1px' }}>System Catalog</h3>
                    <button onClick={() => { setShowForm(!showForm); setForm(emptyProduct); setEditingId(null); }}>
                      {showForm ? '✕ Close Form' : '✦ Add Creation'}
                    </button>
                  </div>

                  {showForm && (
                    <div className="product-form-container">
                      <form onSubmit={submitProduct}>
                        <h3 style={{ fontSize: '16px', border: 'none', marginBottom: '16px' }}>{editingId ? 'Edit Product Details' : 'Introduce New Creation'}</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div>
                            <label style={{ fontSize: '11px', color: 'var(--gold)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Product Name</label>
                            <input placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                          </div>
                          <div>
                            <label style={{ fontSize: '11px', color: 'var(--gold)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Product Price (₹)</label>
                            <input type="number" placeholder="Price" required value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
                          </div>
                        </div>

                        <label style={{ fontSize: '11px', color: 'var(--gold)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Product Description</label>
                        <textarea placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                          <div>
                            <label style={{ fontSize: '11px', color: 'var(--gold)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Image Path</label>
                            <input placeholder="e.g. /products/versace-1.jpg" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                          </div>
                          <div>
                            <label style={{ fontSize: '11px', color: 'var(--gold)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Category</label>
                            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                              <option value="men">Men</option>
                              <option value="women">Women</option>
                              <option value="kids">Kids</option>
                            </select>
                          </div>
                          <div>
                            <label style={{ fontSize: '11px', color: 'var(--gold)', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Stock Quantity</label>
                            <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
                          </div>
                        </div>

                        <div className="row" style={{ marginTop: '10px' }}>
                          <button>{editingId ? 'Save Edits' : 'Submit Creation'}</button>
                          <button type="button" className="secondary" onClick={() => { setShowForm(false); setForm(emptyProduct); setEditingId(null); }}>Cancel</button>
                        </div>
                      </form>
                    </div>
                  )}

                  {products.length === 0 ? (
                    <div className="empty-state">
                      <p>No products exist in database.</p>
                    </div>
                  ) : (
                    <table style={{ background: 'var(--ink-2)' }}>
                      <thead>
                        <tr>
                          <th>Image</th>
                          <th>Name</th>
                          <th>Price</th>
                          <th>Stock</th>
                          <th>Category</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((p) => (
                          <tr key={p._id}>
                            <td>
                              <img src={p.image} alt="" style={{ width: '40px', height: '50px', objectFit: 'cover', borderRadius: '1px', border: '1px solid var(--border)' }} />
                            </td>
                            <td style={{ fontWeight: '600' }}>{p.name}</td>
                            <td>₹{p.price.toLocaleString()}</td>
                            <td>
                              <span className={p.stock > 0 ? 'badge success' : 'badge warning'}>
                                {p.stock} units
                              </span>
                            </td>
                            <td style={{ textTransform: 'capitalize' }}>{p.category}</td>
                            <td style={{ textAlign: 'right' }}>
                              <button className="secondary" style={{ padding: '6px 12px', fontSize: '10px', marginRight: '8px' }} onClick={() => startEditProduct(p)}>Edit</button>
                              <button className="danger" style={{ padding: '6px 12px', fontSize: '10px' }} onClick={() => deleteProduct(p._id)}>Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* TAB 3: ORDERS */}
              {activeTab === 'orders' && (
                <div>
                  <h3 style={{ fontSize: '18px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>Customer Orders</h3>

                  {orders.length === 0 ? (
                    <div className="empty-state">
                      <p>No customer orders placed yet.</p>
                    </div>
                  ) : (
                    <table style={{ background: 'var(--ink-2)' }}>
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Date</th>
                          <th>Total Amount</th>
                          <th>Status</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((o) => (
                          <tr key={o._id}>
                            <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>#{o._id.toUpperCase()}</td>
                            <td>
                              <div>{o.user?.name || 'Guest User'}</div>
                              <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{o.user?.email || 'N/A'}</div>
                            </td>
                            <td>{new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                            <td style={{ color: 'var(--gold)', fontWeight: 'bold' }}>₹{o.totalPrice.toLocaleString()}</td>
                            <td>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <span className="badge success" style={{ width: 'fit-content' }}>
                                  {o.isPaid ? 'PAID' : 'UNPAID'}
                                </span>
                                <span className={o.isDelivered ? 'badge success' : 'badge warning'} style={{ width: 'fit-content' }}>
                                  {o.isDelivered ? 'DELIVERED' : 'PENDING'}
                                </span>
                              </div>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <button 
                                className="secondary" 
                                style={{ padding: '6px 12px', fontSize: '10px', marginRight: '8px', border: o.isDelivered ? '1px solid #2ecc71' : '1px solid var(--gold)' }} 
                                onClick={() => toggleDeliverOrder(o._id)}
                              >
                                {o.isDelivered ? '🔄 Mark Undelivered' : '🚚 Ship & Deliver'}
                              </button>
                              <button className="danger" style={{ padding: '6px 12px', fontSize: '10px' }} onClick={() => deleteOrder(o._id)}>Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* TAB 4: USERS */}
              {activeTab === 'users' && (
                <div>
                  <h3 style={{ fontSize: '18px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>User Matrix</h3>

                  {users.length === 0 ? (
                    <div className="empty-state">
                      <p>No registered users found.</p>
                    </div>
                  ) : (
                    <table style={{ background: 'var(--ink-2)' }}>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email Address</th>
                          <th>Joined On</th>
                          <th>Role</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => {
                          const isSelf = u._id === currentUser?._id;
                          return (
                            <tr key={u._id}>
                              <td style={{ fontWeight: '600' }}>
                                {u.name} {isSelf && <span style={{ color: 'var(--gold)', fontSize: '11px' }}>(You)</span>}
                              </td>
                              <td>{u.email}</td>
                              <td>{new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                              <td>
                                <span className={u.isAdmin ? 'badge success' : 'badge info'}>
                                  {u.isAdmin ? '🛡️ Administrator' : '👤 Customer'}
                                </span>
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <button
                                  className="secondary"
                                  style={{ padding: '6px 12px', fontSize: '10px', marginRight: '8px', opacity: isSelf ? 0.3 : 1 }}
                                  disabled={isSelf}
                                  onClick={() => toggleAdminUser(u._id)}
                                >
                                  {u.isAdmin ? '👤 Demote User' : '🛡️ Promote Admin'}
                                </button>
                                <button
                                  className="danger"
                                  style={{ padding: '6px 12px', fontSize: '10px', opacity: isSelf ? 0.3 : 1 }}
                                  disabled={isSelf}
                                  onClick={() => deleteUser(u._id)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
