import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductService } from '../services/product.service';
import { SnackbarService } from '../services/snackbar.service';
import { BestSellerService } from '../services/best-seller.service';
import { GlobalConstants } from '../shared/global-constants';
import { MatTableDataSource } from '@angular/material/table';
import { DetailProductViewComponent } from '../detail-product-view/detail-product-view.component';


export interface Tile {
  color: string;
  text: string;
}

@Component({
  selector: 'app-best-seller',
  templateUrl: './best-seller.component.html',
  styleUrls: ['./best-seller.component.scss']
})
export class BestSellerComponent implements OnInit {

  responseMessge : any
	data: any;
  dataSource: any
  products = <any>[]

  constructor(
    private bestSellerService: BestSellerService,
    private ngxService: NgxUiLoaderService,
		private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.getListProducts()
  }

  tiles: Tile[] = [
    {text: 'One', color: 'lightblue'},
    {text: 'Two', color: 'lightgreen'},
    {text: 'Three', color: 'lightpink'},
    {text: 'Four', color: '#DDBDF1'},
    {text: 'Five', color: 'lightblue'},
    {text: 'Six', color: 'lightgreen'},
    {text: 'Seven', color: 'lightpink'},
  ];

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.products.filter = filterValue.toLowerCase();
  }


  getListProducts(){
    this.bestSellerService.getProductsList().subscribe((response: any)=>{
      this.ngxService.stop();
      // console.log(response)
      this.products = response
      console.log(this.products)
      // this.dataSource= new MatTableDataSource(response)
    },(error: any)=>{
			this.ngxService.stop();
			console.log(error);
			if(error.error?.message){
				this.responseMessge= error.error?.message;
			}else{
				this.snackbarService.openSnackBar(this.responseMessge, GlobalConstants.error)
			}
		}
  
  )
  }

  detailProduct(id : any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "500px";
    this.dialog.open(DetailProductViewComponent, dialogConfig)
  }
}
