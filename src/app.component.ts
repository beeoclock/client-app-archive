import {AfterViewInit, Component, inject, OnInit, ViewEncapsulation,} from '@angular/core';
import {HeaderComponent} from '@src/module/utility/presentation/component/header/default/header.component';
import {initMediaQueryList} from '@src/module/utility/color-scheme';
import {AvatarComponent} from '@src/module/utility/presentation/component/avatar/avatar.component';
import {RouterOutlet} from '@angular/router';
import {FooterV1Component} from '@utility/presentation/component/footer/v1/footer-v1.component';
import {SplashScreenService} from '@utility/cdk/splash-screen.service';

@Component({
    selector: 'app-root',
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    imports: [HeaderComponent, FooterV1Component, AvatarComponent, RouterOutlet],
    template: `
        <router-outlet></router-outlet> `,
})
export class AppComponent implements OnInit, AfterViewInit {
    private readonly splashScreenService = inject(SplashScreenService);

    public ngOnInit(): void {
        initMediaQueryList();
    }

    public ngAfterViewInit(): void {
        this.splashScreenService.hide();
    }
}
