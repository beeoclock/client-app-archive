import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {routers} from '@service/presentation';

@NgModule({
  imports: [RouterModule.forChild(routers)],
})
export class Module {
}
