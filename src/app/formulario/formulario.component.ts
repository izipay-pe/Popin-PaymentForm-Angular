import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BackService } from '../services/back.service';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent {
  formulario: FormGroup;

  constructor(private fb: FormBuilder, private router: Router,private backService: BackService) {
    this.formulario = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      identityType: ['DNI', Validators.required],
      identityCode: ['', Validators.required],
      address: ['', Validators.required],
      country: ['PE', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', Validators.required],
      orderId: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
      currency: ['PEN', Validators.required],
    });
  }

  async onSubmit() {
    if (this.formulario.valid) {
      this.backService.getFromToken(this.formulario.value).subscribe((resp: any) => {
        console.log(resp);
        this.router.navigate(['/checkout'], { state: resp });
      });
    }
  }
}

