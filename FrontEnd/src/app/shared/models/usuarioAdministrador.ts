export interface UsuarioAdministrador {
  id: string;
  correo: string;
  nombre: string;
  apellido: string;
  rol: string;
  estado: 'activo' | 'inactivo';
  fecha_creacion: string; 
  fecha_actualizacion: string; 
}