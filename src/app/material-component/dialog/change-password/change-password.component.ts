import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { SignupComponent } from 'src/app/signup/signup.component';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  changePaswordForm: any = FormGroup;
  responseMessage: any;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<SignupComponent>,
    private ngxService: NgxUiLoaderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.changePaswordForm = this.formBuilder.group({
      newPassword: [null,[Validators.required]],
      oldPassword: [null,[Validators.required]],
      confirmPassword: [null,[Validators.required]]

    })
  }

  validateSubmit(){
    if(this.changePaswordForm.controls['newPassword'].value != this.changePaswordForm.controls['confirmPassword'].value){
      return true;
    }
    else{
      return false;
    }
  }

  handChangePasswordSubmit(){
    this.ngxService.start();
    var formData = this.changePaswordForm.value;
    var data = {
      newPassword : formData.newPassword,
      oldPassword: formData.oldPassword,
      confirmPassword: formData.confirmPassword
    }
    this.userService.changePassword(data).subscribe((response: any)=>{
      this.ngxService.stop();
      this.dialogRef.close();
      // this.responseMessage = response?.message;
      localStorage.setItem('token', response.token)
      this.snackbarService.openSnackBar(this.responseMessage,"Đổi mật khẩu thành công"),
      this.router.navigate(['/dashboard'])
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
