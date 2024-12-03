import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('Logging out...'); // State for displaying messages

  useEffect(() => {
    const logout = async () => {
      try {
        const response = await fetch('http://localhost:3001/users/logout', {
          method: 'POST',
          credentials: 'include', // Ensure cookies are included
        });

        if (response.ok) {
          setMessage('Logout successful!'); // Set success message
          setTimeout(() => {
            navigate('/'); // Redirect to login after 2 seconds
          }, 500); // Delay before redirecting
        } else {
          setMessage('Logout failed. Please try again.'); // Set failure message
        }
      } catch (error) {
        console.error('Logout failed:', error);
        setMessage('An error occurred during logout.'); // Handle unexpected errors
      }
    };

    logout();
  }, [navigate]);

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '20px',
        fontSize: '1.2rem',
        color: '#333',
      }}
    >
      {message}
    </div>
  );
};

export default Logout;
