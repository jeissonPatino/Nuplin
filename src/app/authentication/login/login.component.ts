import { DOCUMENT, CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AuthService } from '../../shared/services/auth.service';
import { environment } from "../../../environments/environment";

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

constructor(
  @Inject(DOCUMENT) private document: Document,private elementRef: ElementRef,
  private sanitizer: DomSanitizer,
  public authservice: AuthService,
  private router: Router,
  private formBuilder: FormBuilder,
  private renderer: Renderer2,
  private toastr: ToastrService 
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
  const hashedPassword = await this.hashPassword(this.loginForm.value.password);
  
  
  if (!this.recaptchaToken) {
    this.toastr.error('Error con reCAPTCHA, intenta nuevamente', 'NuplinTv', { timeOut: 3000 });
    return;
  }
  
  this.authservice
    .loginWithEmail(this.loginForm.value.username, hashedPassword, this.recaptchaToken)
    .then((success) => {
      if (success) {
        this.router.navigate(['/nuplinTV/inicio']);
        console.clear();
        this.toastr.success('Hola', 'NuplinTv', { timeOut: 3000, positionClass: 'toast-top-right' });
      } else {
        this.toastr.error('Credenciales incorrectas', 'NuplinTv', { timeOut: 3000 });
      }
    })
    .catch((error) => {
      console.error('Error en login:', error);
      this.toastr.error('Error en autenticación', 'NuplinTv', { timeOut: 3000 });
    });
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

async hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-384', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}
}


