<p align="center">
  <img src="https://github.com/izipay-pe/Imagenes/blob/main/logos_izipay/logo-izipay-banner-1140x100.png?raw=true" alt="Formulario" width=100%/>
</p>

# Popin-PaymentForm-Angular

## Índice

➡️ [1. Introducción](#-1-introducci%C3%B3n)  
🔑 [2. Requisitos previos](#-2-requisitos-previos)  
🚀 [3. Ejecutar ejemplo](#-3-ejecutar-ejemplo)  
🔗 [4. Pasos de integración](#4-pasos-de-integraci%C3%B3n)  
💻 [4.1. Desplegar pasarela](#41-desplegar-pasarela)  
💳 [4.2. Analizar resultado de pago](#42-analizar-resultado-del-pago)  
📡 [4.3. Pase a producción](#43pase-a-producci%C3%B3n)  
🎨 [5. Personalización](#-5-personalizaci%C3%B3n)  
🛠️ [6. Servidores](#-6-servidores)    
📚 [7. Consideraciones](#-7-consideraciones)

## ➡️ 1. Introducción

En este manual encontrarás una guía detallada para configurar un proyecto en **[Angular]** integrado con la pasarela de pagos de IZIPAY. Te proporcionaremos instrucciones claras y credenciales de prueba para instalar y configurar el proyecto, permitiéndote trabajar y realizar pruebas de manera segura en tu propio entorno local.
Este manual está diseñado para facilitar la comprensión del flujo de integración de la pasarela de pagos y maximizar el rendimiento de tu desarrollo front-end. **Ten en cuenta que este proyecto se conecta a un servidor (Backend) para gestionar las operaciones críticas relacionadas con la pasarela de pagos**.

> [!IMPORTANT]
> En la última actualización se agregaron los campos: **nombre del tarjetahabiente** y **correo electrónico** (Este último campo se visualizará solo si el dato no se envía en la creación del formtoken). 

<p align="center">
  <img src="https://github.com/izipay-pe/Imagenes/blob/main/formulario_popin/Imagen-Formulario-Popin.png?raw=true" alt="Formulario" width="350"/>
</p>


## 🔑 2. Requisitos Previos

- Comprender el flujo de comunicación de la pasarela. [Información Aquí](https://secure.micuentaweb.pe/doc/es-PE/rest/V4.0/javascript/guide/start.html)
- Extraer credenciales del Back Office Vendedor. [Guía Aquí](https://github.com/izipay-pe/obtener-credenciales-de-conexion)
- Descargar y ejecutar un servidor (Backend) API REST. [Servidores disponibles](#-6-servidore)
- Para este proyecto utilizamos la herramienta Visual Studio Code.
> [!NOTE]
> Tener en cuenta que, para que el desarrollo de tu proyecto, eres libre de emplear tus herramientas preferidas.

## 🚀 3. Ejecutar ejemplo


### Clonar el proyecto
```sh
git clone https://github.com/izipay-pe/Popin-PaymentForm-Angular.git
``` 

### Datos de conexión 

Realice la conexión al servidor modificando la ruta `[midominio.com]` por la ruta de su servidor.

- Editar el archivo `src/app/services/back.service.ts`:
```node
export class BackService {

  baserUrl: string = '';

  constructor(private http: HttpClient) { }

  getFromToken(formData: any) {
    this.baserUrl = '[midominio.com]/formtoken';
    return this.http.post(this.baserUrl, formData);
  }

  validacion( paymentData: any) {
    this.baserUrl = '[midominio.com]/validate';
    let dic = {
      'kr-answer': paymentData.rawClientAnswer,
      'kr-hash': paymentData.hash,
    }
    return this.http.post(this.baserUrl, dic);
  }

}
```

### Ejecutar proyecto

1. Ejecuta el siguiente comando para instalar todas las dependencias necesarias:
```bash
npm install
```

2.  Iniciar la aplicación:
```bash
npm start
```

## 🔗4. Pasos de integración

<p align="center">
  <img src="https://i.postimg.cc/pT6SRjxZ/3-pasos.png" alt="Formulario" />
</p>

## 💻4.1. Desplegar pasarela
### Autentificación
Las claves de acceso del Backoffice Vendedor deben configurarse exclusivamente en el servidor (Backend), no en la aplicación **[Angular]**. Esto asegura que las credenciales sensibles permanezcan protegidas y no sean expuestas en el código. 

ℹ️ Para más información: [Autentificación](https://secure.micuentaweb.pe/doc/es-PE/rest/V4.0/javascript/guide/embedded/keys.html)

### Crear formtoken
Para configurar la pasarela, es necesario generar un formtoken. Esto se realiza mediante una solicitud API desde tu aplicación **[Angular]** al servidor (Backend), el cual procesa los datos de la compra, devolviendo el `formtoken` y la llave `publicKey` necesarias para desplegar la pasarela. 

En el archivo `src/app/formulario/formulario.component.ts` se realiza la solicitud al servidor (Backend) junto con los datos recolectados del formulario. 

```node
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
```


### Visualizar formulario
Para desplegar la pasarela, se utiliza la libreria  [Embedded Form Glue](https://github.com/lyra/embedded-form-glue) y es necesario recepcionar los datos que nos devuelve el servidor para configurar la pasarela a través de los métodos de la libreria:

- Importar la libreria
```node
import KRGlue from '@lyracom/embedded-form-glue'	
```

- Cargar las funciones y clases principales de la pasarela a través de  `KRGlue.loadLibrary()` junto a llave `publicKey` que recibimos del servidor.
- Configurar la pasarela con el método  `KR.setFormConfig` junto con el `formToken` que recibimos del servidor.
- Incrustamos la pasarela con el método `KR.attachForm` y definimos el div con un ID donde se mostrará la pasarela.

 En el archivo `src/app/checkout/checkout.component.ts`:
```node
  ngOnInit(): void {
    this.loadStylesAndScripts();
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

        ..
        ..
      });
    }
  }
```
- En el archivo HTML `src/app/checkout/checkout.component.html` se debe encontrar el div con el ID donde se mostrará la pasarela.
```html
<div id="micuentawebstd_rest_wrapper">
  <div class="kr-embedded" kr-popin="true"></div>
</div>
```

- Adicionalmente se debe incluir en la cabecera los estilos necesarios para desplegar la pasarela. Podrás encontrarlos en el archivo `src/app/checkout/checkout.component.ts`

```node
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
```

## 💳4.2. Analizar resultado del pago

### Validación de firma
Se configura el método `KR.onSubmit` que recepciona la respuesta del pago y se envía los datos a su servidor para validar la firma, esto garantiza la integridad de los datos. Podrás encontrarlo en el archivo `src/app/checkout/checkout.component.ts`.
```node
//Al recibir la respuesta del pago, enviar a su servidor a validar los datos
KR.onSubmit(paymentData => {
  // Envía los datos a la API de validación.
  this.backService.validacion(paymentData).subscribe((resp: any) => {
    if (resp === true) {
      this.router.navigate(['/result'], { state: paymentData.clientAnswer });
    }
  });          
});
```
Una vez los datos son validados, se pueden mostrar en una pantalla, en el caso de ejemplo se muestran los datos en el archivo `src/app/result/result.component.html`. Todos los datos de la transacción se encontrarán dentro del parámetro `clientAnswer`.

ℹ️ Para más información: [Analizar resultado del pago](https://secure.micuentaweb.pe/doc/es-PE/rest/V4.0/kb/payment_done.html)

### IPN
La IPN es una notificación de servidor a servidor (servidor de Izipay hacia el servidor del comercio) que facilita información en tiempo real y de manera automática cuando se produce un evento, por ejemplo, al registrar una transacción. La IPN se debe configurar en el servidor (Backend).

ℹ️ Para más información: [Analizar IPN](https://secure.micuentaweb.pe/doc/es-PE/rest/V4.0/api/kb/ipn_usage.html)

### Transacción de prueba

Antes de poner en marcha su pasarela de pago en un entorno de producción, es esencial realizar pruebas para garantizar su correcto funcionamiento.

Puede intentar realizar una transacción utilizando una tarjeta de prueba con la barra de herramientas de depuración (en la parte inferior de la página).

<p align="center">
  <img src="https://i.postimg.cc/3xXChGp2/tarjetas-prueba.png" alt="Formulario"/>
</p>

- También puede encontrar tarjetas de prueba en el siguiente enlace. [Tarjetas de prueba](https://secure.micuentaweb.pe/doc/es-PE/rest/V4.0/api/kb/test_cards.html)

## 📡4.3.Pase a producción

Para el pase a producción es necesario cambiar las credenciales de TEST por las de PRODUCCIÓN dentro del servidor utilizado. El identificador de tienda sigue siendo el mismo.

## 🎨 5. Personalización

Si deseas aplicar cambios específicos en la apariencia de la pasarela de pago, puedes lograrlo mediante la modificación de código CSS. En este enlace [Código CSS - Popin](https://github.com/izipay-pe/Personalizacion/blob/main/Formulario%20Popin/Style-Personalization-PopIn.css) podrá encontrar nuestro script para un formulario popin.

<p align="center">
  <img src="https://github.com/izipay-pe/Imagenes/blob/main/formulario_popin/Imagen-Formulario-Custom-Popin.png?raw=true" alt="Formulario Popin"/>
</p>


## 🛠 6. Servidores
Lista de servidores disponibles:

| Lenguaje | Proyecto                                                                 |
|---------------------|--------------------------------------------------------------------------|
| ![PHP](https://img.shields.io/badge/PHP-777BB4?style=flat&logo=php&logoColor=white)          | [Server-PaymentForm-PHP](https://github.com/izipay-pe/Server-PaymentForm-PHP)                                           |
| ![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=flat&logo=laravel&logoColor=white) | [Server-PaymentForm-Laravel](https://github.com/izipay-pe/Server-PaymentForm-Laravel)                                   |
| ![Django](https://img.shields.io/badge/Django-092E20?style=flat&logo=django&logoColor=white)  | [Server-PaymentForm-Python-Django](https://github.com/izipay-pe/Server-PaymentForm-Python-Django)                                     |
| ![Flask](https://img.shields.io/badge/Flask-000000?style=flat&logo=flask&logoColor=white)    | [Server-PaymentForm-Python-Flask](https://github.com/izipay-pe/Server-PaymentForm-Python-Flask)                                       |
| ![.NET](https://img.shields.io/badge/.NET-5C2D91?style=flat&logo=dotnet&logoColor=white)      | [Server-PaymentForm-.NET](https://github.com/izipay-pe/Server-PaymentForm-.NET)                                       |
| ![NodeJS](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white) | [Server-PaymentForm-NodeJS](https://github.com/izipay-pe/Server-PaymentForm-NodeJS)                                     |
| ![NextJS](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white) | [Server-PaymentForm-NextJS](https://github.com/izipay-pe/Server-PaymentForm-NextJS)                                     |
| ![Java](https://img.shields.io/badge/Servlet%20Java-007396?style=flat&logo=java&logoColor=white) | [Server-PaymentForm-Servelt-Java](https://github.com/izipay-pe/Server-PaymentForm-Servlet-Java)                         |
| ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=flat&logo=springboot&logoColor=white) | [Server-PaymentForm-Springboot-Java](https://github.com/izipay-pe/Server-PaymentForm-Springboot)                         |


## 📚 7. Consideraciones

Para obtener más información, echa un vistazo a:

- [Formulario incrustado: prueba rápida](https://secure.micuentaweb.pe/doc/es-PE/rest/V4.0/javascript/quick_start_js.html)
- [Aplicaciones web de una sola página](https://secure.micuentaweb.pe/doc/es-PE/rest/V4.0/javascript/spa/#cargar-el-formulario-de-pago)
- [Servicios web - referencia de la API REST](https://secure.micuentaweb.pe/doc/es-PE/rest/V4.0/api/reference.html)
