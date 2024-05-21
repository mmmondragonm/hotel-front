import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HotelesService } from '../../../../core/services/hoteles.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ServiciosService } from 'src/app/core/services/servicios.service';
import { Servicios } from 'src/app/core/models/servicios.models';

@Component({
  selector: 'app-hoteles-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './hoteles-form.component.html',
  styleUrl: './hoteles-form.component.scss'
})
export class HotelesFormComponent {
  
  serviciosSeleccionados: { id: string, nombre: string }[] = [];
  services: Servicios[] = [];
  selectedImages: File[] = [];

  hotelForm: FormGroup = new FormGroup({
    nombre : new FormControl('', [Validators.required, Validators.maxLength(150)]),
    direccion : new FormControl('', Validators.required),
    ciudad : new FormControl('', Validators.required),
    pais : new FormControl('', Validators.required),
    telefono : new FormControl('', Validators.required),
    email : new FormControl('', Validators.required),
    clasificacion : new FormControl(''),
    servicios : new FormControl(''),
    descripcion : new FormControl(''),
    fecha_apertura : new FormControl(''),
    imagenes : new FormControl(''),
    pagina_web : new FormControl(''),
    activo : new FormControl(''),
  })

  constructor(
    private hotelesService: HotelesService,
    private serviciosService: ServiciosService,
    private router: Router 
  ){}


  ngOnInit(): void {
    this.loadServicios();
  }

  private loadServicios(): void {
    this.serviciosService.getServicios().subscribe(response => {
      this.services = response;
    })
  }

  // onFileSelected(event: any) {
  //   this.selectedImages = event.target.files[0];
  //   this.selectedImages = event.target.files[0];

  //   console.log(this.selectedImages.values);
    
  // }

  // Método para obtener la URL de una imagen seleccionada
  // getImageSrc(image: File): string {
  //   return window.URL.createObjectURL(image);
  // }

  actualizarServicios(servicioSeleccionado: { id: string; nombre: string; }) {
    const servicio = this.services.find(servicio => servicio.id === servicioSeleccionado.id);
    if (servicio) {
      const servicioSeleccionadoIndex = this.serviciosSeleccionados.findIndex(servicio => servicio.id === servicioSeleccionado.id);
      if (servicioSeleccionadoIndex === -1) {
        // Si el servicio no está seleccionado, lo agregamos
        this.serviciosSeleccionados.push({ id: servicio.id, nombre: servicio.nombre });
      } else {
        // Si el servicio ya está seleccionado, lo eliminamos
        this.serviciosSeleccionados.splice(servicioSeleccionadoIndex, 1);
      }
      // Actualizamos el valor del formulario con los IDs y nombres de los servicios seleccionados
      this.hotelForm.get('servicios')?.setValue(this.serviciosSeleccionados);
    }
  }

  saveHotel(): void {

    // if (this.selectedImages) {
    //   this.hotelForm.patchValue({ imagenes: this.selectedImages });
    // }
    const serviciosJSON = JSON.stringify(this.hotelForm.get('servicios')?.value);

    // Crear un nuevo objeto para enviar al servidor, copiando los otros campos del formulario
    const datosFormulario = { ...this.hotelForm.value, servicios: serviciosJSON };

    this.hotelesService.createHotel(datosFormulario).subscribe(hotel => {
      this.router.navigateByUrl('/hoteles');
    })
  }

  hasError(field: string): boolean {
    const errorsObjetc = this.hotelForm.get(field)?.errors ?? {};
    const errors = Object.keys(errorsObjetc);

    if(errors.length && (this.hotelForm.get(field)?.touched || this.hotelForm.get(field)?.dirty)){
      return true;
    }

    return false;
  }

  getCurrentError(field: string): string {
    const errorsObjetc = this.hotelForm.get(field)?.errors ?? {};
    const errors = Object.keys(errorsObjetc);

    if(!errors)
        return '';
      
    return errors[0];
  }
}
