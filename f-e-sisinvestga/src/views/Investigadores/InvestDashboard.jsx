import React from 'react'
import NavInvestigator from '../../components/Comunes/NavInvestigator'
import DashboardContent from '../../components/GestionInvestigadores/DashboardContent'
import ErrorBoundary from '../../components/Comunes/ErrorBoundary'

const InvestDashboard = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <NavInvestigator />
      <main className="flex-grow">
        <ErrorBoundary>
          <DashboardContent />
        </ErrorBoundary>
      </main>
    </div>
  )
}

export default InvestDashboard