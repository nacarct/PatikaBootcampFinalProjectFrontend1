import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PolicyComponent} from "./components/policy/policy.component";

const routes: Routes = [{
  path:'',
  component: PolicyComponent
},{
  path: 'Policy',
  component: PolicyComponent
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
