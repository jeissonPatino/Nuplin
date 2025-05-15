import * as CryptoJS from 'crypto-js';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private secretKey = environment.secretKey; 
  

  encrypt(value: { username: string; password?: string }): string {
     
    let pass = value.password ?? "ChangePass";
    let user = value.username;
    const dataChainUser = pass+'&'+user;
    return CryptoJS.AES.encrypt(dataChainUser, this.secretKey).toString();
  }

  decrypt(value: string): string {
    const bytes = CryptoJS.AES.decrypt(value, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  encryptUser(value: {user: any}): void {
    let idUser =   value.user.email
    let username = value.user.email;
    let userType = value.user.userType;
    let status = value.user.status;
    const dataChainUser = idUser+'&'+username+'&'+userType+'&'+status;
    let objUser = CryptoJS.AES.encrypt(dataChainUser, this.secretKey).toString();
    sessionStorage.setItem('currentUser', objUser );
  }

  decryptUser(): string {
      const encryptedUser = sessionStorage.getItem('currentUser');
      if (!encryptedUser) {
        console.error('No hay datos en sessionStorage');
        return ''; 
      }
      const bytes = CryptoJS.AES.decrypt(encryptedUser, this.secretKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    
  }

  decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }

}
