import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { SnackbarService } from '../services/snackbar.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../shared/global-constants';
import { Router } from '@angular/router';
import { error } from 'console';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<SignupComponent>,
    private ngxService: NgxUiLoaderService,
    private router: Router
  ) { }

  signupForm : any = FormGroup;
  responseMessage : any;


  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      username : [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      email : [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber: [null, [Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
      password: [null,[Validators.required]],
      confirmPassword: [null,[Validators.required]]
    })
  }


  handleSubmit(){
    this.ngxService.start();
    var formData = this.signupForm.value;
    var data = {
      username : formData.username,
      password: formData.password,
      email : formData.email,
      contactNumber: formData.contactNumber,
      confirmPassword: formData.confirmPassword
    }
    this.userService.login(data).subscribe((response: any) =>{
      this.ngxService.stop();
      this.dialogRef.close();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage,"Đăng ký thành công"),
      this.router.navigate(['/cafe/dashboard'])
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
