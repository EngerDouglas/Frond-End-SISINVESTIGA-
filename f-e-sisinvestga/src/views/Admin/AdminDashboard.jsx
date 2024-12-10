import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminNav from "../../components/Admin/Common/NavAdmin";
import { getData, getDataParams } from "../../services/apiServices";
import "../../css/Admin/AdminDashboard.css";
import { Container,Row, Col, Tab, Tabs, Spinner } from "react-bootstrap";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUsers, faUserCheck, faUserTimes, faProjectDiagram, faBook, faStar, faFolder, faUserTie, faUserCog, faFileAlt, faFileContract, faTasks, faBell, faChartBar, faCog, faListOl, faDesktop } from "@fortawesome/free-solid-svg-icons";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Tooltip as BSTooltip } from "react-bootstrap";
import AdmChartCard from '../../components/Admin/DashboardManagement/AdmChartCard';
import AdmEvaluationList from '../../components/Admin/DashboardManagement/AdmEvaluationList';
import AdmPendingEvaluationList from '../../components/Admin/DashboardManagement/AdmPendingEvaluationList';
import AdmQuickActionCard from '../../components/Admin/DashboardManagement/AdmQuickActionCard';
import AdmRequestList from '../../components/Admin/DashboardManagement/AdmRequestList';
import AdmStatCard from '../../components/Admin/DashboardManagement/AdmStatCard';

// Agregamos íconos a la biblioteca
ChartJS.register(ArcElement, Tooltip, Legend);

