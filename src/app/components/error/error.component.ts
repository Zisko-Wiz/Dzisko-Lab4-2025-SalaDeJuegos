import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error',
  imports: [],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss'
})
export class ErrorComponent
{
  constructor( private router: Router){}

  public goToHome()
  {
    this.router.navigate(['home']);
  }
}
