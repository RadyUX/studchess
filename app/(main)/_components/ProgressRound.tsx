import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const ProgressRound = ({ elo, eloGoal }) => {
  const percentage = Math.min((elo / eloGoal) * 100, 100);

  return (
    <div className="w-28 h-28 pt-2">
      <CircularProgressbar
        value={percentage}
        
        styles={buildStyles({
          textSize: '16px',
          pathColor: `#0077B6`,
          textColor: '#fff', // Changer la couleur du texte pour mieux correspondre à l'arrière-plan
          trailColor: '#fff', 
          backgroundColor: '#0077B6',
          pathTransitionDuration: 0.5,
          strokeLinecap: 'round', 
        })}
        strokeWidth={13} 
      />
    </div>
  );
};

export default ProgressRound;
