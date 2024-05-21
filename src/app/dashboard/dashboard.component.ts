import { Component, AfterViewInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { error } from 'console';
import { GlobalConstants } from '../shared/global-constants';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {

	responseMessge : any
	data: any;


	ngAfterViewInit() { }

	constructor(
		private dashboardService: DashboardService,
		private ngxService: NgxUiLoaderService,
		private snackbarService: SnackbarService

	) {
		this.ngxService.start();
		this.dasboardData()
	}

	dasboardData(){
		this.dashboardService.getDetails().subscribe((response: any) => {
			this.ngxService.stop();
			this.data = response;
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
}
