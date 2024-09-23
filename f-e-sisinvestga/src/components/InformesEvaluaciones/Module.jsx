import React from 'react'
import './Module.css'

export default function Módulo({ name, data }) {
  return (
    <>
    <div className='module'>
      <h2>{name}</h2>
        {name =='Recursos' ? data[0]['resources'].map(i => <li key={i}>{i}</li>): 
        name =='Hitos' ? data[0]['hitos'].map(i => <li key={i}>{i}</li>) :
        name == 'Investigadores' ? data[0]['miembros'].map(i => <li key={i}>{i}</li>): <p>No hay datos</p>}
    </div>
    </>
  )
}
