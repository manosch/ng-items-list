import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationUtils {
  snackBar = inject(MatSnackBar);

  notify(message: string, duration: number = 1000) {
    this.snackBar.open(message, 'Close', { duration });
  }
}
