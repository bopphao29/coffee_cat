import { Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ManageCategotyComponent } from './manage-categoty/manage-categoty.component';
import { RouteGuardService } from '../services/route-guard.service';
import { ManageProductComponent } from './manage-product/manage-product.component';
import { ManageOrderComponent } from './manage-order/manage-order.component';
import { ViewBillComponent } from './view-bill/view-bill.component';
import { ManageUserComponent } from './manage-user/manage-user.component';



export const MaterialRoutes: Routes = [
    {
        path: 'category',
        component: ManageCategotyComponent,
        canActivate: [RouteGuardService], 
          data: {
            expectedRole: ['admin']
          }
    },
    {
      path: 'product',
      component: ManageProductComponent,
      canActivate: [RouteGuardService], 
        data: {
          expectedRole: ['admin']
        }
    },
    {
      path: 'order',
      component: ManageOrderComponent,
      canActivate: [RouteGuardService], 
        data: {
          expectedRole: ['admin', 'user']
        }
    },
    {
      path: 'bill',
      component: ViewBillComponent,
      canActivate: [RouteGuardService], 
        data: {
          expectedRole: ['admin','user']
        }
    },
    {
      path: 'user',
      component: ManageUserComponent,
      canActivate: [RouteGuardService], 
        data: {
          expectedRole: ['admin']
        }
    }
];
