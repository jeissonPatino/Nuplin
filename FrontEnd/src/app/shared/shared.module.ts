import { NgModule } from '@angular/core';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContentLayoutComponent } from './layouts/content-layout/content-layout.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ColorPickerModule, ColorPickerService } from 'ngx-color-picker';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { AuthenticationLayoutComponent } from './layouts/authentication-layout/authentication-layout.component';
import { TabToTopComponent } from './components/tab-to-top/tab-to-top.component';
import { SvgReplaceDirective } from './directives/svgReplace.directive';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
import { FullscreenDirective } from './directives/fullscreen.directive';
import { HoverEffectSidebarDirective } from './directives/hover-effect-sidebar.directive copy';
// import { NgxColorsModule } from 'ngx-colors';

@NgModule({
    declarations: [
        HeaderComponent,
        SidebarComponent,
        ContentLayoutComponent,  
        PageHeaderComponent,
        TabToTopComponent,
        FooterComponent,
        SvgReplaceDirective,
        AuthenticationLayoutComponent,
        HoverEffectSidebarDirective       
    ],
    
    imports:[
        CommonModule,
        RouterModule,
        OverlayscrollbarsModule,
        FormsModule,
        ReactiveFormsModule,
        FullscreenDirective,
        ColorPickerModule
    ],
    exports:[
        HeaderComponent,
        SidebarComponent,
        ContentLayoutComponent,
        PageHeaderComponent, 
        TabToTopComponent,
        FooterComponent,
        AuthenticationLayoutComponent,
        HoverEffectSidebarDirective
    ]
})

export class SharedModule { }
 