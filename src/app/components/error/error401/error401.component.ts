import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-error401',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './error401.component.html',
  styleUrl: './error401.component.scss'
})

export class Error401Component {
constructor(
  public autService: AuthService,
){

}
  logout(){
    this.autService.logout();
  }


}
