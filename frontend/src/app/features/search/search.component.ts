import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchService } from './search.service';
import { FormsModule } from '@angular/forms';
import { MarkdownViewerComponent } from '../../shared/components/markdown-viewer/markdown-viewer.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownViewerComponent, ScrollingModule, InputTextModule],
  templateUrl: './search.component.html',
})
export class SearchComponent {
  private searchService = inject(SearchService);

  searchTerm = '';
  results$ = this.searchService.getResults();
  isLoading$ = this.searchService.isLoading();
  selectedSession: any = null;

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'k') {
      event.preventDefault();
      document.getElementById('searchInput')?.focus();
    }
  }

  onSearchChange() {
    this.searchService.search(this.searchTerm);
  }

  selectSession(session: any) {
    this.selectedSession = session;
  }
}
