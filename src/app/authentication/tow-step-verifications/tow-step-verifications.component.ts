import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-tow-step-verifications',
  imports: [],
  templateUrl: './tow-step-verifications.component.html',
  styleUrl: './tow-step-verifications.component.scss'
})
export class TowStepVerificationsComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    public authservice: AuthService
){
    document.body.classList.add('authentication-background');
  }
  ngOnDestroy(): void {
    document.body.classList.remove('authentication-background');    
  }
  @ViewChild('oneInput') oneInput!: ElementRef<HTMLInputElement>;
  @ViewChild('twoInput') twoInput!: ElementRef<HTMLInputElement>;
  @ViewChild('threeInput') threeInput!: ElementRef<HTMLInputElement>;
  @ViewChild('fourInput') fourInput!: ElementRef<HTMLInputElement>;
  @ViewChild('fiveInput') fiveInput!: ElementRef<HTMLInputElement>;
  @ViewChild('sixInput') sixInput!: ElementRef<HTMLInputElement>;

  @Output() codigoIngresado = new EventEmitter<string>();
  email: string = '';

  ngOnInit(): void {
    this.email = this.authservice.getUser() || 'Correo no disponible';
    if(this.email==='Correo no disponible'){
      this.router.navigate(['/auth/login']);
    }
  }
  
  onDigitInput(event: KeyboardEvent, nextInput: HTMLInputElement | null): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.value.length > 0) {
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  enviarCodigo() {
    const codigo = [
      this.oneInput.nativeElement.value,
      this.twoInput.nativeElement.value,
      this.threeInput.nativeElement.value,
      this.fourInput.nativeElement.value,
      this.fiveInput.nativeElement.value,
      this.sixInput.nativeElement.value
    ].join('');
  
    const userData = this.authservice.getUser();
  
    if (!userData) {
      this.router.navigate(['/auth/login']);
      return;
    }
    debugger;
    this.authservice.loginConCodigo()
      .then(success => {
        if (success) {
          this.router.navigate(['/nuplinTV/inicio']);
        } else {
          alert("Código incorrecto");
        }
      });
  }

  reSend(){
    alert("se reenvio el correo de verificacion")
  }


}
