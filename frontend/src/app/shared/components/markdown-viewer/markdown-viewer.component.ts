import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-markdown-viewer',
  standalone: true,
  imports: [CommonModule, MarkdownModule],
  templateUrl: './markdown-viewer.component.html',
  styleUrls: ['./markdown-viewer.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MarkdownViewerComponent {
  @Input() content: string = '';
}
