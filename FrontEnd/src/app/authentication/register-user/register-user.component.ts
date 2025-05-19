import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { SpkNgSelectComponent } from '../../../@spk/spk-ng-select/spk-ng-select.component';
import { AuthService } from '../../shared/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register-user',
  imports: [RouterModule,FormsModule,ReactiveFormsModule ,ToastrModule, CommonModule, SpkNgSelectComponent],
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.scss'
})


export class RegisterUserComponent implements OnInit, OnDestroy{
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService ,
    public authservice: AuthService,
    private router: Router,
  ){
    document.body.classList.add('bg-white');
  }
  readonly passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;
  private registerSubscription?: Subscription;
  /*
  Declaracion de varobales booleanas
  */
  validationData: boolean = false

  TypeDoc = [
    { label: 'Cédula de Ciudadanía', value: 1 },
    { label: 'NIT', value: 2 },
    { label: 'Tarjeta de Identidad', value: 3 },
    { label: 'Pasaporte', value: 4 }
  ];

  selectedTypeIdentification: any;
  public registerForm!: FormGroup;
  get form() {
    return this.registerForm.controls;
  }

  public showPassword: boolean = false;
  toggleClass = 'ri-eye-off-line';
  public showPassword1: boolean = false;
  toggleClass1 = 'ri-eye-off-line';

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      NumberIdentification: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      confirmpassword: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      termsCoditions: [false, Validators.requiredTrue]
  });
  }

  ngOnDestroy(): void {
    document.body.classList.remove('bg-white');
    if (this.registerSubscription) {
      this.registerSubscription.unsubscribe();
    }
  }

  public togglePassword() {
    this.showPassword = !this.showPassword;
    if (this.toggleClass === 'ri-eye-line') {
      this.toggleClass = 'ri-eye-off-line';
    } else {
      this.toggleClass = 'ri-eye-line';
    }
  }

  public togglePassword1() {
    this.showPassword1 = !this.showPassword1;
    if (this.toggleClass1 === 'ri-eye-line') {
      this.toggleClass1 = 'ri-eye-off-line';
    } else {
      this.toggleClass1 = 'ri-eye-line';
    }
  }

  handleSelectChange(seleccion: any) {
    this.selectedTypeIdentification = seleccion.value
  }

  validarDatos() {
    this.validationData = true;
    if (this.registerForm.invalid) {
      this.toastr.error('Debes llenar el formulario para la creación de la cuenta', 'NuplinTv', { timeOut: 5000 });
      this.validationData = false;
      return;
    }
    if (!this.registerForm.value['firstname']) {
      this.toastr.error('Debes Ingresar tus nombres', 'NuplinTv', { timeOut: 5000 });
      return;
    }
    if (!this.registerForm.value['lastname']) {
      this.toastr.error('Debes Ingresar tus apellidos', 'NuplinTv', { timeOut: 5000 });
      return;
    }

    if (!this.selectedTypeIdentification) {
      this.toastr.error('Debes seleccionar tu tipo de documento de identificación', 'NuplinTv', { timeOut: 5000 });
      return;
    }

    if (!this.registerForm.value['NumberIdentification']) {
      this.toastr.error('Debes Ingresar tu número de identificación', 'NuplinTv', { timeOut: 5000 });
      return;
    }

    if (!this.registerForm.value['email']) {
      this.toastr.error('Debes Ingresar tu correo', 'NuplinTv', { timeOut: 5000 });
      return;
    }

    if (!this.registerForm.value['password']) {
      this.toastr.error('Debes Ingresar una contraseña', 'NuplinTv', { timeOut: 5000 });
      return;
    }

    if (!this.registerForm.value['confirmpassword']) {
      this.toastr.error('Debes Ingresar la confirmación de tu contraseña', 'NuplinTv', { timeOut: 5000 });
      return;
    }

    if (!this.registerForm.value['termsCoditions']) {
      this.toastr.error('Debes aceptar los términos y condiciones', 'NuplinTv', { timeOut: 5000 });
      return;
    }
  }

  async Submit() {
    this.validarDatos();
    if (this.validationData && this.registerForm.valid) {
      const formData = { ...this.registerForm.value, typeIdentification: this.selectedTypeIdentification};
      this.registerSubscription = this.authservice.registrarCliente(formData).subscribe(
        response => {
          console.log('Registro exitoso', response);
          this.toastr.success('Cuenta creada exitosamente', 'NuplinTv');
          this.router.navigate(['/auth/login']);
        },
        error => {
          console.error('Error en el registro', error);
          this.toastr.error('Error al crear la cuenta', 'NuplinTv', { timeOut: 5000 });
          if (error.status === 409) {
            this.toastr.error(error.error.message, 'NuplinTv', { timeOut: 5000 });
          }
        }
      );
      
    } else {
      this.toastr.error('Hubo un error al crear tu cuenta, contacta al administrador', 'NuplinTv', { timeOut: 5000 });
    }
  }
}
