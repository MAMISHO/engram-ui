import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { MarkdownViewerComponent } from '../../shared/components/markdown-viewer/markdown-viewer.component';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { ChartModule } from 'primeng/chart';

interface SavedFilter {
  id: string;
  name: string;
  query: string;
  type: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MarkdownViewerComponent,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    TabViewModule,
    ChartModule
  ],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  private api = inject(ApiService);

  projects: any[] = [];
  selectedProjectName: string | null = null;
  selectedProject: any = null;
  details: any = null;
  sessions: any[] = [];

  // Filtered collections
  filteredSessions: any[] = [];
  filteredObservations: any[] = [];

  // Active filters
  filterQuery = '';
  selectedTypeFilter = '';
  expandedSessionId: string | null = null;

  // Saved filters state
  savedFilters: SavedFilter[] = [];
  newFilterName = '';

  // Type options for PrimeNG dropdown
  typeOptions = [
    { label: 'All Types', value: '' },
    { label: 'Plan', value: 'plan' },
    { label: 'Decision', value: 'decision' },
    { label: 'Bugfix', value: 'bugfix' },
    { label: 'Architecture', value: 'architecture' },
    { label: 'Discovery', value: 'discovery' },
    { label: 'Session Summary', value: 'session_summary' }
  ];

  // PrimeNG Chart configuration
  pieData: any = null;
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
    this.loadProjects();
    this.loadSavedFilters();
  }

  loadProjects() {
    this.api.getProjects().subscribe({
      next: (data) => {
        this.projects = data;
      },
      error: (err) => console.error('Failed to load projects list', err)
    });
  }

  selectProject(projectName: string) {
    this.selectedProjectName = projectName;
    this.selectedProject = this.projects.find(p => p.project === projectName);
    this.expandedSessionId = null;
    this.filterQuery = '';
    this.selectedTypeFilter = '';

    // Fetch project stats and observations
    this.api.getProjectDetails(projectName).subscribe({
      next: (details) => {
        this.details = details;
        this.applyLocalFilters();
        this.preparePieChart(details.typeDistribution);
      },
      error: (err) => console.error('Failed to load project details', err)
    });

    // Fetch project sessions
    this.api.getSessions(1, 100, projectName).subscribe({
      next: (res) => {
        this.sessions = res.data;
        this.applyLocalFilters();
      },
      error: (err) => console.error('Failed to load project sessions', err)
    });
  }

  applyLocalFilters() {
    if (!this.details) return;

    const query = this.filterQuery.toLowerCase().trim();
    const type = this.selectedTypeFilter;

    // Filter sessions
    this.filteredSessions = this.sessions.filter(s => {
      const matchQuery = !query || 
        (s.id && s.id.toLowerCase().includes(query)) ||
        (s.summary && s.summary.toLowerCase().includes(query));
      return matchQuery;
    });

    // Filter observations/memories
    this.filteredObservations = (this.details.observations || []).filter((obs: any) => {
      const matchQuery = !query ||
        (obs.title && obs.title.toLowerCase().includes(query)) ||
        (obs.content && obs.content.toLowerCase().includes(query));
      const matchType = !type || obs.type === type;
      return matchQuery && matchType;
    });
  }

  toggleSessionExpand(sessionId: string) {
    this.expandedSessionId = this.expandedSessionId === sessionId ? null : sessionId;
  }

  // Saved filters management
  loadSavedFilters() {
    try {
      const saved = localStorage.getItem('engram_saved_filters');
      if (saved) {
        this.savedFilters = JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved filters from localStorage', e);
    }
  }

  saveFilter() {
    if (!this.newFilterName.trim()) return;

    const newFilter: SavedFilter = {
      id: Math.random().toString(36).substring(2, 9),
      name: this.newFilterName.trim(),
      query: this.filterQuery,
      type: this.selectedTypeFilter
    };

    this.savedFilters.push(newFilter);
    localStorage.setItem('engram_saved_filters', JSON.stringify(this.savedFilters));
    this.newFilterName = '';
  }

  applySavedFilter(sf: SavedFilter) {
    this.filterQuery = sf.query;
    this.selectedTypeFilter = sf.type;
    this.applyLocalFilters();
  }

  deleteSavedFilter(event: Event, id: string) {
    event.stopPropagation();
    this.savedFilters = this.savedFilters.filter(sf => sf.id !== id);
    localStorage.setItem('engram_saved_filters', JSON.stringify(this.savedFilters));
  }

  preparePieChart(distribution: any[]) {
    if (!distribution || distribution.length === 0) {
      this.pieData = null;
      return;
    }

    this.pieData = {
      labels: distribution.map(d => d.name),
      datasets: [
        {
          data: distribution.map(d => d.value),
          backgroundColor: ['#c084fc', '#facc15', '#f87171', '#60a5fa', '#34d399', '#94a3b8', '#f472b6']
        }
      ]
    };
  }
}
