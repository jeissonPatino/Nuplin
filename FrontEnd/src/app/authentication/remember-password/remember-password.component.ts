import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { NgClass, CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { EncryptionService } from '../../shared/services/encryption.service';
@Component({
  selector: 'app-remember-password',
  standalone: true,
  imports: [RouterModule,FormsModule,ReactiveFormsModule, NgClass , CommonModule],
  templateUrl: './remember-password.component.html',
  styleUrl: './remember-password.component.scss'
})
export class RememberPasswordComponent {
  sugerenciaPassword: any;
  userExists: any;
  userActive: any;
  constructor(
      private formBuilder: FormBuilder,
      public authservice: AuthService,
      private toastr: ToastrService ,
      private encryptionService: EncryptionService,
      private router: Router,
  ){
    document.body.classList.add('authentication-background');
  }

  public resetPass!: FormGroup;
    get form() {
      return this.resetPass.controls;
    }

  password: string = '';
  validaciones = {
    longitud: false,
    mayuscula: false,
    numero: false,
    especial: false
  };

  ngOnInit(): void {
    this.resetPass = this.formBuilder.group({
          username: ['', [Validators.required, Validators.email]],
          newPass:  [{ value: '', disabled: true }, [Validators.required, Validators.minLength(8), Validators.maxLength(12), this.passwordValidator]],
          confPass: [{ value: '', disabled: true }, Validators.required],
        },
        { validator: this.matchPasswords(this.toastr) } 
    );
    this.resetPass.controls['newPass'].valueChanges.subscribe(value => {
      this.actualizarValidaciones(value);
    });
  }

  ngOnDestroy(): void {
    document.body.classList.remove('authentication-background');    
  }
  public showPassword: boolean = false;
  toggleClass = 'ri-eye-off-line';
  public showPassword1: boolean = false;
  toggleClass1 = 'ri-eye-off-line';
  public showPassword2: boolean = false;
  toggleClass2 = 'ri-eye-off-line';

  public togglePassword1() {
    this.showPassword1 = !this.showPassword1;
    if (this.toggleClass1 === 'ri-eye-line') {
      this.toggleClass1 = 'ri-eye-off-line';
    } else {
      this.toggleClass1 = 'ri-eye-line';
    }
  }

  public togglePassword2() {
    this.showPassword2 = !this.showPassword2;
    if (this.toggleClass2 === 'ri-eye-line') {
      this.toggleClass2 = 'ri-eye-off-line';
    } else {
      this.toggleClass2 = 'ri-eye-line';
    }
  }

  passwordValidator(control: any) {
    const value = control.value;
    if (!value) return null; 
    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(value);
    const isValid = hasUpperCase && hasNumber && hasSpecialChar;
    return isValid ? null : { weakPassword: true };
  }

  matchPasswords(toastr: ToastrService) {
    return (group: AbstractControl) => {
      const newPass = group.get('newPass')?.value;
      const confPass = group.get('confPass')?.value;
  
      if (newPass && confPass && newPass !== confPass) {
        toastr.error('Las contraseñas no coinciden', 'CMT_Movitlity', { 
          timeOut: 3000, 
          positionClass: 'toast-top-right' 
        });
        return { passwordsMismatch: true };
      }
      return null;
    };
  }

  generarPassword() {
    this.sugerenciaPassword = this.authservice.generarPassword();
    this.resetPass.get('newPass')?.setValue(this.sugerenciaPassword);
    this.resetPass.get('confPass')?.setValue(this.sugerenciaPassword);
  }

  actualizarValidaciones(value: string) {
    if (!value) return;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(value);
    this.validaciones.longitud = value.length >= 8 && value.length <= 12;
    this.validaciones.mayuscula = hasUpperCase;
    this.validaciones.numero = hasNumber;
    this.validaciones.especial = hasSpecialChar;
  }

  preventPaste(event: ClipboardEvent | KeyboardEvent | MouseEvent): void {
    if (event instanceof KeyboardEvent && event.ctrlKey && event.key === 'v') {
      event.preventDefault();
      this.toastr.warning('No puedes pegar en este campo', 'Advertencia', {
        timeOut: 2000,
        positionClass: 'toast-top-right'
      });
    }
    if (event instanceof ClipboardEvent) {
      event.preventDefault();
      this.toastr.warning('No puedes pegar en este campo', 'Advertencia', {
        timeOut: 2000,
        positionClass: 'toast-top-right'
      });
    }
    if (event instanceof MouseEvent) {
      event.preventDefault();
    }
  }

  validateUser(): void {
    const username = this.resetPass.get('username')?.value;
    if (!username) {
      this.toastr.warning('Debes ingresar un correo', 'Advertencia', {
        timeOut: 3000,
        positionClass: 'toast-top-right'
      });
      return;
    }
    const encryptedPassword = this.encryptionService.encrypt({username:username});
    this.authservice.validateUserStatus(encryptedPassword).then(userValidation => {
     
      this.userActive = userValidation.active;
      if (!userValidation.active) {
        this.toastr.error('El usuario está inactivo', 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-right'
          
        });
        this.resetPass.get('newPass')?.disable();
        this.resetPass.get('confPass')?.disable();
        this.resetPass.get('newPass')?.reset();
        this.resetPass.get('confPass')?.reset();
      } else {
        this.resetPass.get('newPass')?.enable();
        this.resetPass.get('confPass')?.enable();
      }
    });
    
  }

  Submit(){
    if (this.userExists || this.userActive) {
      this.toastr.warning('Redirigiendo al login...', 'Información', {
        timeOut: 3000,
        positionClass: 'toast-top-right'
      });
      this.router.navigate(['/authentication/login']);
    } else {
      //this.authservice.setUser(this.resetPass);
      this.router.navigate(['/auth/two-step-verification'], { 
        queryParams: { contexto: 'cambio-pass', username: this.resetPass.get('username'), newPass: this.resetPass.get('newPass') }
        
      });
    }
  }

  

}
