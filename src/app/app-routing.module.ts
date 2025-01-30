import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormularioComponent } from './formulario/formulario.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ResultComponent } from './result/result.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'formulario', // Redirige al formulario por defecto
    pathMatch: 'full'
  },
  {
    path: 'formulario',
    component: FormularioComponent
  },
  {
    path: 'checkout',
    component: CheckoutComponent
  },
  {
    path: 'result',
    component: ResultComponent
  },
  {
    path: '**', // Captura cualquier ruta no definida
    redirectTo: 'formulario'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
