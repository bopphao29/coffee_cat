import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss']
})
export class ManageOrderComponent implements OnInit {

  displayedColumns: string[] = [
    'name',
    'category',
    'price',
    'quantity',
    'total',
    'edit'
  ]

  dataSource : any = [];
  orderForm: any = FormGroup
  categorys: any = [];
  products: any = [];
  price: any;
  totalAmount: number = 0;
  responseMessge : any
  constructor(
    private categoryService: CategoryService,
    private billService: BillService,
    private productService: ProductService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private ngxService: NgxUiLoaderService,
    private router: Router,
    private formBuilder : FormBuilder
  ) { 
    
  }

  ngOnInit(): void {
    this.ngxService.start();
    this.getCategorys()
    this.orderForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber:[null, [Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
      paymentMethod : [null, [Validators.required]],
      product : [null, [Validators.required]],
      category : [null, [Validators.required]],
      quantity : [null, [Validators.required]],
      price : [null, [Validators.required]],
      total : [0, [Validators.required]],
    });
    
  }

  getCategorys(){
    this.categoryService.getCategorys().subscribe((response: any) => {
			this.ngxService.stop();
			this.categorys = response;
		},(error: any)=>{
			this.ngxService.stop();
			console.log(error);
			if(error.error?.message){
				this.responseMessge= error.error?.message;
			}else{
				this.snackbarService.openSnackBar(this.responseMessge, GlobalConstants.error)
			}
      this.snackbarService.openSnackBar(this.responseMessge, GlobalConstants.error)
		}
  )
  }

  getProductsByCategory(value: any){
    this.productService.getProductsByCategory(value.id).subscribe((response:any)=>{
      this.products = response;
      this.orderForm.controls['price'].setValue('');
      this.orderForm.controls['quantity'].setValue('');
      this.orderForm.controls['total'].setValue(0);
      
    },(error: any)=>{
			this.ngxService.stop();
			console.log(error);
			if(error.error?.message){
				this.responseMessge= error.error?.message;
			}else{
				this.snackbarService.openSnackBar(this.responseMessge, GlobalConstants.error)
			}
      this.snackbarService.openSnackBar(this.responseMessge, GlobalConstants.error)
		})
  }

  getProductDetails(values: any){
    this.productService.getById(values).subscribe((response:any)=>{
      // console.log('gia'+ response.price)
      this.price = response.price;
      // console.log(this.price )
      this.orderForm.controls['price'].setValue(response.price);
      this.orderForm.controls['quantity'].setValue('1');
      this.orderForm.controls['total'].setValue(this.price*1);
      
    },(error: any)=>{
			this.ngxService.stop();
			console.log(error);
			if(error.error?.message){
				this.responseMessge= error.error?.message;
			}else{
				this.snackbarService.openSnackBar(this.responseMessge, GlobalConstants.error)
			}
      this.snackbarService.openSnackBar(this.responseMessge, GlobalConstants.error)
		})
  }

  setQuantity(value:any){
    var temp = this.orderForm.controls['quantity'].value;
    if(temp > 0){
      this.orderForm.controls['total'].setValue(this.orderForm.controls['quantity'].value * this.orderForm.controls['price'].value);
    }else if(temp != ''){
      this.orderForm.controls['quantity'].setValue('1');
      this.orderForm.controls['total'].setValue(this.orderForm.controls['quantity'].value * this.orderForm.controls['price'].value);
    }
    
  }

  validateProductAdd(){
    if(this.orderForm.controls['total'].value === 0 || this.orderForm.controls['total'].value === null || this.orderForm.controls['quantity'].value <= 0)
      return true
    else
    return false
    }

  validateSubmit(){
    if(this.totalAmount === 0 || this.orderForm.controls['name'].value === null || this.orderForm.controls['email'].value === null || this.orderForm.controls['contactNumber'].value === null || this.orderForm.controls['paymentMethod'].value === null ||!(this.orderForm.controls['email'].valid)){
      return true;
    }else
    return false
  }

  add(){
    var formData = this.orderForm.value;
    var productName = this.dataSource.find((e:{id:number;})=>
      {
        e.id == formData.product.id
        //  console.log(e.id)
        //  console.log(formData.product.id)
      }
    );
    // console.log(productName)
    if(productName === undefined){
      this.totalAmount = this.totalAmount + formData.total;
      this.dataSource.push({
        id: formData.id,
        name: formData.name,
        category: formData.category.name,
        quantity: formData.quantity,
        price: formData.price,
        total: formData.total
        });
        this.dataSource = [...this.dataSource];
        this.snackbarService.openSnackBar(GlobalConstants.productAded, "Success");
    }
    else{
      this.snackbarService.openSnackBar(GlobalConstants.productExitError, GlobalConstants.error);
    }
  }

  handleDeleteAction(value: any, element: any){
    this.totalAmount = this.totalAmount - element.total;
    this.dataSource.splice(value, 1);
    this.dataSource = [...this.dataSource]
  }

  sumbmitAction(){
    this.ngxService.start();
    var formData = this.orderForm.value;
    var data = {
      // id: formData.id,
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      paymentMethod: formData.paymentMethod,
      totalAmount: this.totalAmount,
      productDetails: JSON.stringify(this.dataSource),
    }
    console.log(data) 
    this.billService.generateReport(data).subscribe((response: any)=>{
      this.downloadPdf(response?.uuid);
      this.orderForm.reset();
      this.dataSource = [];
      this.totalAmount = 0
    },(error: any)=>{
			this.ngxService.stop();
			console.log(error);
			if(error.error?.message){
				this.responseMessge= error.error?.message;
			}else{
				this.snackbarService.openSnackBar(this.responseMessge, GlobalConstants.error)
			}
      this.snackbarService.openSnackBar(this.responseMessge, GlobalConstants.error)
		}
    )
  }

  downloadPdf(fileName: any){
    var data = {
      uuid : fileName
    }
    this.billService.getPDF(data).subscribe((response: any)=>{
      saveAs(response,fileName + '.pdf');
      this.ngxService.stop()
    })
  }
}
