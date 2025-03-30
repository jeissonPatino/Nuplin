import { Component} from '@angular/core';
import * as prismCodeData from '../../../shared/prismData/basictables';
import { SpkReusableTablesComponent } from '../../../../@spk/spk-reusable-tables/spk-reusable-tables.component';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { SpkFlatpickrComponent } from '../../../../@spk/spk-flatpickr/spk-flatpickr.component';
import { ModalUsuariosComponent } from '../../../shared/components/modals/modal-usuarios/modal-usuarios.component';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../shared/models/usuario';
import { ToastrService } from 'ngx-toastr';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-consulta-usuarios',
  imports: [SharedModule,SpkReusableTablesComponent,FormsModule, FlatpickrModule, SpkFlatpickrComponent, ModalUsuariosComponent, CommonModule],
  templateUrl: './consulta-usuarios.component.html',
  styleUrl: './consulta-usuarios.component.scss'
})
export class ConsultaUsuariosComponent {
  prismCode = prismCodeData;
  selectedDates: string = ''; 
  showModal: boolean = false;
  isEditing: boolean = false;
  selectedUser: any = {};
  paginatedData: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 20;
  totalPagesArray: number[] = [];
  fechaInicio : string = '';
  fechaFin  : string = '';
  datosTablaUsuario: Usuario [] = [];
  datosExportarUsuario: Usuario [] = [];
  isPopoverOpen: boolean = false;

//Estuctura de la tabla
responsiveColumn=[
  {header:"Seleccione",field:"Seleccione"},
  {header:"Nombre completo",field:"Nombre completo"},         
  {header:"Email",field:"Email"},
  {header:"Paquete",field:"Paquete"},
  {header:"Fecha activación",field:"Fecha activación"},
  {header:"Activo hasta (paquete)",field:"Activo hasta (paquete)"},
  {header:"Acciones",field:"Acciones"}  
]

constructor(
  private toastr: ToastrService ,
){ }
//
responsiveTables=[
  { id: 11, name: "Santiago Romero", mail: "Santiromero24@gmail.com", pack: "Usuario sin servicios", dateActivation: "2024-06-22", periody: "vencido", bg: "danger" },
  { id: 12, name: "William hedulver santa Dias Carrera 3-A #6-57 anapoima centro", mail: "hedulverdiaz14@gmail.com", pack: "Paquete básico & Paquete Adultos", dateActivation: "2025-02-24", periody: "Indefinido", bg: "success" },
  { id: 13, name: "Facturacion Azimuth", mail: "facturacion@lazimuth-internet.com", pack: "Paquete básico & Paquete Adultos", dateActivation: "2024-05-09", periody: "Indefinido", bg: "success" },
  { id: 14, name: "César Garcia", mail: "armandagarpa23@gmail.com", pack: "Paquete Básico & Win +", dateActivation: "2025-03-03", periody: "Indefinido", bg: "success" },
  { id: 15, name: "JOSE GABRIEL AYALA VIDAL CARILLO", mail: "carrillavidaln@gmail.com", pack: "Paquete básico & Paquete Adultos", dateActivation: "2024-06-21", periody: "Indefinido", bg: "success" },
  { id: 16, name: "Juan García", mail: "juangarcía72@gmail.com", pack: "Paquete Básico & Win +", dateActivation: "2024-03-12", periody: "Indefinido", bg: "success" },
  { id: 17, name: "María Rodríguez", mail: "mariarodríguez38@gmail.com", pack: "Paquete básico & Paquete Adultos", dateActivation: "2023-01-20", periody: "Indefinido", bg: "success" },
  { id: 18, name: "Carlos González", mail: "carlosgonzález85@gmail.com", pack: "Usuario sin servicios", dateActivation: "2024-05-27", periody: "vencido", bg: "danger" },
  { id: 19, name: "Laura López", mail: "lauralópez15@gmail.com", pack: "Paquete Básico & Win +", dateActivation: "2023-11-08", periody: "Indefinido", bg: "success" },
  { id: 20, name: "Pedro Martínez", mail: "pedromartínez53@gmail.com", pack: "Paquete básico", dateActivation: "2025-07-01", periody: "Indefinido", bg: "success" },
  { id: 21, name: "Sofía Sánchez", mail: "sofíasánchez69@gmail.com", pack: "Paquete Básico & Win +", dateActivation: "2023-08-16", periody: "vencido", bg: "danger" },
  { id: 22, name: "Luis Pérez", mail: "luispérez22@gmail.com", pack: "Paquete básico & Paquete Adultos", dateActivation: "2024-11-23", periody: "Indefinido", bg: "success" },
  { id: 23, name: "Ana Ramírez", mail: "anaramírez94@gmail.com", pack: "Paquete Básico & Win +", dateActivation: "2023-02-05", periody: "Indefinido", bg: "success" },
  { id: 24, name: "Diego Torres", mail: "diegotorres47@gmail.com", pack: "Paquete básico", dateActivation: "2025-09-18", periody: "vencido", bg: "danger" },
  { id: 25, name: "Isabel Díaz", mail: "isabeldíaz31@gmail.com", pack: "Paquete básico", dateActivation: "2023-06-29", periody: "Indefinido", bg: "success" },
  { id: 26, name: "Andrés Hernández", mail: "andréshernández78@gmail.com", pack: "Paquete Básico & Win +", dateActivation: "2024-10-04", periody: "vencido", bg: "danger" },
  { id: 27, name: "Valentina Castro", mail: "valentinacastro60@gmail.com", pack: "Paquete básico & Paquete Adultos", dateActivation: "2025-01-26", periody: "Indefinido", bg: "success" },
  { id: 28, name: "Sebastián Jiménez", mail: "sebastiánjiménez27@gmail.com", pack: "Paquete Básico & Win +", dateActivation: "2023-03-02", periody: "vencido", bg: "danger" },
  { id: 29, name: "Camila Moreno", mail: "camilamoreno91@gmail.com", pack: "Paquete básico", dateActivation: "2024-08-09", periody: "Indefinido", bg: "success" },
  { id: 30, name: "Mateo Romero", mail: "mateoromero44@gmail.com", pack: "Usuario sin servicios", dateActivation: "2025-06-17", periody: "vencido", bg: "danger" },
  { id: 31, name: "Daniela Ruiz", mail: "danielaruiz19@gmail.com", pack: "Paquete básico & Paquete Adultos", dateActivation: "2023-09-30", periody: "Indefinido", bg: "success" },
  { id: 32, name: "Alejandro Vargas", mail: "alejandrovargas63@gmail.com", pack: "Paquete Básico & Win +", dateActivation: "2024-02-14", periody: "vencido", bg: "danger" },
  { id: 33, name: "Valeria Silva", mail: "valeriasilva88@gmail.com", pack: "Paquete básico", dateActivation: "2025-11-21", periody: "Indefinido", bg: "success" },
  { id: 34, name: "Nicolás Rojas", mail: "nicolásrojas25@gmail.com", pack: "Paquete básico", dateActivation: "2023-07-07", periody: "vencido", bg: "danger" },
  { id: 26, name: "Mariana Herrera", mail: "marianaherrera51@gmail.com", pack: "Paquete básico & Paquete Adultos", dateActivation: "2024-12-03", periody: "Indefinido", bg: "success" },
  { id: 27, name: "Santiago Fernández", mail: "santiagofernández74@gmail.com", pack: "Paquete Básico & Win +", dateActivation: "2023-04-18", periody: "vencido", bg: "danger" },
  { id: 28, name: "Luciana Álvarez", mail: "lucianaálvarez97@gmail.com", pack: "Paquete Básico & Win +", dateActivation: "2025-08-25", periody: "Indefinido", bg: "success" },
  { id: 29, name: "Gabriel Gómez", mail: "gabrielgómez34@gmail.com", pack: "Paquete básico", dateActivation: "2023-10-10", periody: "vencido", bg: "danger" },
  { id: 30, name: "Renata Mendoza", mail: "renatamendoza66@gmail.com", pack: "Usuario sin servicios", dateActivation: "2024-01-03", periody: "Indefinido", bg: "success" },
  { id: 31, name: "Martín Morales", mail: "martínmorales29@gmail.com", pack: "Paquete básico & Paquete Adultos", dateActivation: "2025-05-13", periody: "vencido", bg: "danger" },
  { id: 32, name: "Ximena Ortega", mail: "ximenaortega58@gmail.com", pack: "Paquete Básico & Paquete Adultos", dateActivation: "2024-09-02", periody: "vencido", bg: "danger" },
  { id: 33, name: "Samuel Gutiérrez", mail: "samuelgutiérrez82@gmail.com", pack: "Usuario sin servicios", dateActivation: "2025-04-11", periody: "Indefinido", bg: "success" },
  { id: 34, name: "Victoria Castillo", mail: "victoriacastillo12@gmail.com", pack: "Paquete Básico", dateActivation: "2023-12-28", periody: "vencido", bg: "danger" },
  { id: 35, name: "Tomás Vega", mail: "tomásvega41@gmail.com", pack: "Paquete Básico & Win + +", dateActivation: "2024-07-20", periody: "Indefinido", bg: "success" },
  { id: 36, name: "Emilia Medina", mail: "emiliamedina67@gmail.com", pack: "Paquete Básico & Paquete Adultos", dateActivation: "2023-05-03", periody: "vencido", bg: "danger" },
  { id: 37, name: "Joaquín Aguilar", mail: "joaquínaguilar93@gmail.com", pack: "Paquete Básico & Win +", dateActivation: "2025-01-15", periody: "Indefinido", bg: "success" },
  { id: 38, name: "Antonia Navarro", mail: "antonianavarro28@gmail.com", pack: "Paquete Básico", dateActivation: "2024-11-29", periody: "vencido", bg: "danger" },
  { id: 39, name: "Benjamín Guerrero", mail: "benjamínguerrero55@gmail.com", pack: "Paquete Básico & Win + +", dateActivation: "2023-08-07", periody: "Indefinido", bg: "success" },
  { id: 40, name: "Josefa Flores", mail: "josefaflores71@gmail.com", pack: "Usuario sin servicios", dateActivation: "2025-06-22", periody: "vencido", bg: "danger" },
  { id: 41, name: "Cristóbal Ramos", mail: "cristóbalramos36@gmail.com", pack: "Paquete Básico & Paquete Adultos", dateActivation: "2024-02-18", periody: "Indefinido", bg: "success" },
  { id: 42, name: "Amanda Cabrera", mail: "amandacabrera89@gmail.com", pack: "Paquete Básico & Win +", dateActivation: "2023-10-31", periody: "vencido", bg: "danger" },
  { id: 43, name: "Maximiliano Delgado", mail: "maxilianodelgado21@gmail.com", pack: "Paquete Básico", dateActivation: "2025-09-08", periody: "Indefinido", bg: "success" },
  { id: 44, name: "Agustina Núñez", mail: "agustinanúñez49@gmail.com", pack: "Paquete Básico & Win + +", dateActivation: "2024-04-26", periody: "vencido", bg: "danger" },
  { id: 45, name: "Vicente Reyes", mail: "vicentereyes77@gmail.com", pack: "Usuario sin servicios", dateActivation: "2023-01-09", periody: "Indefinido", bg: "success" },
  { id: 46, name: "Florencia Fuentes", mail: "florenciafuentes61@gmail.com", pack: "Paquete Básico & Paquete Adultos", dateActivation: "2025-11-17", periody: "vencido", bg: "danger" },
  { id: 47, name: "José Pérez", mail: "joseperez18@gmail.com", pack: "Paquete Básico & Win + +", dateActivation: "2024-06-03", periody: "Indefinido", bg: "success" },
  { id: 48, name: "David Ruiz", mail: "davidruiz33@gmail.com", pack: "Paquete Básico", dateActivation: "2023-03-22", periody: "vencido", bg: "danger" },
  { id: 49, name: "Ana Rodríguez", mail: "anarodriguez46@gmail.com", pack: "Paquete Básico & Paquete Adultos", dateActivation: "2025-08-30", periody: "Indefinido", bg: "success" },
  { id: 50, name: "Diego González", mail: "diegogonzalez69@gmail.com", pack: "Usuario sin servicios", dateActivation: "2024-08-01", periody: "vencido", bg: "danger" },
  { id: 51, name: "Isabel López", mail: "isabellopez95@gmail.com", pack: "Paquete Básico & Win +", dateActivation: "2023-05-18", periody: "Indefinido", bg: "success" },
  { id: 52, name: "Sergio Castillo", mail: "sergiocastillo73@gmail.com", pack: "Paquete Básico", dateActivation: "2024-03-15", periody: "Indefinido", bg: "success" },
  { id: 53, name: "Lorena Vega", mail: "lorenavega88@gmail.com", pack: "Paquete Oro", dateActivation: "2023-01-28", periody: "vencido", bg: "danger" },
  { id: 54, name: "Rafael Medina", mail: "rafaelmedina22@gmail.com", pack: "Paquete Premium", dateActivation: "2025-05-02", periody: "Indefinido", bg: "success" },
  { id: 55, name: "Carolina Aguilar", mail: "carolinaaguilar56@gmail.com", pack: "Usuario sin servicios", dateActivation: "2024-07-29", periody: "vencido", bg: "danger" },
  { id: 56, name: "Fernando Navarro", mail: "fernandonavarro91@gmail.com", pack: "Paquete básico & Win", dateActivation: "2023-11-12", periody: "Indefinido", bg: "success" },
  { id: 57, name: "Patricia Guerrero", mail: "patriciaguerrero39@gmail.com", pack: "Paquete Básico", dateActivation: "2025-09-24", periody: "vencido", bg: "danger" },
  { id: 58, name: "Héctor Flores", mail: "héctorflores17@gmail.com", pack: "Paquete Oro", dateActivation: "2024-04-05", periody: "Indefinido", bg: "success" },
  { id: 59, name: "Cecilia Ramos", mail: "ceciliaramos64@gmail.com", pack: "Paquete Premium", dateActivation: "2023-02-19", periody: "vencido", bg: "danger" },
  { id: 60, name: "Ricardo Cabrera", mail: "ricardocabrera83@gmail.com", pack: "Paquete básico & Win", dateActivation: "2025-01-11", periody: "Indefinido", bg: "success" },
  { id: 61, name: "Mónica Delgado", mail: "mónicadelgado28@gmail.com", pack: "Usuario sin servicios", dateActivation: "2024-10-27", periody: "vencido", bg: "danger" },
  { id: 62, name: "Eduardo Núñez", mail: "eduardonúñez51@gmail.com", pack: "Paquete Básico", dateActivation: "2023-07-08", periody: "Indefinido", bg: "success" },
  { id: 63, name: "Silvia Reyes", mail: "silviareyes97@gmail.com", pack: "Paquete Oro", dateActivation: "2025-06-19", periody: "vencido", bg: "danger" },
  { id: 64, name: "Gustavo Fuentes", mail: "gustavofuentes35@gmail.com", pack: "Paquete Premium", dateActivation: "2024-01-21", periody: "Indefinido", bg: "success" },
  { id: 65, name: "Clara Pérez", mail: "claraperez79@gmail.com", pack: "Paquete básico & Win", dateActivation: "2023-04-14", periody: "vencido", bg: "danger" },
  { id: 66, name: "Roberto Ruiz", mail: "robertoruiz62@gmail.com", pack: "Usuario sin servicios", dateActivation: "2025-11-28", periody: "Indefinido", bg: "success" },
  { id: 67, name: "Teresa Rodríguez", mail: "teresarodriguez47@gmail.com", pack: "Paquete Básico", dateActivation: "2024-09-03", periody: "vencido", bg: "danger" },
  { id: 68, name: "Ignacio González", mail: "ignaciogonzalez13@gmail.com", pack: "Paquete Oro", dateActivation: "2023-05-23", periody: "Indefinido", bg: "success" },
  { id: 69, name: "Sara López", mail: "saralopez85@gmail.com", pack: "Paquete Premium", dateActivation: "2025-02-16", periody: "vencido", bg: "danger" },
  { id: 70, name: "Felipe Martínez", mail: "felipemartinez29@gmail.com", pack: "Paquete básico & Win", dateActivation: "2024-12-05", periody: "Indefinido", bg: "success" },
  { id: 71, name: "Valentina Sánchez", mail: "valentinasanchez94@gmail.com", pack: "Usuario sin servicios", dateActivation: "2023-09-30", periody: "vencido", bg: "danger" }
]

ngOnInit() {
  this.calculateDate();
  this.datosTablaUsuario = this.responsiveTables.filter(usuario => {
    const activationDate = new Date(usuario.dateActivation);
    return activationDate >= new Date(this.fechaInicio)! && activationDate <= new Date(this.fechaFin)!;
  });
  this.updatePaginatedData();
}

calculateDate(){
  const formatDate = (date: Date): string => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };
  this.fechaFin = formatDate(new Date());
  const fechaInicioDate = new Date();
  fechaInicioDate.setDate(fechaInicioDate.getDate() - 30);
  this.fechaInicio = formatDate(fechaInicioDate);
}

