import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  sidenavOpened = true;

  menuItems = [
    { label: 'Tableau de bord', key: 'MENU.DASHBOARD', icon: 'dashboard', route: '/dashboard' },
    { label: 'Bovins', key: 'MENU.CATTLE', icon: 'pets', route: '/cattle' },
    { label: 'Cycles de synchro', key: 'MENU.CYCLES', icon: 'sync', route: '/cycles' },
    { label: 'Inséminations', key: 'MENU.INSEMINATIONS', icon: 'science', route: '/inseminations' },
    { label: 'Protocoles', key: 'MENU.PROTOCOLS', icon: 'list', route: '/protocols' },
  ];

  constructor(
    public authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) { }

  get filteredMenuItems() {
    const items = [...this.menuItems];
    if (this.authService.hasRole(['admin'])) {
      items.push({ label: 'Users', key: 'MENU.USERS', icon: 'people', route: '/users' });
    }
    return items;
  }

  switchLanguage(lang: string): void {
    this.translate.use(lang);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  get currentUser() {
    return this.authService.currentUserValue;
  }
}
