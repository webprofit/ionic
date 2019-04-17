import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'student',
    pathMatch: 'full'
  },
  {
    path: 'student',
    loadChildren: './core/pages/student/student.module#StudentModule'
  },
  {
    path: 'class',
    loadChildren: './core/pages/class/class.module#ClassModule'
  },
  { path: 'class-reservation', 
    loadChildren: './core/pages/class-reservation/class.reservation.module#ClassReservationPageModule' 
}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
