import React from "react";
import AdmSeeProjects from "../../../components/Admin/ProjectManagement/AdmSeeProjects";
import Nav from "../../../components/Admin/Common/NavAdmin";

const AdmProjectsView = () => {
  return (
    <div id="ListaProyectos">
      <Nav></Nav>
      <AdmSeeProjects></AdmSeeProjects>
      
    </div>
  );
};

export default AdmProjectsView;