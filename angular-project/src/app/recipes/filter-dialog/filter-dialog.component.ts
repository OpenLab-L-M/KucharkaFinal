import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogActions, MatDialogContainer, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatListItem, MatListModule, MatNavList } from '@angular/material/list';

@Component({
  selector: 'app-filter-dialog',
  standalone: true,
  imports: [    MatDialogModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  CommonModule],
  templateUrl: './filter-dialog.component.html',
  styleUrl: './filter-dialog.component.css'
})
export class FilterDialogComponent {
  
  options = [
    { icon: 'edit', text: 'Pondelok', action: 'Pondelok' },
    { icon: 'lock', text: 'Utorok', action: 'Utorok' },
    { icon: 'notifications', text: 'Streda', action: 'Streda' },
    { icon: 'palette', text: 'Štvrtok', action: 'Štvrtok' },
    { icon: 'help', text: 'Piatok', action: 'Piatok' },
    { icon: 'info', text: 'Sobota', action: 'Sobota' },
    { icon: 'logout', text: 'Nedeľa', action: 'Nedeľa' }
  ];
  constructor(private dialogRef: MatDialogRef<FilterDialogComponent>) {}

  selectOption(action: string) {
    this.dialogRef.close(action);
    this.dialogRef.close({data: action })
  }
  cancelDialog(){
    this.dialogRef.close();
  }
}
