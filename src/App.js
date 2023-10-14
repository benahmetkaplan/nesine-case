import './App.css';
import React, { useState, useEffect } from "react";

function App() {
  const [matches, setMatches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [misli, setMisli] = useState(1);
  const perPage = 10;
  
  const handleMisliChange = (event) => {
    setMisli(Number(event.target.value));
  };  

  useEffect(() => {
    loadMoreData();
  }, []);

  const loadMoreData = () => {
    fetch(`https://nesine-case-study.onrender.com/bets`)
      .then(response => response.json())
      .then(data => {
        const newData = data.slice(currentPage * perPage, (currentPage + 1) * perPage);
        setMatches([...matches, ...newData]);
        setCurrentPage(currentPage + 1);
      })
      .catch(error => {
        console.error("Veri çekerken hata oluştu:", error);
      });
  };

  const selectOdd = (matchId, selectedOdd) => {
    const updatedMatches = matches.map(match => {
      if (match.NID === matchId) {
        return {
          ...match,
          selectedOdd: selectedOdd
        };
      }
      return match;
    });
    setMatches(updatedMatches);
  };

  const selectedMatches = matches.filter(match => match.selectedOdd);
  const totalOdds = selectedMatches.length > 0 ? selectedMatches.map(item => parseFloat(item.selectedOdd)).reduce((acc, curr) => acc * curr, 1) : 0;

  return (
    <div className="container">
      { matches.map(match => (
          <div key={match.NID} className="match">
            <h2>{match.N}</h2>
            <p>{match.DAY}, {match.D} {match.T}</p>
            <p>Lig: {match.LN}</p>
            <div className="bet-types">
              {Object.values(match.OCG).map(betType => (
                <div key={betType.ID} className="bet-type">
                  <h3>{betType.N}</h3>
                  <div className="odds">
                    {Object.values(betType.OC).map(odd => (
                      <button
                        onClick={() => selectOdd(match.NID, odd.O)}
                        className={match.selectedOdd === odd.O ? 'selected' : ''}
                        key={odd.ID}>
                        {odd.N}: {odd.O}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
      ))}
      
      <button className='load-more-btn' onClick={loadMoreData}>Daha Fazla Yükle</button>

      {selectedMatches.length > 0 && (
        <div className="selected-matches">
          <h2 className='mb-10'>Kuponunuz</h2>
          <ul>
            {selectedMatches.map(match => (
              <li key={match.NID}>
                <p><strong>{match.selectedOdd}</strong> - {match.D} {match.T} {match.N}</p>
              </li>
            ))}
            <li>
              Toplam Oran: <strong>{totalOdds} TL</strong>&emsp;
              Misli: &emsp;
              <select value={misli} onChange={handleMisliChange}>
                {Array.from({ length: 1000 }, (_, i) => i + 1).map(value => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select> TL&emsp;
              Kazanç: <strong>{totalOdds * misli} TL</strong>
            </li>
          </ul>
        </div>
      )}

    </div>
  );
}

export default App;