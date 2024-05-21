import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalConstants } from 'src/app/shared/global-constants'

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent implements OnInit {

  displayedColumns: string[] = [
    'name',
    'email',
    'contactNumber',
    'status'
  ]

  dataSource : any = [];

  responseMessge : any

  constructor(
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private ngxService: NgxUiLoaderService,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.ngxService.start()
    this.tableData()
  }

  tableData(){
    this.userService.getUsers().subscribe((reponse: any)=>{
      this.ngxService.stop();
      this.dataSource= new MatTableDataSource(reponse)
    },(error: any)=>{
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessge = error.error?.message
      }else{
        this.responseMessge = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessge, GlobalConstants.error)
    
    })
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handChangeAction(status: any, id: any){
    this.ngxService.start();
    var data={
      status: status.toString(),
      id:id
    }
    this.userService.update(data).subscribe((response: any)=>{
      this.ngxService.stop();
      this.responseMessge = response?.message
      this.snackbarService.openSnackBar(this.responseMessge, "Sucess")
    },(error: any)=>{
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessge = error.error?.message
      }else{
        this.responseMessge = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessge, GlobalConstants.error)
    
    })
  }


}
