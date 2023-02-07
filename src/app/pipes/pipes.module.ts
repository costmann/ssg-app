import { CommandIconPipe } from './command-icon.pipe';
import { NgModule } from '@angular/core';
import { StateStylePipe } from './state-style.pipe';
import { UserPipe } from './user.pipe';

@NgModule({
  declarations: [
    UserPipe,
    CommandIconPipe,
    StateStylePipe
   ],
  exports: [
    UserPipe,
    CommandIconPipe,
    StateStylePipe
  ]
})
export class PipesModule { }
