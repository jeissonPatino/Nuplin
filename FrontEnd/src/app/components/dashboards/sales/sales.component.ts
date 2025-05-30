import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Renderer2 } from '@angular/core';
import {FlatpickrDefaults  } from 'angularx-flatpickr';
import { FormsModule } from '@angular/forms';
import { SpkSalesCardsComponent } from '../../../../@spk/reusable-dashboard/spk-sales-cards/spk-sales-cards.component';
import { SpkApexchartsComponent } from '../../../../@spk/spk-apexcharts/apexcharts.component';
import { AuthService } from '../../../shared/services/auth.service';
import { ClienteReporteConteo, ReportService, CrmCardData } from '../../../shared/services/report.service';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, SpkSalesCardsComponent, FormsModule,SpkApexchartsComponent],
  providers:[FlatpickrDefaults],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class SalesComponent {
  inlineDatePicker: boolean = false;
  weekNumbers!: true
  userRole:any;
  isSuperAdmin: boolean = false;
  flatpickrOptions: any = {
    inline: true,
  };
	private readonly userSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M256,136a8,8,0,0,1-8,8H232v16a8,8,0,0,1-16,0V144H200a8,8,0,0,1,0-16h16V112a8,8,0,0,1,16,0v16h16A8,8,0,0,1,256,136Zm-57.87,58.85a8,8,0,0,1-12.26,10.3C165.75,181.19,138.09,168,108,168s-57.75,13.19-77.87,37.15a8,8,0,0,1-12.25-10.3c14.94-17.78,33.52-30.41,54.17-37.17a68,68,0,1,1,71.9,0C164.6,164.44,183.18,177.07,198.13,194.85ZM108,152a52,52,0,1,0-52-52A52.06,52.06,0,0,0,108,152Z"></path></svg>`;
	cardUserData: CrmCardData[] = [];
	conteosClientes: ClienteReporteConteo | null = null;
	private destroy$ = new Subject<void>();
  constructor(private cdr: ChangeDetectorRef,
       private authService: AuthService,
	   private reporteService: ReportService,
	   private toastr: ToastrService,
	   private sanitizer: DomSanitizer
  ) {
    document.querySelector('.single-page-header')?.classList.add('hidden');
  }
  ngOnInit() {
    this.cdr.detectChanges(); 
    this.userRole = this.authService.getUserRole();
	this.isSuperAdmin = (this.userRole === 1);
    this.loadClientCounts();
    
  }

  ngOnDestroy(){
    document.querySelector('.single-page-header')?.classList.remove('hidden');
  }


  
chartOptions2:any={
	series: [
		{
    name: "Ventas Reales",
    data: [1000000, 1345000, 900000, 2400000, 9000000, 8500000, 3565000, 6560000, 6400000, 3500000, 2800000, 9500000],
},

{
    name: "Proyección Ventas",
    data: [7400000, 5900000, 3200000, 9800000, 9200000, 8800000, 8900000, 6540000, 4100000, 6380000, 2300000, 2100000],
}
	],
	chart: {
		type: "area",
		height: 270,
		toolbar: {
			show: false
		},
		zoom:{
			enabled:false
		},
		dropShadow: {
			enabled: false,
			enabledOnSeries: undefined,
			top: 0,
			left: 0,
			blur: 4,
			color: '#000',
			opacity: 0.3
		}
	},
	colors: [
		"rgba(var(--primary-rgb))",
		"rgba(227, 84, 212, .4)",
		"rgba(255, 93, 159, .4)",
	],
	fill: {
		type: 'gradient',
		gradient: {
			shadeIntensity: 1,
			opacityFrom: 0.4,
			opacityTo: 0.1,
			stops: [0, 90, 100],
			colorStops: [
				[
					{
						offset: 0,
						color: "rgba(var(--primary-rgb))",
						opacity: 0.3
					},
					{
						offset: 50,
						color: "rgba(var(--primary-rgb))",
						opacity: 0.2
					},
					{
						offset: 100,
						color: "rgba(var(--primary-rgb))",
						opacity: 0.0
					}
				],
				[
					{
						offset: 0,
						color: "rgba(227, 84, 212, .5)",
						opacity: 0.2
					},
					{
						offset: 50,
						color: "rgba(227, 84, 212, .5)",
						opacity: 0.2
					},
					{
						offset: 100,
						color: "rgba(227, 84, 212, .5)",
						opacity: 0.0
					}
				],
				[
					{
						offset: 0,
						color: "rgba(255, 93, 159, .6)",
						opacity: 0.08
					},
					{
						offset: 50,
						color: "rgba(255, 93, 159, .6)",
						opacity: 0.06
					},
					{
						offset: 100,
						color: "rgba(255, 93, 159, .6)",
						opacity: 0.0
					}
				],
			]
		}
	},
	dataLabels: {
		enabled: false,
	},
	legend: {
		show: true,
		position: "top",
		offsetX: 0,
		offsetY: 8,
		markers: {
			size:5,
			strokeWidth: 0,
			strokeColor: '#fff',
			fillColors: undefined,
			radius: 12,
			customHTML: undefined,
			onClick: undefined,
			offsetX: 0,
			offsetY: 0
		},
	},
	stroke: {
		curve: ['smooth', 'smooth', 'smooth'],
		width: [2, 0, 2],
		lineCap: 'round',
		dashArray: [0, 0, 4]
	},
	grid: {
		borderColor: '#f1f1f1',
		strokeDashArray: 3
	},
	yaxis: {
		axisBorder: {
			show: true,
			color: "rgba(119, 119, 142, 0.05)",
			offsetX: 0,
			offsetY: 0,
		},
		axisTicks: {
			show: true,
			borderType: "solid",
			color: "rgba(119, 119, 142, 0.05)",
			width: 6,
			offsetX: 0,
			offsetY: 0,
		},
	},
	xaxis: {
		type: "month",
		categories: [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"sep",
			"oct",
			"nov",
			"dec",
		],
		axisBorder: {
			// show: false,
			color: "rgba(119, 119, 142, 0.05)",
			offsetX: 0,
			offsetY: 0,
		},
		axisTicks: {
			show: false,
			borderType: "solid",
			color: "rgba(119, 119, 142, 0.05)",
			width: 6,
			offsetX: 0,
			offsetY: 0,
		},
		labels: {
			rotate: -90,
		},
	},
  }

  loadClientCounts(): void {
    this.reporteService.getConteoClientesResumen()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          this.conteosClientes = data;
          console.log('Conteos de clientes para las cards:', this.conteosClientes);
        },
        (error) => {
          console.error('Error al cargar los conteos de clientes para las cards:', error);
          this.toastr.error('Error al cargar el resumen de clientes.', 'Error');
        }
      );
  }

  

  updateCardData(): void {
    if (!this.conteosClientes) {
      this.cardUserData = [];
      return;
    }

    this.cardUserData = [
      {
        title: "Total Clientes",
        value: this.conteosClientes.total_clientes.toLocaleString(), 
        bg: "primary", 
        arrow: "up", 
        iconBgClass: "primary",
        svg: this.userSvg
      },
      {
        title: "Activos (Con Servicios)",
        value: this.conteosClientes.activos_con_agendamiento.toLocaleString(),
        bg: "success",
        arrow: "up",
        iconBgClass: "green", // Color de fondo del icono
        svg: this.userSvg
      },
      {
        title: "Activos (Sin Servicios)",
        value: this.conteosClientes.activos_sin_agendamiento.toLocaleString(),
        bg: "warning",
        arrow: "down",
        iconBgClass: "yellow", // Color de fondo del icono
        svg: this.userSvg
      },
      {
        title: "Inactivos",
        value: this.conteosClientes.inactivos_totales.toLocaleString(),
        bg: "danger",
        arrow: "down",
        iconBgClass: "red", // Color de fondo del icono
        svg: this.userSvg
      }
    ];
  }

}