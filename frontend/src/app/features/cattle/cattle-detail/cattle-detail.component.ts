import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CattleService } from '../../../core/services/cattle.service';
import { Cattle } from '../../../models/cattle.model';

@Component({
    selector: 'app-cattle-detail',
    templateUrl: './cattle-detail.component.html',
    styleUrls: ['./cattle-detail.component.scss']
})
export class CattleDetailComponent implements OnInit {
    cattle: Cattle | null = null;
    loading = true;
    error = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private cattleService: CattleService
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadCattle(parseInt(id, 10));
        } else {
            this.error = 'Identifiant non spécifié';
            this.loading = false;
        }
    }

    loadCattle(id: number): void {
        this.loading = true;
        this.cattleService.getCattleById(id).subscribe({
            next: (response) => {
                this.cattle = response.cattle;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading cattle:', err);
                this.error = 'Bovin non trouvé';
                this.loading = false;
            }
        });
    }

    goBack(): void {
        this.router.navigate(['/cattle']);
    }
}