// Agregamos íconos a la biblioteca
library.add( faUsers, faUserCheck, faUserTimes, faProjectDiagram, faBook, faStar, faFolder, faUserTie, faUserCog, faFileAlt, faFileContract, faBell, faTasks, faChartBar, faCog, faListOl, faDesktop );

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: { total: 0, active: 0, inactive: 0, enabled: 0, disabled: 0 },
    projects: { total: 0, inProgress: 0, completed: 0, deleted: 0 },
    publications: { total: 0, published: 0, inReview: 0, deleted: 0 },
    evaluations: { total: 0, averageScore: 0, pendingProjects: 0 },
    requests: {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      inProcess: 0,
    },
    activeSessions: 0,
  });
  const [recentEvaluations, setRecentEvaluations] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [pendingEvaluationProjects, setPendingEvaluationProjects] = useState(
    []
  );
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const usersData = await getData("users");
      const projectsData = await getDataParams("projects", {
        includeDeleted: true,
        limit: 0,
      });
      const publicationsData = await getDataParams("publications", {
        includeDeleted: true,
        limit: 0,
      });
      const evaluationsData = await getDataParams("evaluations/all", {
        limit: 0,
      });
      const requestsData = await getDataParams("requests", { limit: 0 });

      // Estadísticas de usuarios
      const totalUsers = usersData.length;
      const activeUsers = usersData.filter(
        (user) => user.isVerified && !user.isDisabled
      ).length;
      const inactiveUsers = totalUsers - activeUsers;
      const enabledUsers = usersData.filter((user) => !user.isDisabled).length;
      const disabledUsers = usersData.filter((user) => user.isDisabled).length;

      // Sesiones activas
      const activeSessions = usersData.reduce(
        (total, user) => total + (user.sessions ? user.sessions.length : 0),
        0
      );

      // Estadísticas de evaluaciones
      const totalEvaluations = evaluationsData.evaluations.length;
      const totalScore = evaluationsData.evaluations.reduce(
        (sum, eva) => sum + eva.puntuacion,
        0
      );
      const averageScore =
        totalEvaluations > 0 ? (totalScore / totalEvaluations).toFixed(2) : 0;

      // Proyectos pendientes de evaluación
      const allProjects = projectsData.projects;
      const evaluatedProjectIds = evaluationsData.evaluations.map((eva) =>
        eva.project._id.toString()
      );
      const pendingProjects = allProjects.filter(
        (project) => !evaluatedProjectIds.includes(project._id.toString())
      );
      const pendingEvaluationCount = pendingProjects.length;

      // Estadísticas de solicitudes
      const totalRequests = requestsData.solicitudes.length;
      const pendingRequests = requestsData.solicitudes.filter(
        (req) => req.estado === "Pendiente"
      ).length;
      const approvedRequests = requestsData.solicitudes.filter(
        (req) => req.estado === "Aprobada"
      ).length;
      const rejectedRequests = requestsData.solicitudes.filter(
        (req) => req.estado === "Rechazada"
      ).length;
      const inProcessRequests = requestsData.solicitudes.filter(
        (req) => req.estado === "En Proceso"
      ).length;

      setStats({
        users: {
          total: totalUsers,
          active: activeUsers,
          inactive: inactiveUsers,
          enabled: enabledUsers,
          disabled: disabledUsers,
        },
        projects: {
          total: projectsData.total,
          inProgress: projectsData.projects.filter(
            (project) => project.estado === "En Proceso"
          ).length,
          completed: projectsData.projects.filter(
            (project) => project.estado === "Finalizado"
          ).length,
          deleted: projectsData.projects.filter((project) => project.isDeleted)
            .length,
        },
        publications: {
          total: publicationsData.total,
          published: publicationsData.publications.filter(
            (pub) => pub.estado === "Publicado"
          ).length,
          inReview: publicationsData.publications.filter(
            (pub) => pub.estado === "Revisado"
          ).length,
          deleted: publicationsData.publications.filter((pub) => pub.isDeleted)
            .length,
        },
        evaluations: {
          total: totalEvaluations,
          averageScore: averageScore,
          pendingProjects: pendingEvaluationCount,
        },
        requests: {
          total: totalRequests,
          pending: pendingRequests,
          approved: approvedRequests,
          rejected: rejectedRequests,
          inProcess: inProcessRequests,
        },
        activeSessions: activeSessions,
      });

      setPendingEvaluationProjects(pendingProjects.slice(0, 5)); // Mostrar los primeros 5

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
    [stats.users.active, stats.users.inactive, stats.users.disabled],
    ["Active", "Inactive", "Disabled"],
    ["#36A2EB", "#FFCE56", "#FF6384"]
  );

  const projectChartData = createChartData(
    [
      stats.projects.inProgress,
      stats.projects.completed,
      stats.projects.deleted,
    ],
    ["In Progress", "Completed", "Deleted"],
    ["#FFCE56", "#4BC0C0", "#FF6384"]
  );

  const publicationChartData = createChartData(
    [
      stats.publications.published,
      stats.publications.inReview,
      stats.publications.deleted,
    ],
    ["Published", "Reviewed", "Deleted"],
    ["#4BC0C0", "#FFCE56", "#FF6384"]
  );

  const requestsChartData = createChartData(
    [
      stats.requests.pending,
      stats.requests.approved,
      stats.requests.rejected,
      stats.requests.inProcess,
    ],
    ["Pending", "Approved", "Rejected", "In Process"],
    ["#FFCE56", "#4BC0C0", "#FF6384", "#36A2EB"]
  );

  const renderTooltip = (content) => (
    <BSTooltip id="button-tooltip">{content}</BSTooltip>
  );

  // Datos para las acciones rápidas
  const quickActions = [
    {
      title: "Project Management",
      description: "Manage all projects on the platform.",
      icon: faFolder,
      buttonText: "Go to Projects",
      path: "/admin/listarproyectos",
    },
    {
      title: "Researcher Management",
      description: "Manage researchers and their information.",
      icon: faUserTie,
      buttonText: "Go to Researchers",
      path: "/admin/gestionInvestigadores",
    },
    {
      title: "Role Management",
      description: "Manage and update project roles.",
      icon: faUserCog,
      buttonText: "Go to Roles",
      path: "/admin/roles",
    },
    {
      title: "Auditing",
      description: "Review the activity history.",
      icon: faFileAlt,
      buttonText: "Go to Audit",
      path: "/admin/auditoria",
    },
    {
      title: "Publications",
      description: "Manage researchers' publications.",
      icon: faFileContract,
      buttonText: "Go to Publications",
      path: "/admin/publicaciones",
    },
    {
      title: "Requests",
      description: "Requests to add researchers to projects.",
      icon: faTasks,
      buttonText: "Go to Requests",
      path: "/admin/solicitudes",
    },
    {
      title: "Reports",
      description: "Generate and review activity reports.",
      icon: faChartBar,
      buttonText: "Go to Reports",
      path: "/admin/informes",
    },
    {
      title: "Profile Settings",
      description: "Manage and update profile settings.",
      icon: faCog,
      buttonText: "Go to Settings",
      path: "/admin/confprofile",
    },
    {
      title: "Evaluation Management",
      description: "Manage and update project evaluations.",
      icon: faListOl,
      buttonText: "Go to Evaluations",
      path: "/admin/evaluationprojects",
    },
    {
      title: "Notification Center",
      description: "Manage and update system notifications.",
      icon: faBell,
      buttonText: "Go to Notifications",
      path: "/admin/notificaciones",
    },
  ];

  return (
    <div className="admin-dashboard">
      <AdminNav />
      <Container fluid className="py-4">
        <h1 className="dashboard-title mb-4">Administration Panel</h1>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <>
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="mb-4"
            >
              <Tab eventKey="overview" title="Overview">
                <Row>
                  <Col md={4} lg={3}>
                    <AdmStatCard
                      title="Total Users"
                      icon={faUsers}
                      value={stats.users.total}
                      color="#36A2EB"
                    />
                    <AdmStatCard
                      title="Active Users"
                      icon={faUserCheck}
                      value={stats.users.active}
                      color="#36A2EB"
                    />
                  </Col>
                  <Col md={4} lg={3}>
                    <AdmStatCard
                      title="Active Projects"
                      icon={faProjectDiagram}
                      value={stats.projects.inProgress}
                      color="#FFCE56"
                    />
                    <AdmStatCard
                      title="Inactive Users"
                      icon={faUserTimes}
                      value={stats.users.inactive}
                      color="#FFCE56"
                    />
                  </Col>
                  <Col md={4} lg={3}>
                    <AdmStatCard
                      title="Publications"
                      icon={faBook}
                      value={stats.publications.total}
                      color="#4BC0C0"
                    />
                    <AdmStatCard
                      title="Active Sessions"
                      icon={faDesktop}
                      value={stats.activeSessions}
                      color="#8A2BE2"
                    />
                  </Col>
                  <Col md={4} lg={3}>
                    <AdmStatCard
                      title="Evaluations"
                      icon={faStar}
                      value={stats.evaluations.total}
                      color="#FF6384"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col md={6} lg={3}>
                    <AdmChartCard
                      title="User Distribution"
                      data={userChartData}
                    />
                  </Col>
                  <Col md={6} lg={3}>
                    <AdmChartCard
                      title="Project Status"
                      data={projectChartData}
                    />
                  </Col>
                  <Col md={6} lg={3}>
                    <AdmChartCard
                      title="Publicaciones"
                      data={publicationChartData}
                    />
                  </Col>
                  <Col md={6} lg={3}>
                    <AdmChartCard
                      title="Publications"
                      data={requestsChartData}
                    />
                  </Col>
                </Row>
              </Tab>
              <Tab eventKey="evaluations" title="Recent Evaluations">
                <AdmEvaluationList
                  evaluations={recentEvaluations}
                  handleNavigation={handleNavigation}
                  renderTooltip={renderTooltip}
                />
              </Tab>
              <Tab
                eventKey="pendingEvaluations"
                title="Pending Evaluation Projects"
              >
                <AdmPendingEvaluationList projects={pendingEvaluationProjects} />
              </Tab>
              <Tab eventKey="requests" title="Recent Requests">
                <AdmRequestList
                  requests={recentRequests}
                  handleNavigation={handleNavigation}
                  renderTooltip={renderTooltip}
                />
              </Tab>
            </Tabs>
          </>
        )}

        <Row className="mt-4">
          <Col>
            <h2 className="section-title">Quick Actions</h2>
          </Col>
        </Row>
        <Row>
          {quickActions.map((action, index) => (
            <Col md={4} lg={3} key={index}>
              <AdmQuickActionCard {...action} handleNavigation={handleNavigation} />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;