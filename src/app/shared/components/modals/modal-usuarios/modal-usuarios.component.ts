import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-modal-usuarios',
  imports: [CommonModule],
  templateUrl: './modal-usuarios.component.html',
  styleUrl: './modal-usuarios.component.scss',
  standalone: true
})
export class ModalUsuariosComponent {
  @Input() title: string = 'Modal Title';  
  @Input() data: any; 
  @Output() closeModal: EventEmitter<void> = new EventEmitter(); 
  @Output() onSave: EventEmitter<any> = new EventEmitter(); 

  handleSave() {
    this.onSave.emit(this.data); // Envía datos de vuelta al componente padre
  }

  handleClose() {
    this.closeModal.emit(); // Emite el cierre del modal
  }
}
