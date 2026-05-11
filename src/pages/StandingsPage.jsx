import React from 'react';
import Standings from '../components/Standings';

const StandingsPage = () => {
  return (
    <div className="page-container container">
      <div style={{ paddingTop: '4rem' }}>
        <Standings />
      </div>
    </div>
  );
};

export default StandingsPage;
