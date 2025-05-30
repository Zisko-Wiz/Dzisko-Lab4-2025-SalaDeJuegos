import { CanActivateFn } from '@angular/router';

export const canActivateJuegosGuard: CanActivateFn = (route, state) =>
{
  return false;
};
