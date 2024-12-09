import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div class="p-6">
      <h2 class="text-xl font-semibold mb-4">Confirm Delete</h2>
      <p class="mb-6 text-gray-600">{{ data.message }}</p>
      <div class="flex justify-end space-x-4">
        <button 
          mat-button 
          (click)="onNoClick()"
          class="px-4 py-2 border border-gray-300 rounded-lg">
          Cancel
        </button>
        <button 
          mat-button 
          (click)="onYesClick()"
          class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
          Delete
        </button>
      </div>
    </div>
  `
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}