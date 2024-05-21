import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalConstants } from 'src/app/shared/global-constants'
import { ProductComponent } from '../dialog/product/product.component';
import { ConfimationComponent } from '../dialog/confimation/confimation.component';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss']
})
export class ManageProductComponent implements OnInit {

  displayedColumns: string[] = [
    'image',
    'name',
    'categoryName',
    'description',
    'price',
    'edit'
  ]


  dataSource : any;
  responseMessage: any

  constructor(
    private productService: ProductService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private ngxService: NgxUiLoaderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.ngxService.start()
    this.tableData()
  }

  tableData(){
    this.productService.getProducts().subscribe((reponse: any)=>{
      this.ngxService.stop();
      this.dataSource= new MatTableDataSource(reponse)
    },(error: any)=>{
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage = error.error?.message
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error)
    
    })
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.toLowerCase();
  }

  handleAddAction(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add'
    }
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(ProductComponent, dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    })
    const sub = dialogRef.componentInstance.onAddProduct.subscribe((response: any)=>{
      this.tableData()
    })
  }

  handleEditAction(values : any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data: values
    }
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(ProductComponent, dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    })
    const sub = dialogRef.componentInstance.onEditProduct.subscribe((response)=>{
      this.tableData()
    })

  }

  handleDeleteAction(values : any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'Xóa' + values.name+ ' sản phẩm'
    };
    const dialogRef = this.dialog.open(ConfimationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response)=>{
      this.ngxService.start();
      this.deleteProduct(values.id);
      dialogRef.close();
    })
  }

  deleteProduct(id: any){
    this.productService.delete(id).subscribe((response: any)=>{
      this.ngxService.stop();
      this.tableData();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage,"Thành công")
      this.dataSource= new MatTableDataSource(response)
    },(error: any)=>{
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage = error.error?.message
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error)
    

    })
  }


  onChange(status :any, id: any){
    var data = {
      status: status.toString(),
      id: id
    }
    this.productService.update(data).subscribe((response: any)=>{
      this.ngxService.stop();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage,"Thành công")
    },(error: any)=>{
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
