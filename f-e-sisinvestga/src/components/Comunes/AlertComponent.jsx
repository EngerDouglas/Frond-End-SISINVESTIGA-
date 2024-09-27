import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// Inicializamos SweetAlert2 con el adaptador para React
const MySwal = withReactContent(Swal);

const AlertComponent = {
  success: (message) => {
    MySwal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: message,
      confirmButtonColor: '#28a745',
    });
  },

  error: (message) => {
    MySwal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      confirmButtonColor: '#d33',
    });
  },

  info: (message) => {
    MySwal.fire({
      icon: 'info',
      title: 'Información',
      text: message,
      confirmButtonColor: '#3085d6',
    });
  },

  warning: (message) => {
    MySwal.fire({
      icon: 'warning',
      title: 'Advertencia',
      text: message,
      confirmButtonColor: '#f39c12',
    });
  },
};

export default AlertComponent;
