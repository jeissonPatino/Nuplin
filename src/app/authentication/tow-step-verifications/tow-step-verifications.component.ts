import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';

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
    public authservice: AuthService,
     private toastr: ToastrService ,
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
  newmail: string = '';
  contexto: string = '';
  username: string = '';
  newPass: string = '';



  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.contexto = params['contexto'];
      this.username = params['username'] || '';
      this.newPass = params['newPass'] || '';
      if (this.contexto === 'cambio-pass' && (!this.username || !this.newPass)) {
        this.router.navigate(['/auth/login']);
      }
    });

    this.email = this.authservice.getUser() || 'Correo no disponible';
    if(this.email==='Correo no disponible'){
      this.router.navigate(['/auth/login']);
    }else{
      const [local, domain] = this.email.split('@');
      const oculto = local.slice(0, 3) + '****';
      this.newmail = `${oculto}@${domain}`
      alert(this.generarCodigo())
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
  
    if (this.contexto === 'login') {
      this.validarCodigoLogin(codigo);
    } else if (this.contexto === 'cambio-pass') {
      this.validarCodigoCambioPass(codigo);
    }
  }

  validarCodigoLogin(codigo: string) {
    this.authservice.loginConCodigo(codigo)
      .then(success => {
        if (success) {
          this.router.navigate(['/nuplinTV/inicio']);
        } else {
          this.toastr.error('El codigo es incorrecto', 'Nuplin', {
            timeOut: 3000,
            positionClass: 'toast-top-right'
          });
        }
      });
  }

  validarCodigoCambioPass(codigo: string) {
    const valTrue = this.authservice.verificarCodigo(codigo);
    console.log(this.username)
    if(valTrue){
      this.authservice.actualizarPassword(this.email, this.newPass).then(success => {
        if (success) {
          this.toastr.success('Contraseña cambiada exitosamente. Inicia sesión con tu nueva contraseña.', 'Nuplin', {
            timeOut: 3000,
            positionClass: 'toast-top-right'
          });
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 3500);
        } else {
          this.toastr.error('El usuario no existe', 'Nuplin', {
            timeOut: 3000,
            positionClass: 'toast-top-right'
          });
        }
      });
    }else{
      this.toastr.error('El usuario no existe', 'Nuplin', {
        timeOut: 3000,
        positionClass: 'toast-top-right'
      });
    }
}

  reSend(){
    alert(this.generarCodigo())
  }

  generarCodigo(): string {
    const generateCode =  Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');
    this.authservice.sendEmailCodeVerification(generateCode);
    return generateCode;
  }

}