updatePaginatedData() {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;
  this.paginatedData = this.datosTablaUsuario.slice(start, end);
  this.totalPagesArray = Array.from({ length: this.totalPages() }, (_, i) => i + 1);
}

changePage(page: number) {
  if (page < 1 || page > this.totalPages()) return;
  this.currentPage = page;
  this.updatePaginatedData();
}

totalPages(): number {
  return Math.ceil(this.datosTablaUsuario.length / this.itemsPerPage);
}

get displayedRecords(): number {
  return Math.min(this.currentPage * this.itemsPerPage, this.datosTablaUsuario.length);
}

openCreateModal() {
  const newUser = { id: 0 ,name: '', mail: '', pack: '', dateActivation: '', periody: '', bg: '' };
  this.responsiveTables.push(newUser);  
  this.isEditing = false;
  this.showModal = true;
}

openEditModal(usuario: any) {
  this.selectedUser  = { ...usuario };  // Carga los datos del usuario
  this.isEditing = true;
  this.showModal = true;
}

closeModal() {
  this.showModal = false;
}

handleSave(data: any) {
  if (this.isEditing) {
    this.responsiveTables = this.responsiveTables.map(u => u.name === data.id ? data : u);
    console.log('Usuario editado:', data);
  } else {
    const newUser = { ...data, id: this.responsiveTables.length + 1 };
    this.responsiveTables.push(newUser);
    console.log('Nuevo usuario creado:', newUser);
  }

  this.closeModal();
}

