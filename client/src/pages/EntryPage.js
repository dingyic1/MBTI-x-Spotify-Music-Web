import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function EntryPage() {
  const [mbti, setMbti] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate(`/homepage/${mbti}`);
  };

  const handleChange = (event) => {
    setMbti(event.target.value);
  };

  return ( 
    <form onSubmit={handleSubmit}>
      <h1>Welcome to the MBTI x Music system !</h1>
      <label>
        MBTI Type:
        <input type="text" value={mbti} onChange={handleChange} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}

export default EntryPage;