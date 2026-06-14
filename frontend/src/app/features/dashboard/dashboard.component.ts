import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private api = inject(ApiService);
  
  stats: any = null;
  pieData: any = null;
  barData: any = null;
  
  chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: '#f8fafc'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#94a3b8'
        },
        grid: {
          color: '#334155'
        }
      },
      y: {
        ticks: {
          color: '#94a3b8'
        },
        grid: {
          color: '#334155'
        }
      }
    }
  };

  pieOptions = {
    plugins: {
      legend: {
        labels: {
          color: '#f8fafc'
        }
      }
    }
  };

  ngOnInit() {
    this.api.getTelemetryStats().subscribe(data => {
      this.stats = data;
      this.prepareChartData(data);
    });
  }

  prepareChartData(data: any) {
    if (!data) return;

    // Prepare Pie Data (Top Tags)
    this.pieData = {
      labels: data.topTags.map((t: any) => t.name),
      datasets: [
        {
          data: data.topTags.map((t: any) => t.value),
          backgroundColor: ['#38bdf8', '#818cf8', '#c084fc', '#f472b6']
        }
      ]
    };

    // Prepare Bar Data (Activity Timeline)
    this.barData = {
      labels: data.activity.map((a: any) => a.name),
      datasets: [
        {
          label: 'Sessions',
          data: data.activity.map((a: any) => a.value),
          backgroundColor: '#38bdf8'
        }
      ]
    };
  }
}
