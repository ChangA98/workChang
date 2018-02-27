import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.css','./../../app.component.css']
})
export class ClientDashboardComponent implements OnInit {
  // The Client
  private user: any;
  // The ngModel for the Form
  private brand: string;
  private model: string;
  private year: number;
  private licensePlate: string;
  private serial: string;
  private photoLink: string;

  private vehiculos = [];

  constructor(
    private api: ApiService 
  ) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user')); // Guardo los datos del usuario
    this.api.buscarCliente({
      userID: this.user.ID
    }).subscribe(clientData => { // Busco al cliente 
      if (clientData.success) { // Pregunto si tuve exito
        this.api.buscarCarros({
          OwnerID: clientData.client.ID
        }).subscribe(cars => { // Si lo tuve busco los carros de eso cliente
          this.vehiculos = cars; // Como es un observable asigno directamente
        });
      } else {
        console.log(clientData.msg); // sino averiguo que fallo
      }
    });
  }

  // Metodo asincrono
  async registrarCarro() {
    // Subir la foto a un proovedor y recibir el link
    this.photoLink = ''; // await proovedor... 
    const car = {
      brand: this.brand,
      model: this.model,
      year: this.year,
      licensePlate: this.licensePlate,
      serial: this.serial,
      photoLink: this.photoLink,
      active: true, 
      OwnerID: 0
    };
    this.api.buscarCliente({
      userID: this.user.ID
    }).subscribe(data => {
      console.log(data);
      if(data.success) {
        car.OwnerID = data.client.ID;
        this.api.registrarCarro(car).subscribe(dataCar => {
          this.vehiculos.push(dataCar.car);
        });
      } else {
        // Flash Message Pajita roja
      }
    });
  }

  pedirCita(serial) {
    console.log(serial);
    this.api.pedirCita({
      serial: serial
    }).subscribe(data => {
      if(data.success) {
        // Flash Message de todo cool
      } else {
        // Flash Message de todo mal 
      }
    });
  }

}
