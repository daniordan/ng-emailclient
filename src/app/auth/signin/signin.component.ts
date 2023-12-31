// CHECKED

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { SigninCredentials } from '../auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit {
  authForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
      Validators.pattern(/^[a-z0-9]+$/),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(20),
    ]),
  });

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  onSubmit() {
    if (this.authForm.invalid) {
      return;
    }

    this.authService.signin(<SigninCredentials>this.authForm.value).subscribe({
      next: () => {
        // manually force the automatic navigation to the inbox route after signing in
        this.router.navigateByUrl('/inbox');
      },
      // use this { error } to access the error object, to destructure out only the error property object from the error object of the request response
      error: ({ error }) => {
        if (error.username || error.password) {
          this.authForm.setErrors({ credentials: true });
        }
      },
    });
  }

  getFormControl(controlName: string): FormControl {
    return this.authForm.get(controlName) as FormControl;
  }
}
