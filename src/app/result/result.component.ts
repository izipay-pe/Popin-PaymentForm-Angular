import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent {
  clientAnswer: any = {};

  constructor(private route: Router) {}

  ngOnInit(): void {
    // Obtener el estado pasado a través de la navegación
    this.clientAnswer = history.state || {};
  }

  click(){
    this.route.navigate(['/formulario'])
  }
}
