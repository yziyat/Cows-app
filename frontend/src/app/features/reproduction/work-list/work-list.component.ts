import { Component, OnInit } from '@angular/core';
import { WorkListService } from '../../../core/services/work-list.service';
import { DailyWorkLists } from '../../../models/work-list.model';

@Component({
    selector: 'app-work-list',
    templateUrl: './work-list.component.html',
    styleUrls: ['./work-list.component.scss']
})
export class WorkListComponent implements OnInit {
    selectedDate: Date = new Date();
    lists: DailyWorkLists | null = null;
    loading = false;

    constructor(private workListService: WorkListService) { }

    ngOnInit(): void {
        this.loadLists();
    }

    loadLists(): void {
        this.loading = true;
        this.workListService.getDailyWorkLists(this.selectedDate).subscribe({
            next: (data) => {
                this.lists = data;
                this.loading = false;
            },
            error: (err) => {
                console.error(err);
                this.loading = false;
            }
        });
    }

    changeDate(days: number): void {
        const newDate = new Date(this.selectedDate);
        newDate.setDate(newDate.getDate() + days);
        this.selectedDate = newDate;
        this.loadLists();
    }

    resetDate(): void {
        this.selectedDate = new Date();
        this.loadLists();
    }
}
