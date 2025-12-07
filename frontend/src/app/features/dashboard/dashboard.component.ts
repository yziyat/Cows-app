import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../core/services/dashboard.service';
import { AuthService } from '../../core/services/auth.service';
import { WorkListService } from '../../core/services/work-list.service';
import { DashboardStats } from '../../models/dashboard.model';
import { User } from '../../models/user.model';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  currentUser: User | null = null;
  loading = true;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private workListService: WorkListService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;

    // Combine dashboard stats and work list counts
    combineLatest([
      this.dashboardService.getStats(),
      this.workListService.getDailyWorkLists()
    ]).subscribe({
      next: ([dashboardResponse, workLists]) => {
        this.stats = {
          ...dashboardResponse.stats,
          injections_today: workLists.injections.length,
          vet_checks_pending: workLists.vet_checks.length,
          heat_checks_today: workLists.heat_checks.length
        };
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading stats:', err);
        this.loading = false;
      }
    });
  }
}
