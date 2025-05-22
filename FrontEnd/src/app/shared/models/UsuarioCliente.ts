export interface UsuarioCliente {
  id_usuario: string;
  correo: string;
  nombre: string;
  apellido: string;
  id_vehiculo: string | null; // Puede ser null si el cliente no tiene vehículo
  marca: string | null;
  modelo: string | null;
}