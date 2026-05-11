import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'app-data-grid',
  standalone: true,
  imports: [CommonModule, AgGridAngular],
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.css']
})
export class DataGridComponent {
  @Input() rowData: any[] = [];
  @Input() columnDefs: ColDef[] = [];
  @Input() context: any;
  @Input() rowHeight = 80;
  @Input() headerHeight = 40;
  @Input() suppressCellFocus = true;
  @Input() suppressHorizontalScroll = true;

  @Output() gridReady = new EventEmitter<GridApi>();

  onGridReady(params: GridReadyEvent) {
    this.gridReady.emit(params.api);
  }
}
