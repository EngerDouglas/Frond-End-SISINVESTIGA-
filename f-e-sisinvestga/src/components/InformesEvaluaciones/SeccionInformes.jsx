import Module from './Module'
import '../css/componentes/SeccionInformes.css'

const projectData = [{
  'status': 'En Proceso',
  'name': 'Desarrollo de Máquina',
  'resources': ['Herramientas de prueba', 'Hardware', 'Sistemas', 'Programas'],
  'hitos': ['Creación de Blueprints', 'Prototipado', 'Despliegue'],
  'miembros': ['John Doe','Foo Bar','Michael Stevens', 'Gabriel Pena', 'Daniel Gómez']}]

export default function SeccionInformes() {
  return (
    <div className='container-main'>
      <h1>{projectData[0].name}</h1>
      <h2 className="status">Estado: {projectData[0].status}</h2>
      <div className="modules">
        <Module name={'Recursos'} data={projectData}/>
        <Module name={'Hitos'} data={projectData}/>
        <Module name={'Investigadores'} data={projectData}/>
      </div>
      <button className='button'>Exportar datos...</button>
    </div>
  )
}