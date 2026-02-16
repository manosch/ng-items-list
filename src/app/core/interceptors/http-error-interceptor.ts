import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationUtils } from '../../shared/services/notification-utils';

export const errorInterceptorFn: HttpInterceptorFn = (req, next) => {
 const notifications = inject(NotificationUtils);

 return next(req).pipe(
   catchError((error) => {
      notifications.notify('Something went wrong. Please try again later.');
      return throwError(() => error);
    })
  );
};
