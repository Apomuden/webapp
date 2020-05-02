import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ThemeConstantService } from '../../services/theme-constant.service';
import { AuthenticationService } from '../../services/authentication.service';
import { SetupService } from '../../services/setup.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor(
    private themeService: ThemeConstantService,
    private auth: AuthenticationService,
    private setup: SetupService
  ) { }
  searchVisible = false;
  quickViewVisible = false;
  isFolded: boolean;
  isExpand: boolean;
  facility: any;
  details;

  notificationList = [
    {
      title: 'You received a new message',
      time: '8 min',
      icon: 'mail',
      color: 'ant-avatar-' + 'blue'
    },
    {
      title: 'New user registered',
      time: '7 hours',
      icon: 'user-add',
      color: 'ant-avatar-' + 'cyan'
    },
    {
      title: 'System Alert',
      time: '8 hours',
      icon: 'warning',
      color: 'ant-avatar-' + 'red'
    },
    {
      title: 'You have a new update',
      time: '2 days',
      icon: 'sync',
      color: 'ant-avatar-' + 'gold'
    }
  ];

  ngOnInit(): void {
    this.details = this.auth.currentUserValue.details;
    this.themeService.isMenuFoldedChanges.subscribe(
      isFolded => (this.isFolded = isFolded)
    );
    this.themeService.isExpandChanges.subscribe(
      isExpand => (this.isExpand = isExpand)
    );
    this.facility = JSON.parse(localStorage.getItem('facilityDetails'));


    this.setup.getFacilities().pipe(first()).subscribe(
      res => {
        if (res) {
          localStorage.setItem('facilityDetails', JSON.stringify(res.data));
          this.facility = res.data;
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  toggleFold() {
    this.isFolded = !this.isFolded;
    this.themeService.toggleFold(this.isFolded);
  }

  toggleExpand() {
    this.isFolded = false;
    this.isExpand = !this.isExpand;
    this.themeService.toggleExpand(this.isExpand);
    this.themeService.toggleFold(this.isFolded);
  }

  searchToggle(): void {
    this.searchVisible = !this.searchVisible;
  }

  logout() {
    this.auth.logout();
  }
  quickViewToggle(): void {
    this.quickViewVisible = !this.quickViewVisible;
  }
}
