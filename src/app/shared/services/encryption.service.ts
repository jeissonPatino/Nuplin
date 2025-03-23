import * as CryptoJS from 'crypto-js';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private secretKey = 'clave-secreta-123'; 

  encrypt(value: any): string {
    let pass = value.value.password;
    let user = value.value.username;
    const dataChainUser = pass+'-'+user;
    return CryptoJS.AES.encrypt(dataChainUser, this.secretKey).toString();
  }

  decrypt(value: string): string {
    const bytes = CryptoJS.AES.decrypt(value, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

}
