import { DOCUMENT, CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AuthService } from '../../shared/services/auth.service';
import { environment } from "../../../environments/environment";
import { EncryptionService } from '../../shared/services/encryption.service';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule,FormsModule,ReactiveFormsModule ,ToastrModule, CommonModule],
  providers: [{ provide: ToastrService, useClass: ToastrService }],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  public showPassword: boolean = false;
  toggleClass = 'off-line';
  active="Angular";
  errorTextUsername: string = '';
  errorTextPassword: string = '';
  authModule: any;
  public togglePassword() {
    this.showPassword = !this.showPassword;
    if (this.toggleClass === 'line') {
      this.toggleClass = 'off-line';
    } else {
      this.toggleClass = 'line';
    }
  }
  disabled = '';
  captchaResponse: string = "";
  recaptchaToken: string = '';
  grecaptcha: any;
  public loginForm!: FormGroup;
  get form() {
    return this.loginForm.controls;
  }
  emailOculto: string = '';

constructor(
  @Inject(DOCUMENT) private document: Document,private elementRef: ElementRef,
  private sanitizer: DomSanitizer,
  public authservice: AuthService,
  private router: Router,
  private formBuilder: FormBuilder,
  private renderer: Renderer2,
  private toastr: ToastrService ,
  private encryptionService: EncryptionService
) {
    document.body.classList.add('authentication-background');
    const bodyElement = this.renderer.selectRootElement('body', true);
  }

  ngOnDestroy(): void {
    document.body.classList.remove('authentication-background');    
  }

  ngOnInit(): void {
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${environment.recaptchaSiteKey}`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  async Submit() {
    this.disabled = "btn-loading";
    if (!this.validateForm(this.loginForm.value.username, this.loginForm.value.password)) {
      this.toastr.error('Uppps', 'NuplinTv', { timeOut: 3000, positionClass: 'toast-top-right' });
      return;
    }
    await this.verifyRecaptcha();
    if (!this.recaptchaToken) {
      this.toastr.error('Error con reCAPTCHA, intenta nuevamente', 'NuplinTv', { timeOut: 3000 });
      return;
    }
    this.validatinUser(this.loginForm)
  }

  async verifyRecaptcha() {
    try {
      this.recaptchaToken = await (window as any).grecaptcha.execute(environment.recaptchaSiteKey, { action: 'login' });
    } catch (error) {
      console.error('Error ejecutando reCAPTCHA', error);
      this.recaptchaToken = '';
    }
  }

  validateForm(email: string, password: string) {
    if (email.length === 0) {
      this.errorTextUsername = 'Debe ingresar su correo de usuario';
      return false;
    }
    if (password.length === 0) {
      this.errorTextPassword = 'Debe ingresar su contraseña de usuario';
      return false;
    }
    return true;
  }

  async validatinUser(loginForm: any){
    const encryptedPassword = this.encryptionService.encrypt(loginForm);
    const userValidate = await this.authservice.validateUser(encryptedPassword)
    if(userValidate){
      debugger;
      this.authservice.setUser(this.loginForm);
      this.router.navigate(['/auth/two-step-verification']);    
    }else{
      this.toastr.error('Las credenciales ingresadas no son correctas', 'NuplinTv', { timeOut: 5000 });
    }
  }

  
  
}


