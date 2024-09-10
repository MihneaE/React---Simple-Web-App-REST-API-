import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CompetitionList() {
  const [competitions, setCompetitions] = useState([]);
  const [competitionId, setCompetitionId] = useState('');
  const [competition, setCompetition] = useState({
    sample: '',
    ageCategory: '',
    count: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/api/competitions')
      .then(response => {
        setCompetitions(response.data);
      })
      .catch(error => {
        console.error('Error fetching competitions:', error);
      });
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8080/api/competitions/${id}`)
      .then(() => {
        setCompetitions(competitions.filter(competition => competition.id !== id));
      })
      .catch(error => {
        console.error('Error deleting competition:', error);
        alert('Failed to delete competition.');
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompetition(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    const method = competitionId ? 'put' : 'post';
    const url = competitionId ? `http://localhost:8080/api/competitions/${competitionId}` : 'http://localhost:8080/api/competitions';
    
    axios[method](url, competition)
      .then(response => {
        if (competitionId) {
          setCompetitions(competitions.map(comp => comp.id === competitionId ? response.data : comp));
        } else {
          setCompetitions([...competitions, response.data]);
        }
        resetForm();
      })
      .catch(error => {
        console.error('Error submitting competition:', error);
        alert('Failed to submit competition.');
      });
  };

  const resetForm = () => {
    setCompetitionId('');
    setCompetition({ sample: '', ageCategory: '', count: '' });
  };

  return (
    <div>
      <h2>Competitions</h2>
      <ul>
        {competitions.length === 0 && <li>No competitions available</li>}
        {competitions.map((comp) => (
          <li key={comp.id}>
            <p>ID: {comp.id}</p>
            <p>Sample: {comp.sample}</p>
            <p>Age Category: {comp.ageCategory}</p>
            <p>Count: {comp.count}</p>
            <button onClick={() => {
              setCompetitionId(comp.id);
              setCompetition(comp);
            }}>Edit</button>
            <button onClick={() => handleDelete(comp.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <h2>{competitionId ? 'Edit' : 'Add'} Competition</h2>
      <form onSubmit={handleAddOrUpdate}>
        <div>
          <label>Sample:</label>
          <input
            type="text"
            name="sample"
            value={competition.sample}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Age Category:</label>
          <input
            type="text"
            name="ageCategory"
            value={competition.ageCategory}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Count:</label>
          <input
            type="number"
            name="count"
            value={competition.count}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{competitionId ? 'Update' : 'Add'}</button>
        {competitionId && <button type="button" onClick={resetForm}>Back to Add</button>}
      </form>
    </div>
  );
}

export default CompetitionList;