import React from 'react';
import './style.css';

function NpcComponent( npc, i ) {
  const style = {
    animationDelay: ( 0.4 + i * 0.08 ) + 's',
    animationName: 'appear',
    animationDuration: '0.8s',
    animationFillMode: 'both',
    animationTimingFunction: 'ease-out',
  };
  return (
    <p key={npc.id} className="npc-card" style={ style }>
      { npc.name } [{npc.sex}]
    </p>
  );
}

function View({ npcs }) {
  return (
    <div className="npc-view">
      <h1>Npc View</h1>
      { npcs.map(NpcComponent) }
    </div>
  );
}

export default View;
