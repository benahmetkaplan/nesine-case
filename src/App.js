import './App.css';
import React, { useState, useEffect } from "react";

function App() {
  const [matches, setMatches] = useState(null);

  useEffect(() => {
    fetch("https://nesine-case-study.onrender.com/bets")
    .then(response => response.json())
    .then(data => {
      setMatches(data);
    })
    .catch(error => {
      console.error("Veri çekerken hata oluştu:", error);
    });
  }, []);

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

  const selectedMatches = matches !== null ? matches.filter(match => match.selectedOdd) : null;

  return (
    <div className="container">
      { matches !== null && (
        matches.map(match => (
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
        ))
      )}

      {selectedMatches !== null && (
        <div className="selected-matches">
          <h2 className='mb-10'>Seçimleriniz</h2>
          <ul>
            {selectedMatches.map(match => (
              <li key={match.NID}>
                <p><strong>{match.selectedOdd}</strong> - {match.D} {match.T} {match.N}</p>
              </li>
            ))}
            <li>Toplam: <strong>{selectedMatches.map(item => parseFloat(item.selectedOdd)).reduce((acc, curr) => acc + curr, 0)}</strong></li>
          </ul>
        </div>
      )}

    </div>
  );
}

export default App;
