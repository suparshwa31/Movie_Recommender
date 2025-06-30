import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { gql, useMutation } from '@apollo/client';

const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(mail_id: $email, password: $password) {
      token
      user {
        id
        name
        mail_id
      }
    }
  }
`;

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [login, { loading }] = useMutation(LOGIN_MUTATION);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const { data } = await login({ variables: { email, password } });

      localStorage.setItem('token', data.login.token);
      localStorage.setItem('userId', data.login.user.id);
      navigate('/');
    } catch (err) {
      setError(err.message.replace('GraphQL error: ', '') || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-white text-4xl font-bold mb-4 text-center">MovieFlix</h1>
        <h2 className="text-white text-2xl font-semibold mb-6 text-center">Sign In</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email or phone number"
            className="p-3 mb-4 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="p-3 mb-4 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button 
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white py-3 rounded font-semibold"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <div className="flex justify-between text-gray-400 text-sm mt-4">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" /> Remember me
          </label>
          <a href="#" className="hover:underline">Need help?</a>
        </div>
        <p className="text-gray-400 text-sm mt-6 text-center">
          New to MovieFlix? <button onClick={() => navigate("/signup")} className="text-white hover:underline">Sign up now</button>
        </p>
      </div>
    </div>
  );
};

export default Login;