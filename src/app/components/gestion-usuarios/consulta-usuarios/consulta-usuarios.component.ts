import { Component } from '@angular/core';
import * as prismCodeData from '../../../shared/prismData/basictables';
import { SpkReusableTablesComponent } from '../../../../@spk/spk-reusable-tables/spk-reusable-tables.component';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { SpkFlatpickrComponent } from '../../../../@spk/spk-flatpickr/spk-flatpickr.component';
import { ModalUsuariosComponent } from '../../../shared/components/modals/modal-usuarios/modal-usuarios.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-consulta-usuarios',
  imports: [SharedModule,SpkReusableTablesComponent,FormsModule, FlatpickrModule, SpkFlatpickrComponent, ModalUsuariosComponent, CommonModule],
  templateUrl: './consulta-usuarios.component.html',
  styleUrl: './consulta-usuarios.component.scss'
})
export class ConsultaUsuariosComponent {
  prismCode = prismCodeData;
  showModal: boolean = false;
  isEditing: boolean = false;
  selectedUser: any = {};
//
responsiveColumn=[
  {header:"Seleccione",field:"Seleccione"},
  {header:"Team Head",field:"Team Head"},         
  {header:"Category",field:"Category"},
  {header:"Role",field:"Role"},
  {header:"gmail",field:"gmail"},
  {header:"Team",field:"Team"},         
  {header:"Work Progress",field:"Work Progress"},
  {header:"Revenue",field:"Revenue"},
  {header:"Action",field:"Action"},
]
//
responsiveTables=[
  {src:"./assets/images/faces/3.jpg",progress:"52",revenue:"$10,984.29",
  name:"Mayor Kelly",category:"Manufacturer",bg:"primary",
  role:"Team Lead",mail:"mayorkrlly@gmail.com",
  images:["./assets/images/faces/2.jpg","./assets/images/faces/8.jpg","./assets/images/faces/2.jpg"],count:4},
  {src:"./assets/images/faces/12.jpg",bg:"warning",
  name:"Andrew Garfield",category:"Managing Director",progress:"91",
  role:"Director",mail:"andrewgarfield@gmail.com",revenue:"$1.4billion",
  images:["./assets/images/faces/1.jpg","./assets/images/faces/5.jpg","./assets/images/faces/15.jpg","./assets/images/faces/11.jpg"],count:4},
  {src:"./assets/images/faces/14.jpg",bg:"success",
  name:"Simon Cowel",category:"Service Manager",progress:"45",
  role:"Manager",mail:"simoncowel234@gmail.com",revenue:"$7,123.21",
  images:["./assets/images/faces/6.jpg","./assets/images/faces/16.jpg"],count:10},
  {src:"./assets/images/faces/5.jpg",bg:"danger",
  name:"Mirinda Hers",category:"Recruiter",progress:"21",
  role:"Employee",mail:"mirindahers@gmail.com",revenue:"$2,325.45",
  images:["./assets/images/faces/3.jpg","./assets/images/faces/10.jpg","./assets/images/faces/14.jpg"],count:6}
]

openCreateModal() {
  const newUser = { src: '', progress: '', revenue: '', name: '', category: '', bg: '', role: '', mail: '', images: [], count: 0 };
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
    // 📌 Editar usuario existente
    this.responsiveTables = this.responsiveTables.map(u => u.name === data.id ? data : u);
    console.log('Usuario editado:', data);
  } else {
    // 📌 Crear nuevo usuario
    const newUser = { ...data, id: this.responsiveTables.length + 1 }; // Simula ID autogenerado
    this.responsiveTables.push(newUser);
    console.log('Nuevo usuario creado:', newUser);
  }

  this.closeModal();
}



}
