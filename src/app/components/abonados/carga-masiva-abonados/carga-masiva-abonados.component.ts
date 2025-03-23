import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { FilePondModule } from 'ngx-filepond';
import * as FilePond from 'filepond';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carga-masiva-abonados',
  standalone: true,
  imports: [CommonModule, FilePondModule], // 👈 Importa FilePondModule aquí
  templateUrl: './carga-masiva-abonados.component.html',
  styleUrl: './carga-masiva-abonados.component.scss'
})
export class CargaMasivaAbonadosComponent implements AfterViewInit {
  @ViewChild("myPond") myPond: any;
  pondFiles: FilePond.FilePondOptions["files"] = [
 
  ];
  singlepondOptions = {
    allowMultiple: false,
    labelIdle: "📂 Arrastra y suelta archivos aquí o haz clic para subir",
  };

  ngAfterViewInit() {
    if (this.myPond) {
      console.log('FilePond inicializado:', this.myPond);
    }
  }

  pondHandleInit() {
  }

  pondHandleAddFile(event: any) {
  }

  pondHandleActivateFile(event: any) {
  }
}
