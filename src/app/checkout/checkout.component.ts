import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { BackService } from '../services/back.service';
import KRGlue from '@lyracom/embedded-form-glue';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit  {
  
  backAnswer: any = {};

  constructor(private router: Router, private backService: BackService, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.loadStylesAndScripts();
    // Obtener el estado pasado a través de la navegación
    this.backAnswer = history.state || {};
 

    if (this.backAnswer.formToken && this.backAnswer.publicKey) {
      const endpoint = "https://static.micuentaweb.pe";

      // Carga la librería de KRGlue y configura el formulario.
      KRGlue.loadLibrary(endpoint, this.backAnswer.publicKey).then(({ KR }) => {
        KR.setFormConfig({
          formToken: this.backAnswer.formToken,
          'kr-language': 'es-ES',
        });

        KR.attachForm('#micuentawebstd_rest_wrapper').then(({ KR, result }) => {
          KR.showForm(result.formId);
        });

        KR.onSubmit(paymentData => {
          // Envía los datos a la API de validación.
          this.backService.validacion(paymentData).subscribe((resp: any) => {
            if (resp === true) {
              this.router.navigate(['/result'], { state: paymentData.clientAnswer });
            }
          });          
        });
      });
    }
  }

  private loadStylesAndScripts() {
    // Agregar el estilo
    const link = this.renderer.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/ext/classic-reset.css';
    document.head.appendChild(link);

    // Agregar el script
    const script = this.renderer.createElement('script');
    script.src = 'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/ext/classic.js';
    script.async = true; // Carga asincrónica
    document.body.appendChild(script);
  }

}