togglePopover() {
  this.isPopoverOpen = !this.isPopoverOpen;
}

onDateChange(event: string) {
  this.selectedDates = event;
  const fechas = this.selectedDates.split(" to ");
  this.fechaInicio = fechas[0];
  this.fechaFin = fechas[1];
}

searchByDate() {
  if(this.fechaInicio == undefined || this.fechaFin == undefined){
    this.toastr.error('Por favor, selecciona un rango de fechas.', 'Error', {
      timeOut: 3000,
      positionClass: 'toast-top-center'
    });
    return
  }else{
      this.datosTablaUsuario = this.responsiveTables.filter(usuario => {
      const activationDate = new Date(usuario.dateActivation);
      return activationDate >= new Date(this.fechaInicio)! && activationDate <= new Date(this.fechaFin)!;
    });
    this.paginatedData = this.datosTablaUsuario;
    this.datosExportarUsuario = [...this.datosTablaUsuario];
  }
}

updateExportData() {
  if (this.datosExportarUsuario.length === 0) {
     this.toastr.info('No hay datos para exportar.', 'Información', {
      timeOut: 3000,
      positionClass: 'toast-top-center'
    });
    return;  
  }
  this.exportToExcel();
}

exportToExcel() {
  if (!this.datosExportarUsuario || this.datosExportarUsuario.length === 0) {
      this.toastr.warning('No hay datos para exportar a Excel.', 'Advertencia',{
          timeOut: 3000,
          positionClass: 'toast-top-center'
      });
      return;
  }
  const workSheet = XLSX.utils.json_to_sheet(this.datosExportarUsuario);
  const workBook: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workBook, workSheet, 'Usuarios');
  const excelBuffer: any = XLSX.write(workBook, { bookType: 'xlsx', type: 'array' });
  this.saveAsExcelFile(excelBuffer, 'usuarios');
}

private saveAsExcelFile(buffer: any, fileName: string): void {
  const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
  FileSaver.saveAs(data, fileName + '.xlsx');
}


}
