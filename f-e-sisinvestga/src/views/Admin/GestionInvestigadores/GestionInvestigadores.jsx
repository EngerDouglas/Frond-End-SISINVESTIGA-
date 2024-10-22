import React from 'react'
import GestionInvestigadores from '../../../components/GestionInvestigadores/AdmSeeInvestigator'
import NavAdmin from '../../../components/Comunes/NavAdmin'

const AdminDashboard = () => {
  return (
    <div>
        <NavAdmin></NavAdmin>
        <GestionInvestigadores></GestionInvestigadores>
    </div>
  )
}

export default AdminDashboard