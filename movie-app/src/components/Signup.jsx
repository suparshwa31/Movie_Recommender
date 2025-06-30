import React, { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

const ADD_USER = gql`
  mutation addUser($name: String!, $mail_id: String!, $password: String!) {
    addUser(name: $name, mail_id: $mail_id, password: $password) {
      id
      name
      mail_id
    }
  }
`;

const Signup = () => {
  const [addUser] = useMutation(ADD_USER);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  // const [date, setDate] = useState(null);
  // const [showCalendar, setShowCalendar] = useState(false);
  const [error, setError] = useState('');

  // const handleDateSelect = (selectedDate) => {
  //   setDate(selectedDate);
  //   setShowCalendar(false);
  // };

  // const formatDate = (date) => {
  //   if (!date) return 'Select Birthdate';
  //   return date.toLocaleDateString('en-US', {
  //     year: 'numeric',
  //     month: 'long',
  //     day: 'numeric'
  //   });
  // };

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // if (!date) {
    //   setError('Please select your birthdate.');
    //   return;
    // }
  
    try {
      // Format date as YYYY-MM-DD (simpler format that's less likely to cause issues)
      // const formattedDate = date.toISOString().split('T')[0];
      // const dobTimeStamp = date.getTime();
      
      await addUser({
        variables: {
          name: form.name,
          mail_id: form.email,
          // DOB: dobTimeStamp,
          password: form.password
        }
      });
      navigate('/login');
    } catch (err) {
      console.error("Error details:", err);
      setError(err.message.replace('GraphQL error: ', '') || 'Signup failed');
    }
  };  

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-white text-4xl font-bold mb-4 text-center">MovieFlix</h1>
        <h2 className="text-white text-2xl font-semibold mb-6 text-center">Sign Up</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="p-3 mb-4 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email or phone number"
            value={form.email}
            onChange={handleChange}
            className="p-3 mb-4 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="p-3 mb-4 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />
          {/* Date Picker
          <div className="relative mb-4">
            <div
              onClick={() => setShowCalendar(!showCalendar)}
              className="p-3 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600 flex justify-between items-center cursor-pointer"
            >
              {formatDate(date)}
              <CalendarIcon className="h-4 w-4" />
            </div>
            {showCalendar && (
              <div className="absolute z-10 mt-2 bg-black rounded-lg shadow-lg p-4 w-full">
                <div className="grid grid-cols-7 gap-2 text-center text-white">
                  {[...Array(31)].map((_, day) => (
                    <button
                      key={day}
                      onClick={() => {
                        const newDate = date || new Date();
                        newDate.setDate(day + 1);
                        handleDateSelect(new Date(newDate));
                      }}
                      className="p-2 hover:bg-gray-700 text-white rounded"
                      type="button"
                    >
                      {day + 1}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between mt-4">
                  <select
                    onChange={(e) => {
                      const newDate = date || new Date();
                      newDate.setMonth(parseInt(e.target.value));
                      setDate(new Date(newDate));
                    }}
                    value={date ? date.getMonth() : new Date().getMonth()}
                    className="p-2 rounded bg-gray-800 text-white"
                  >
                    {[
                      'January', 'February', 'March', 'April',
                      'May', 'June', 'July', 'August',
                      'September', 'October', 'November', 'December'
                    ].map((month, index) => (
                      <option key={month} value={index}>{month}</option>
                    ))}
                  </select>
                  <select
                    onChange={(e) => {
                      const newDate = date || new Date();
                      newDate.setFullYear(parseInt(e.target.value));
                      setDate(new Date(newDate));
                    }}
                    value={date ? date.getFullYear() : new Date().getFullYear()}
                    className="p-2 rounded bg-gray-800 text-white"
                  >
                    {[...Array(100)].map((_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <option key={year} value={year}>{year}</option>
                      );
                    })}
                  </select>
                </div>
              </div>
            )}
          </div> */}
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white py-3 rounded font-semibold"
          >
            Sign Up
          </button>
        </form>
        <p className="text-gray-400 text-sm mt-6 text-center">
          Already have an account? <a href="/login" className="text-white hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;