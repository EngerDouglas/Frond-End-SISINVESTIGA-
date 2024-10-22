import React from 'react';
import NavAdmin from '../../components/Common/NavAdmin';
import AdmProfileSettings from "../../../components/Admin/ProfileManagement/AdmProfileSettings"


const AdmProfileView = () => {
    return(
        <>
            <NavAdmin/>
            <AdmProfileSettings></AdmProfileSettings>
        </>
    )


}

export default AdmProfileView;