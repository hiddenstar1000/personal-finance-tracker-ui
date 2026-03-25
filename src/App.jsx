// finance-ui/src/App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
// (Keep your Recharts imports here)

const API_URL = 'https://personal-finance-tracker-api-5x6w.onrender.com';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('hackathon_token'));
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');

  // Configure Axios to always send the token if we have it
  const axiosInstance = axios.create({ baseURL: API_URL });
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Fetch data when token exists
  useEffect(() => {
    if (token) {
      axiosInstance.get('/transactions').then(res => setTransactions(res.data));
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/pin-login`, { username, pin });
      setToken(res.data.token);
      localStorage.setItem('hackathon_token', res.data.token);
    } catch (err) {
      alert("Login failed. Check your PIN.");
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('hackathon_token');
    setTransactions([]);
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    const newTx = { type: 'expense', amount, category };
    const res = await axiosInstance.post('/transactions', newTx);
    setTransactions([...transactions, res.data]);
    setAmount('');
  };

  // --- RENDER LOGIN SCREEN ---
  if (!token) {
    return (
      <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
        <h2>🏦 Welcome to FinTrack</h2>
        <p>Enter a username and a 4-digit PIN to start.</p>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            type="text" value={username} onChange={e => setUsername(e.target.value)} 
            placeholder="Username" required 
          />
          <input 
            type="password" value={pin} onChange={e => setPin(e.target.value)} 
            placeholder="4-Digit PIN" maxLength="4" required 
          />
          <button type="submit" style={{ padding: '10px', background: '#0088FE', color: 'white' }}>
            Login / Start
          </button>
        </form>
      </div>
    );
  }

  // --- RENDER DASHBOARD (If Logged In) ---
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>💸 Dashboard</h2>
        <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: 'red', cursor: 'pointer' }}>Logout</button>
      </div>
      
      {/* ... (Keep your Transaction Form, AI button, and Pie Chart here exactly as they were) ... */}
      
    </div>
  );
}