import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Table,
  Pagination,
  Card,
} from "react-bootstrap";
import { getDataParams } from "../../../services/apiServices";
import AlertComponent from "../../Common/AlertComponent";
import "../../../css/Admin/AdmSeeAudits.css";

const AdmSeeAudits = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    user: "",
    activity: "",
    method: "",
    startDate: "",
    endDate: "",
  });

  const [stats, setStats] = useState({
    totalLogs: 0,
    uniqueUsers: 0,
    mostCommonActivity: "",
  });

  const fetchAuditLogs = useCallback(async () => {
    try {
      const response = await getDataParams('audits', {
        ...filters,
        page: currentPage,
        limit: 10,
      });
      setAuditLogs(response.logs);
      setTotalPages(response.totalPages);
      updateStats(response);
    } catch (error) {
      AlertComponent.error('Error al cargar los registros de auditoría');
      console.error(error);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const updateStats = (data) => {
    const uniqueUsers = new Set(data.logs.map((log) => log.user)).size;
    const activityCount = data.logs.reduce((acc, log) => {
      acc[log.activity] = (acc[log.activity] || 0) + 1;
      return acc;
    }, {});
    const mostCommonActivity =
      Object.entries(activityCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "";

    setStats({
      totalLogs: data.total,
      uniqueUsers,
      mostCommonActivity,
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <Container className="mt-4">
        <h1 className="text-center mb-4">Registros de Auditoría</h1>

        <Row className="mb-4">
          <Col md={4}>
            <Card className="stats-card">
              <Card.Body>
                <Card.Title>Total de Registros</Card.Title>
                <Card.Text>{stats.totalLogs}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="stats-card">
              <Card.Body>
                <Card.Title>Usuarios Únicos</Card.Title>
                <Card.Text>{stats.uniqueUsers}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="stats-card">
              <Card.Body>
                <Card.Title>Actividad Más Común</Card.Title>
                <Card.Text>{stats.mostCommonActivity}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Form className="mb-4">
          <Row>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Usuario</Form.Label>
                <Form.Control
                  type="text"
                  name="user"
                  value={filters.user}
                  onChange={handleFilterChange}
                  placeholder="Filtrar por usuario"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Actividad</Form.Label>
                <Form.Control
                  type="text"
                  name="activity"
                  value={filters.activity}
                  onChange={handleFilterChange}
                  placeholder="Filtrar por actividad"
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>Método</Form.Label>
                <Form.Control
                  as="select"
                  name="method"
                  value={filters.method}
                  onChange={handleFilterChange}
                >
                  <option value="">Todos</option>
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>Fecha Inicio</Form.Label>
                <Form.Control
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>Fecha Fin</Form.Label>
                <Form.Control
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>

        <Table striped bordered hover responsive className="audit-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Método</th>
              <th>URL</th>
              <th>Actividad</th>
              <th>IP</th>
              <th>Ubicación</th>
              <th>Dispositivo</th>
              <th>Fecha y Hora</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log) => (
              <tr key={log._id}>
                <td>
                  {log.user ? `${log.user.nombre} ${log.user.apellido}` : 'Usuario Desconocido'}
                </td>
                <td>
                  {log.user && log.user.role ? log.user.role.roleName : 'N/A'}
                </td>
                <td>{log.method}</td>
                <td>{log.url}</td>
                <td>{log.activity}</td>
                <td>{log.ipAddress}</td>
                <td>{log.location}</td>
                <td>{log.device}</td>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Pagination className="justify-content-center">
          {[...Array(totalPages).keys()].map((number) => (
            <Pagination.Item
              key={number + 1}
              active={number + 1 === currentPage}
              onClick={() => handlePageChange(number + 1)}
            >
              {number + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </Container>
    </>
  );
};

export default AdmSeeAudits;
