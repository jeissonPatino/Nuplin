import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-confirmacion',
  imports: [CommonModule],
  templateUrl: './modal-confirmacion.component.html',
  styleUrl: './modal-confirmacion.component.scss'
})
export class ModalConfirmacionComponent {
  @Input() title: string = 'Título del Modal';
  @Input() data: any;
  @Input() showModal: boolean = false;
  @Output() onSave: EventEmitter<any> = new EventEmitter();
  @Output() close = new EventEmitter<void>();

  handleClose() {
    this.close.emit();
  }

  handleConfirm() {
    this.onSave.emit(this.data);
    console.log('Confirmar acción', this.data);
    this.close.emit(); 
  }
  
 }
