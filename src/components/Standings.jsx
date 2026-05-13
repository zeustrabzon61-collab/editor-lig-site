import { getStorageData } from '../utils/storage';

const Standings = () => {
  const [data, setData] = React.useState(getStorageData());

  React.useEffect(() => {
    const handleSync = () => {
      setData(getStorageData());
    };
    window.addEventListener('storage', handleSync);
    return () => window.removeEventListener('storage', handleSync);
  }, []);

  const { teams } = data;

  // Sıralama algoritması: Puan > Averaj > Atılan Gol
  const sortedTeams = [...teams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const avgB = b.gf - b.ga;
    const avgA = a.gf - a.ga;
    if (avgB !== avgA) return avgB - avgA;
    return b.gf - a.gf;
  });

  return (
    <section className="standings-section">
      <div className="container">
        <h2 className="section-title">Lig <span className="neon-text">Tablosu</span></h2>
        
        <div className="glass-card standings-wrapper">
          <table className="standings-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Takım</th>
                <th>OM</th>
                <th>G</th>
                <th>B</th>
                <th>M</th>
                <th>AG</th>
                <th>YG</th>
                <th>AV</th>
                <th>Puan</th>
              </tr>
            </thead>
            <tbody>
              {sortedTeams.map((item, idx) => (
                <tr key={item.name} className={idx < 2 ? 'top-team' : ''}>
                  <td>{idx + 1}</td>
                  <td className="team-cell">
                    <img src={item.logo} alt={item.name} className="team-logo-small" onError={(e) => e.target.style.display = 'none'} />
                    {item.name}
                  </td>
                  <td>{item.played}</td>
                  <td>{item.won}</td>
                  <td>{item.drawn}</td>
                  <td>{item.lost}</td>
                  <td>{item.gf}</td>
                  <td>{item.ga}</td>
                  <td>{item.gf - item.ga}</td>
                  <td className="points-cell">{item.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Standings;
