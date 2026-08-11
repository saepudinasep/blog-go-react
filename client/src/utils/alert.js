import Swal from 'sweetalert2';

export const showSuccess = (title, text = '') => {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonText: 'OK',
  });
};

export const showError = (title, text = '') => {
  return Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonText: 'OK',
  });
};

export const showWarning = (title, text = '') => {
  return Swal.fire({
    icon: 'warning',
    title,
    text,
    confirmButtonText: 'OK',
  });
};

export const showInfo = (title, text = '') => {
  return Swal.fire({
    icon: 'info',
    title,
    text,
    confirmButtonText: 'OK',
  });
};

export const showConfirm = async (title, text = '', confirmText = 'Yes') => {
  return Swal.fire({
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancel',
    reverseButtons: true,
  });
};
