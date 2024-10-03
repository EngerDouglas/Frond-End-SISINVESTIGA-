import React from 'react'
import NavInvestigator from '../../components/Comunes/NavInvestigator'
import DashboardContent from '../../components/GestionInvestigadores/DashboardContent'
import ErrorBoundary from '../../components/Comunes/ErrorBoundary'
import '../../css/componentes/GestionInvestigadores/DashboardContent.css'

const InvestDashboard = () => {
  return (
    <div className='invest-dashboard'>
      <NavInvestigator />
      <ErrorBoundary>
        <DashboardContent />
      </ErrorBoundary>
    </div>
  )
}

export default InvestDashboard