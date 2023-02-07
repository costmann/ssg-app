import { NgModule } from "@angular/core";
import { UserDirective } from './user.directive';

@NgModule({
  declarations: [
    UserDirective,
  ],
  exports: [
    UserDirective,
  ]
})
export class DirectivesModule {}
