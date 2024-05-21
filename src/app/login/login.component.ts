import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { SignupComponent } from '../signup/signup.component';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm : any = FormGroup;
  responseMessage : any;
  
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<LoginComponent>,
    private ngxService: NgxUiLoaderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email : [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      password: [null,[Validators.required]]
    })
  }

  handleSubmit(){
    this.ngxService.start();
    var formData = this.loginForm.value;
    var data = {
      email : formData.email,
      password: formData.password
    }
    this.userService.login(data).subscribe((response: any) =>{
      console.log(response)
      this.ngxService.stop();
      this.dialogRef.close();
      // this.responseMessage = response?.message;
      localStorage.setItem('token', response.token)
      // console.log(a)
      this.snackbarService.openSnackBar(this.responseMessage,"Đăng nhập thành công"),
      this.router.navigate(['/order'])
    },(error) => {
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage = error.error?.message
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error)
    })
  }

}
