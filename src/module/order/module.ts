import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {routers} from '@order/presentation';

@NgModule({
  imports: [RouterModule.forChild(routers)],
})
export class Module {
}
