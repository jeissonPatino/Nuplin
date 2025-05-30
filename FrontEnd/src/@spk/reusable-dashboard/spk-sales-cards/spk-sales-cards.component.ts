import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from '../../../app/shared/services/auth.service'
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'spk-sales-cards',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './spk-sales-cards.component.html',
  styleUrl: './spk-sales-cards.component.scss'
})

export class SpkSalesCardsComponent { 
  userRole: any;
  @Input() card!: {
    value?: string ;
    graph?: string ;
    valueClass?: string ;
    percentage?: string ;
    colClass?: string ;
    cardClass?: string ;
    icon?: string ;
    bg?: string ;
    color?: string ;
    customClass?: string ;
    customClass1?: string ;
    titleClass?: string ;
    title?: string ;
    svgClass?: string ;
    percentageIcon?: string ;
    rol?: number;
    route?: string;
    svg?: any; 
 };

 constructor(
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private router: Router,
 ) {}
 sanitizeHtml(html: string): SafeHtml {
   return this.sanitizer.bypassSecurityTrustHtml(html);
 }
 sanitizeIcon(svg: string): SafeHtml {
   return this.sanitizer.bypassSecurityTrustHtml(svg);
 }

 ngOnInit() {
    this.userRole = this.authService.getUserRole()
  }

  ngOnDestroy(){
    document.querySelector('.single-page-header')?.classList.remove('hidden');
  }


}
