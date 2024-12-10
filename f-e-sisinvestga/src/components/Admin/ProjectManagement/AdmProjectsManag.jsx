import React from 'react';
import { Container } from 'react-bootstrap';
import AdmProjectList from './AdmProjectList';
import '../../../css/Admin/AdmProjectManag.css';

const AdmProjectsManagement = () => {
  return (
    <Container fluid className="project-management-container">
      <h2 className="text-center mb-4 project-management-title">Project Management</h2>
      <AdmProjectList />
    </Container>
  );
};

export default AdmProjectsManagement;