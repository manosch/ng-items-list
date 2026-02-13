import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

export const errorInterceptorFn: HttpInterceptorFn = (req, next) => {
 const snackBar = inject(MatSnackBar);

 return next(req).pipe(
   catchError((error) => {
      snackBar.open('Something went wrong. Please try again later.', 'Close');
      return throwError(() => error);
    })
  );
};
