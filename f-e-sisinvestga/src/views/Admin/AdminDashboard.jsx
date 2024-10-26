import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminNav from "../../components/Admin/Common/NavAdmin";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { getData, getDataParams } from '../../services/apiServices';
import { Container, Row, Col, Card, Tab, Tabs, Spinner, Badge, ListGroup, Button, OverlayTrigger } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faProjectDiagram, faBook, faStar, faFolder, faUserTie, faUserCog, faFileAlt, faJournalWhills, faFileContract, faBell, faChartBar, faCog, faListOl } from '@fortawesome/free-solid-svg-icons';
import "../../css/Admin/AdminDashboard.css";

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: { total: 0, active: 0, enabled: 0, disabled: 0 },
    projects: { total: 0, inProgress: 0, completed: 0, deleted: 0 },
    publications: { total: 0, published: 0, inReview: 0, deleted: 0 },
    evaluations: { total: 0, averageScore: 0 },
    requests: { total: 0, pending: 0, approved: 0, rejected: 0, inProcess: 0 },
  });
  const [recentEvaluations, setRecentEvaluations] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const usersData = await getData('users');
      const projectsData = await getDataParams('projects', { includeDeleted: true });
      const publicationsData = await getDataParams('publications', { includeDeleted: true });
      const evaluationsData = await getDataParams('evaluations/all', { limit: 1000 });
      const requestsData = await getDataParams('requests', { limit: 1000 });

      const totalEvaluations = evaluationsData.total;
      const averageScore = totalEvaluations > 0
        ? (evaluationsData.evaluations.reduce((sum, eva) => sum + eva.puntuacion, 0) / totalEvaluations).toFixed(2)
        : 0;

      const totalRequests = requestsData.total;
      const pendingRequests = requestsData.solicitudes.filter(req => req.estado === 'Pendiente').length;
      const approvedRequests = requestsData.solicitudes.filter(req => req.estado === 'Aprobada').length;
      const rejectedRequests = requestsData.solicitudes.filter(req => req.estado === 'Rechazada').length;
      const inProcessRequests = requestsData.solicitudes.filter(req => req.estado === 'En Proceso').length;

      setStats({
        users: {
          total: usersData.length,
          active: usersData.filter(user => user.isActive).length,
          enabled: usersData.filter(user => !user.isDisabled).length,
          disabled: usersData.filter(user => user.isDisabled).length,
        },
        projects: {
          total: projectsData.total,
          inProgress: projectsData.projects.filter(project => project.estado === 'En Proceso').length,
          completed: projectsData.projects.filter(project => project.estado === 'Finalizado').length,
          deleted: projectsData.projects.filter(project => project.isDeleted).length,
        },
        publications: {
          total: publicationsData.total,
          published: publicationsData.publications.filter(pub => pub.estado === 'Publicado').length,
          inReview: publicationsData.publications.filter(pub => pub.estado === 'Revisado').length,
          deleted: publicationsData.publications.filter(pub => pub.isDeleted).length,
        },
        evaluations: {
          total: totalEvaluations,
          averageScore: averageScore,
        },
        requests: {
          total: totalRequests,
          pending: pendingRequests,
          approved: approvedRequests,
          rejected: rejectedRequests,
          inProcess: inProcessRequests,
        },
      });

      setRecentEvaluations(evaluationsData.evaluations.slice(0, 5));
      setRecentRequests(requestsData.solicitudes.slice(0, 5));

      setLoading(false);
    } catch (error) {
      console.error("Error fetching stats:", error);
      setLoading(false);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const createChartData = (data, labels, colors) => ({
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1,
      },
    ],
  });

  const userChartData = createChartData(
    [stats.users.active, stats.users.total - stats.users.active],
    ['Activos', 'Inactivos'],
    ['#36A2EB', '#FF6384']
  );

  const projectChartData = createChartData(
    [stats.projects.inProgress, stats.projects.completed, stats.projects.deleted],
    ['En Proceso', 'Completados', 'Eliminados'],
    ['#FFCE56', '#4BC0C0', '#FF6384']
  );

  const publicationChartData = createChartData(
    [stats.publications.published, stats.publications.inReview, stats.publications.deleted],
    ['Publicados', 'Revisados', 'Eliminados'],
    ['#4BC0C0', '#FFCE56', '#FF6384']
  );

  const requestsChartData = createChartData(
    [stats.requests.pending, stats.requests.approved, stats.requests.rejected, stats.requests.inProcess],
    ['Pendientes', 'Aprobadas', 'Rechazadas', 'En Proceso'],
    ['#FFCE56', '#4BC0C0', '#FF6384', '#36A2EB']
  );

  const renderTooltip = (content) => (
    <Tooltip id="button-tooltip">
      {content}
    </Tooltip>
  );

  const StatCard = ({ title, icon, value, color }) => (
    <Card className="stat-card mb-4">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="text-muted mb-2">{title}</h6>
            <h3 className="mb-0">{value}</h3>
          </div>
          <FontAwesomeIcon icon={icon} size="2x" color={color} />
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <div className="admin-dashboard">
      <AdminNav />
      <Container fluid className="py-4">
        <h1 className="dashboard-title mb-4">Panel de Administración</h1>
        
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
          </div>
        ) : (
          <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
            <Tab eventKey="overview" title="Resumen">
              <Row>
                <Col md={4} lg={3}>
                  <StatCard title="Usuarios Totales" icon={faUsers} value={stats.users.total} color="#36A2EB" />
                </Col>
                <Col md={4} lg={3}>
                  <StatCard title="Proyectos Activos" icon={faProjectDiagram} value={stats.projects.inProgress} color="#FFCE56" />
                </Col>
                <Col md={4} lg={3}>
                  <StatCard title="Publicaciones" icon={faBook} value={stats.publications.total} color="#4BC0C0" />
                </Col>
                <Col md={4} lg={3}>
                  <StatCard title="Evaluaciones" icon={faStar} value={stats.evaluations.total} color="#FF6384" />
                </Col>
              </Row>
              <Row>
                <Col md={6} lg={3}>
                  <Card className="mb-4">
                    <Card.Body>
                      <Card.Title>Distribución de Usuarios</Card.Title>
                      <div className="chart-container">
                        <Pie data={userChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6} lg={3}>
                  <Card className="mb-4">
                    <Card.Body>
                      <Card.Title>Estado de Proyectos</Card.Title>
                      <div className="chart-container">
                        <Pie data={projectChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6} lg={3}>
                  <Card className="mb-4">
                    <Card.Body>
                      <Card.Title>Publicaciones</Card.Title>
                      <div className="chart-container">
                        <Pie data={publicationChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6} lg={3}>
                  <Card className="mb-4">
                    <Card.Body>
                      <Card.Title>Solicitudes</Card.Title>
                      <div className="chart-container">
                        <Pie data={requestsChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab>
            <Tab eventKey="evaluations" title="Evaluaciones Recientes">
              <Card>
                <Card.Body>
                  <Card.Title>Evaluaciones Recientes</Card.Title>
                  <ListGroup variant="flush">
                    {recentEvaluations.map(evaluation => (
                      <ListGroup.Item key={evaluation._id} className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{evaluation.project.nombre}</strong>
                          <p className="mb-0 text-muted">Evaluador: {evaluation.evaluator.nombre}</p>
                        </div>
                        <div>
                          <Badge bg="primary" pill>{evaluation.puntuacion}</Badge>
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 250, hide: 400 }}
                            overlay={renderTooltip('Ver detalles')}
                          >
                            <Button variant="link" size="sm" onClick={() => handleNavigation(`/admin/evaluationprojects/${evaluation._id}`)}>
                              Detalles
                            </Button>
                          </OverlayTrigger>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Tab>
            <Tab eventKey="requests" title="Solicitudes Recientes">
              <Card>
                <Card.Body>
                  <Card.Title>Solicitudes Recientes</Card.Title>
                  <ListGroup variant="flush">
                    {recentRequests.map(request => (
                      <ListGroup.Item key={request._id} className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{request.tipoSolicitud}</strong>
                          <p className="mb-0 text-muted">Solicitante: {request.solicitante.nombre} {request.solicitante.apellido}</p>
                        </div>
                        <div>
                          <Badge bg={request.estado === 'Pendiente' ? 'warning' : 'success'} pill>{request.estado}</Badge>
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 250, hide: 400 }}
                            overlay={renderTooltip('Ver detalles')}
                          >
                            <Button variant="link" size="sm" onClick={() => handleNavigation(`/admin/solicitudes/${request._id}`)}>
                              Detalles
                            </Button>
                          </OverlayTrigger>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        )}
        
        <Row className="mt-4">
          <Col>
            <h2 className="section-title">Acciones Rápidas</h2>
          </Col>
        </Row>
        <Row>
          <Col md={4} lg={3}>
            <Card className="dashboard-card">
              <Card.Body>
                <Card.Title><FontAwesomeIcon icon={faFolder} className="me-2" /> Gestión de Proyectos</Card.Title>
                <Card.Text>Administrar todos los proyectos en la plataforma.</Card.Text>
                <Button variant="primary" onClick={() => handleNavigation("/admin/listarproyectos")} className="w-100">
                  <FontAwesomeIcon icon={faProjectDiagram} className="me-2" /> Ir a Proyectos
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} lg={3}>
            <Card className="dashboard-card">
              <Card.Body>
                <Card.Title><FontAwesomeIcon icon={faUserTie} className="me-2" /> Gestión de Investigadores</Card.Title>
                <Card.Text>Administrar investigadores y su información.</Card.Text>
                <Button variant="primary" onClick={() => handleNavigation("/admin/gestionInvestigadores")} className="w-100">
                  <FontAwesomeIcon icon={faUsers} className="me-2" /> Ir a Investigadores
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} lg={3}>
            <Card className="dashboard-card">
              <Card.Body>
                <Card.Title><FontAwesomeIcon icon={faUserCog} className="me-2" /> Gestión de  Roles</Card.Title>
                <Card.Text>Administrar y actualizar los Roles del Proyecto.</Card.Text>
                <Button variant="primary" onClick={() => handleNavigation("/admin/roles")} className="w-100">
                  <FontAwesomeIcon icon={faUserCog} className="me-2" /> Ir a Roles
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} lg={3}>
            <Card className="dashboard-card">
              <Card.Body>
                <Card.Title><FontAwesomeIcon icon={faFileAlt} className="me-2" /> Auditoría</Card.Title>
                <Card.Text>Revisar el historial de actividades.</Card.Text>
                <Button variant="primary" onClick={() => handleNavigation("/admin/auditoria")} className="w-100">
                  <FontAwesomeIcon icon={faFileAlt} className="me-2" /> Ir a Auditoría
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} lg={3}>
            <Card className="dashboard-card">
              <Card.Body>
                <Card.Title><FontAwesomeIcon icon={faJournalWhills} className="me-2" /> Gestión de Logs</Card.Title>
                <Card.Text>Revisar y gestionar logs del sistema.</Card.Text>
                <Button variant="primary" onClick={() => handleNavigation("/admin/gestion-logs")} className="w-100">
                  <FontAwesomeIcon icon={faJournalWhills} className="me-2" /> Ir a Logs
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} lg={3}>
            <Card className="dashboard-card">
              <Card.Body>
                <Card.Title><FontAwesomeIcon icon={faFileContract} className="me-2" /> Publicaciones</Card.Title>
                <Card.Text>Administrar las publicaciones de los investigadores.</Card.Text>
                <Button variant="primary" onClick={() => handleNavigation("/admin/publicaciones")} className="w-100">
                  <FontAwesomeIcon icon={faFileContract} className="me-2" /> Ir a Publicaciones
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} lg={3}>
            <Card className="dashboard-card">
              <Card.Body>
                <Card.Title><FontAwesomeIcon icon={faBell} className="me-2" /> Solicitudes</Card.Title>
                <Card.Text>Solicitud para agregar investigadores a proyectos.</Card.Text>
                <Button variant="primary" onClick={() => handleNavigation("/admin/solicitudes")} className="w-100">
                  <FontAwesomeIcon icon={faBell} className="me-2" /> Ir a Solicitudes
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} lg={3}>
            <Card className="dashboard-card">
              <Card.Body>
                <Card.Title><FontAwesomeIcon icon={faChartBar} className="me-2" /> Informes</Card.Title>
                <Card.Text>Generar y revisar informes de actividades.</Card.Text>
                <Button variant="primary" onClick={() => handleNavigation("/admin/informes")} className="w-100">
                  <FontAwesomeIcon icon={faChartBar} className="me-2" /> Ir a Informes
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} lg={3}>
            <Card className="dashboard-card">
              <Card.Body>
                <Card.Title><FontAwesomeIcon icon={faCog} className="me-2" /> Configuración de Perfil</Card.Title>
                <Card.Text>Administrar y actualizar la configuración del perfil.</Card.Text>
                <Button variant="primary" onClick={() => handleNavigation("/admin/confprofile")} className="w-100">
                  <FontAwesomeIcon icon={faCog} className="me-2" /> Ir a Configuración
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} lg={3}>
            <Card className="dashboard-card">
              <Card.Body>
                <Card.Title><FontAwesomeIcon icon={faListOl} className="me-2" /> Gestión de Evaluaciones</Card.Title>
                <Card.Text>Administrar y actualizar las evaluaciones de los proyectos.</Card.Text>
                <Button variant="primary" onClick={() => handleNavigation("/admin/evaluationprojects")} className="w-100">
                  <FontAwesomeIcon icon={faListOl} className="me-2" /> Ir a Evaluaciones
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;
