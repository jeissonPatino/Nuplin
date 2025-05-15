export interface Subscriber {
    id: number;
    subscriberId: number;
    partnerId: string;
    nombre: string;
    email: string;
    estado: string;
    paquete: string;
    fechaInicio: string;
    fechaFin: string | null;
    ultimaActualizacion: string;
  }