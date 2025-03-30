import { useState } from 'react';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/auth/jwt/create/', {
        email,
        password,
      });
      setToken(response.data.access);
      localStorage.setItem('token', response.data.access); // Store token
      alert('Logged in successfully!');
    } catch (error) {
      alert('Login failed: ' + error.response.data.detail);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {token && <p>Token: {token}</p>}
    </div>
  );
}
export default Login;
