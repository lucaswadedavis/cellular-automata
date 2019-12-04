import React from 'react';
import './style.css';

function SimMapCell(cell, i) {
  let background = 'rgb(';
  background += cell.red ? '255' : '0';
  background += ',';
  background += cell.green ? '255' : '0';
  background += ',';
  background += cell.blue ? '255' : '0';
  background += ')';
  const style = {
    background,
  }
  return (
    <td 
      key={ i }
      style={ style }
      onClick={ () => cell.clickHandler() }
    >
    </td>
  );
}

function SimMapRow(row, i) {
  return (
    <tr key={ i }>
      { row.map( SimMapCell ) }
    </tr>
  );
}

function View({ simMap }) {
  return (
    <div className="sim-map">
      <table>
        <tbody>
          { simMap.map( SimMapRow ) }
        </tbody>
      </table>
    </div>
  );
}

export default View;
