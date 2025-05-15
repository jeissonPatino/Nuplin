import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Renderer2 } from '@angular/core';
import {FlatpickrDefaults  } from 'angularx-flatpickr';
import { FormsModule } from '@angular/forms';
import { SpkSalesCardsComponent } from '../../../../@spk/reusable-dashboard/spk-sales-cards/spk-sales-cards.component';


@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, SpkSalesCardsComponent, FormsModule],
  providers:[FlatpickrDefaults],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesComponent {
  inlineDatePicker: boolean = false;
  weekNumbers!: true
  flatpickrOptions: any = {
    inline: true,
  };
 
  constructor(private cdr: ChangeDetectorRef) {
    document.querySelector('.single-page-header')?.classList.add('hidden');
  }
  ngOnInit() {
    this.cdr.detectChanges(); 
  }

  ngOnDestroy(){
    document.querySelector('.single-page-header')?.classList.remove('hidden');
  }


  cardData=[
    {
      id:1,
      cardClass:"overflow-hidden main-content-card",
      customClass:"justify-content-between align-items-start  mb-2",
      valueClass:"fw-medium mb-0",
      titleClass:"d-block mb-1" ,
      title:"Total Products",
      value:"854",
      graph:"increased",
      color:"success",
      percentage:"2.56%",
      percentageIcon:"ti ti-arrow-narrow-up fs-16",
      bg:"primary",
      icon:"ti ti-shopping-cart",
    },
    {
      id:2,
      cardClass:"overflow-hidden main-content-card",
      customClass:"justify-content-between align-items-start  mb-2",
      valueClass:"fw-medium mb-0",
      titleClass:"d-block mb-1" ,
      title:"Total Users",
      value:"31,876",
      graph:"increased",
      color:"success",
      percentage:"0.34%",
      percentageIcon:"ti ti-arrow-narrow-up fs-16",
      bg:"primarytint1color",
      icon:"ti ti-users"
    },
    {
      id:3,
      cardClass:"overflow-hidden main-content-card",
      customClass:"justify-content-between align-items-start  mb-2",
      valueClass:"fw-medium mb-0",
      titleClass:"d-block mb-1" ,
      title:"Total Revenue",
      value:"$34,241",
      graph:"increased",
      color:"success",
      percentage:"7.66%",
      percentageIcon:"ti ti-arrow-narrow-up fs-16",
      bg:"primarytint2color",
      icon:"ti ti-currency-dollar"
    }
  ]


}