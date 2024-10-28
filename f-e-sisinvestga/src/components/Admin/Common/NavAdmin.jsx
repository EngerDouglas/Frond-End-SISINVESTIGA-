import React, { useState, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentRole, logoutUser } from "../../../features/auth/authSlice";
import { postData, putData, deleteData } from "../../../services/apiServices";
import { useNotifications } from "../../../Context/NotificationsProvider";
import "../../../css/Admin/NavAdmin.css";
import logo from '../../../assets/img/LogoWebUCSD.png';
import { 
  FaHome, 
  FaFolder, 
  FaUsers, 
  FaUserCog, 
  FaFileAlt, 
  FaBook, 
  FaTasks,
  FaBell, 
  FaChartBar, 
  FaCog,
  FaClipboardList,
  FaSignOutAlt,
  FaArrowLeft,
  FaBars,
  FaCheck,
  FaTrash
} from 'react-icons/fa';
import { Tooltip, OverlayTrigger, Dropdown, Button } from 'react-bootstrap';

const AdminNav = () => {
  const role = useSelector(selectCurrentRole);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { notifications, unreadCount, fetchNotifications, removeNotification } = useNotifications();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("Ocurrió un error durante el proceso de cierre de sesión.");
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await putData(`notifications/${id}`, 'read');
      await fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await postData("notifications/readall");
      await fetchNotifications();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const handleDeleteNotification = useCallback(async (id, e) => {
    e.stopPropagation();
    try {
      await deleteData('notifications', id);
      removeNotification(id);
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  }, [removeNotification]);

  const menuItems = [
    { path: "/admin", icon: <FaHome />, text: "Panel de Administración" },
    { path: "/admin/listarproyectos", icon: <FaFolder />, text: "Gestión de Proyectos" },
    { path: "/admin/gestionInvestigadores", icon: <FaUsers />, text: "Gestión de Investigadores" },
    { path: "/admin/roles", icon: <FaUserCog />, text: "Gestión de Roles" },
    { path: "/admin/auditoria", icon: <FaFileAlt />, text: "Auditoría" },
    { path: "/admin/gestion-logs", icon: <FaClipboardList />, text: "Gestión de Logs" },
    { path: "/admin/publicaciones", icon: <FaBook />, text: "Publicaciones" },
    { path: "/admin/solicitudes", icon: <FaTasks />, text: "Solicitudes" },
    { path: "/admin/informes", icon: <FaChartBar />, text: "Informes" },
    { path: "/admin/confprofile", icon: <FaCog />, text: "Configuración de Perfil" },
    { path: "/admin/evaluationprojects", icon: <FaClipboardList />, text: "Gestión de Evaluaciones" },
  ];

  const renderTooltip = (props, text) => (
    <Tooltip id={`tooltip-${text.replace(/\s+/g, '-').toLowerCase()}`} {...props}>
      {text}
    </Tooltip>
  );

  return (
    <nav className="navbar navbar-expand-lg navbar-admin">
      <div className="container-fluid">
        <Link to="/admin" className="navbar-brand">
          <img src={logo} alt="UCSD Logo" className="nav-logo" />
        </Link>
        <button className="navbar-toggler" type="button" onClick={toggleMenu} aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <FaBars />
        </button>
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {role === "Administrador" && menuItems.map((item, index) => (
              <li className="nav-item" key={index}>
                <OverlayTrigger
                  placement="bottom"
                  delay={{ show: 250, hide: 400 }}
                  overlay={(props) => renderTooltip(props, item.text)}
                >
                  <Link 
                    to={item.path} 
                    className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon}
                    <span className="d-lg-none ms-2">{item.text}</span>
                  </Link>
                </OverlayTrigger>
              </li>
            ))}
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item">
              <Dropdown>
                <Dropdown.Toggle as="a" className="nav-link" id="dropdown-notifications">
                  <FaBell />
                  {unreadCount > 0 && <span className="badge bg-danger">{unreadCount}</span>}
                </Dropdown.Toggle>
                <Dropdown.Menu align="end" className="notifications-dropdown">
                  <Dropdown.Header>Notificaciones</Dropdown.Header>
                  <div className="notifications-scroll">
                    {notifications.length === 0 ? (
                      <Dropdown.Item>No hay notificaciones</Dropdown.Item>
                    ) : (
                      notifications.map((notification) => (
                        <div key={notification._id} className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}>
                          <div className="notification-header">
                            <span className="notification-type">{notification.type}</span>
                            <Button 
                              variant="link"
                              size="sm"
                              className="delete-notification"
                              onClick={(e) => handleDeleteNotification(notification._id, e)}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                          <div className="notification-content">
                            {notification.message}
                          </div>
                          {!notification.isRead && (
                            <div className="notification-actions">
                              <Button 
                                variant="outline-success" 
                                size="sm" 
                                onClick={(e) => handleMarkAsRead(notification._id, e)}
                              >
                                <FaCheck /> Marcar como leída
                              </Button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                  <Dropdown.Divider />
                  <div className="notification-footer">
                    <Button variant="outline-primary" size="sm" onClick={handleMarkAllAsRead}>
                      Marcar todas como leídas
                    </Button>
                  </div>
                </Dropdown.Menu>
              </Dropdown>
            </li>
            <li className="nav-item">
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={(props) => renderTooltip(props, "Cerrar Sesión")}
              >
                <button onClick={handleLogout} className="nav-link btn btn-link">
                  <FaSignOutAlt />
                  <span className="d-lg-none ms-2">Cerrar Sesión</span>
                </button>
              </OverlayTrigger>
            </li>
            <li className="nav-item">
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={(props) => renderTooltip(props, "Atrás")}
              >
                <button onClick={goBack} className="nav-link btn btn-link">
                  <FaArrowLeft />
                  <span className="d-lg-none ms-2">Atrás</span>
                </button>
              </OverlayTrigger>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AdminNav;
