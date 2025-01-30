import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [votes, setVotes] = useState({ optionA: 0, optionB: 0 });

  const fetchVotes = async () => {
    const response = await axios.get('https://voter.slaven.internal/api/votes');
    setVotes(response.data);
  };

  const castVote = async (option) => {
    await axios.post('https://voter.slaven.internal/api/votes', { option });
    fetchVotes();
  };

  useEffect(() => {
    fetchVotes();
  }, []);

  return (
    <div>
      <h1>Voting App</h1>
      <button onClick={() => castVote('optionA')}>Vote for Option A</button>
      <button onClick={() => castVote('optionB')}>Vote for Option B</button>
      <div>
        <p>Option A: {votes.optionA}</p>
        <p>Option B: {votes.optionB}</p>
      </div>
    </div>
  );
};

export default App;
