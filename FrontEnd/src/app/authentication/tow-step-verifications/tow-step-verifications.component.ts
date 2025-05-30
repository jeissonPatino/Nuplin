import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { EncryptionService } from '../../shared/services/encryption.service';
import { LogUsuarioService } from '../../shared/services/log-usuario.service';

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
    private encryptionService: EncryptionService,
    private LogUsuarioService: LogUsuarioService,
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
  codigoRecibido: string = '';


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.contexto = params['contexto'];
      this.username = params['username'] || '';
      this.newPass = params['newPass'] || '';
      this.email = params['email'] || ''; // Obtener el email de los parámetros
      if (this.contexto === 'cambio-pass' && (!this.username || !this.newPass)) {
        this.router.navigate(['/auth/login']);
      }
    });
  
    if (!this.email) {
      this.router.navigate(['/auth/login']);
    } else {
      const [local, domain] = this.email.split('@');
      const oculto = local.slice(0, 3) + '****';
      this.newmail = `<span class="math-inline">\{oculto\}@</span>{domain}`;
      this.authservice.sendEmailCodeVerification(this.email).subscribe(
        (codigo) => {
          this.codigoRecibido = codigo;
        },
        (error) => {
          this.toastr.error('Error al enviar el código de verificación.', 'Error');
          this.crearLog('Doble autenticación', 'Error al enviar el código de verificación.'+error, 'ERROR', 'TWO-STEP');
          this.router.navigate(['/auth/login']);
        }
      );
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
    this.authservice.loginConCodigo(this.email, codigo)
      .then(response => { 
        if (response && response.token) {
          sessionStorage.setItem('JWT', response.token);
          sessionStorage.setItem('sessionStartTime', Date.now().toString());
          this.crearLog('LOGIN', 'Usuario autenticado correctamente', 'INFO', 'LOGIN');
          this.router.navigate(['/CMT_Movitlity/inicio']);
        } else {
          this.crearLog('LOGIN', 'Ocurrió un error con la autenticación', 'ERROR', 'LOGIN');
          this.toastr.error(response?.message || 'El código es incorrecto', 'Nuplin', {
            timeOut: 3000,
            positionClass: 'toast-top-right'
          });
        }
      })
      .catch(error => {
        console.error('Error al verificar el código', error);
        this.toastr.error('Error al verificar el código', 'Nuplin', {
          timeOut: 3000,
          positionClass: 'toast-top-right'
        });
      });
  }

  validarCodigoCambioPass(codigo: string) {
    /*this.authservice.verificarCodigo(codigo) 
      .then(isValid => {
        if (isValid) {
          this.authservice.actualizarPassword(this.email, this.newPass).then((success: any) => {
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
        } else {
          this.toastr.error('El codigo es incorrecto', 'Nuplin', {
            timeOut: 3000,
            positionClass: 'toast-top-right'
          });
        }
      });*/
  }

reSend(){
  this.authservice.sendEmailCodeVerification(this.email).subscribe(
    (codigo) => {
      this.codigoRecibido = codigo;
      this.toastr.success('El código se ha reenviado exitosamente.', 'Información');
      this.crearLog('Doble autenticación', 'El código se ha reenviado exitosamente.', 'INFO', 'TWO-STEP');
    },
    (error) => {
      this.toastr.error('Error al reenviar el código.', 'Error');
      this.crearLog('Doble autenticación', 'Error al reenviar el código.'+error, 'INFO', 'TWO-STEP');
    }
  );
}

private crearLog(accion: string, descripcion: string, logLevel: string, moduloOrigen: string) {
  const email = this.encryptionService.getEmailFromToken();
  if (email !== null) {
    const mensaje = descripcion;
    const detalles = `${accion} - ${descripcion}`;
    this.LogUsuarioService.crearLog(email, logLevel, moduloOrigen, mensaje, detalles).subscribe({
      next: (log) => console.log('Log creado correctamente:', log),
      error: (err) => console.error('Error al crear log:', err)
    });
  }
}


}
