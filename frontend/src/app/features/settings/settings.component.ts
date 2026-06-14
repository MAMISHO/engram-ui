import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, MessageModule],
  templateUrl: './settings.component.html',
  styles: [`
    .settings-container {
      padding: 2rem;
      max-width: 600px;
    }
    .form-group {
      margin-bottom: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .db-input {
      width: 100%;
    }
  `]
})
export class SettingsComponent implements OnInit {
  private api = inject(ApiService);

  dbPath = '';
  successMessage = '';
  errorMessage = '';

  ngOnInit() {
    this.api.getDatabasePath().subscribe(res => {
      this.dbPath = res.path;
    });
  }

  saveSettings() {
    this.errorMessage = '';
    this.successMessage = '';
    this.api.updateDatabasePath(this.dbPath).subscribe({
      next: (res) => {
        if (res.success) {
          this.successMessage = 'Database path updated successfully and reconnected.';
        } else {
          this.errorMessage = res.error || 'Failed to update database path.';
        }
      },
      error: (err) => {
        this.errorMessage = 'Network error: ' + (err.message || err);
      }
    });
  }
}
