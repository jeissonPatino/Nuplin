import * as CryptoJS from 'crypto-js';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private secretKey = 'clave-secreta-123'; 

  encrypt(value: { username: string; password?: string }): string {
     
    let pass = value.password ?? "ChangePass";
    let user = value.username;
    const dataChainUser = pass+'-'+user;
    return CryptoJS.AES.encrypt(dataChainUser, this.secretKey).toString();
  }

  decrypt(value: string): string {
    const bytes = CryptoJS.AES.decrypt(value, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

}
