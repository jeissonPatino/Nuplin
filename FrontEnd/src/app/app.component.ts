import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, Event,RouterOutlet } from '@angular/router';
import { AppStateService } from './shared/services/app-state.service';
import { SharedModule } from './shared/shared.module';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CommonModule,SharedModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  title = 'NuplinTv';
  constructor(private appState : AppStateService,private router:Router, private appStateService: AppStateService,){
    this.appState.updateState();
  }

  ngOnInit() {
    this.updateTheme();
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          // @ts-ignore
          HSStaticMethods.autoInit();
        }, 100);
      }
    });
  }

  updateTheme() {
    
    let theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    this.appStateService.updateState({ theme, menuColor: theme, headerColor: theme });
    if (theme == 'light') {
      this.appStateService.updateState({ theme, themeBackground: '', headerColor: 'light', menuColor: 'dark' });
      let html = document.querySelector('html');
      html?.style.removeProperty('--primary-rgb');
      html?.style.removeProperty('--body-bg');
      html?.style.removeProperty('--dark-bg');
      html?.style.removeProperty('--light');
      html?.style.removeProperty('--input-border');
      html?.setAttribute('data-toggled', 'close');
      html?.setAttribute('data-toggled', window.innerWidth <= 992 ? 'close' : '');

    }
    if (theme == 'dark') {
      this.appStateService.updateState({ theme, themeBackground: '', headerColor: 'dark', menuColor: 'dark' });
      let html = document.querySelector('html');
      html?.style.removeProperty('--primary-rgb');
      html?.style.removeProperty('--body-bg');
      html?.style.removeProperty('--dark-bg');
      html?.style.removeProperty('--light');
      html?.style.removeProperty('--input-border');
      html?.setAttribute('data-toggled', 'close');
      html?.setAttribute('data-toggled', window.innerWidth <= 992 ? 'close' : '');
    }
  }


}
