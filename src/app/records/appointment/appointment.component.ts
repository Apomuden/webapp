import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {

  listOfData = [
    {
      key: '1',
      fullname: 'John Brown',
      phone: '2332767678',
      email: 'joioasdf@safjl.com',
      address: 'East Legon',
      date: '27/32/2014',
      time: '12:24 PM',
      speciality: 'ENT',
      doctor: 'Dr. Asamoah',
      comment: 'This is a comment'

    },
    {
      key: '1',
      fullname: 'Mary Akuffo',
      phone: '23320000018',
      email: 'dsjh@gmail.com',
      address: 'Ashaiman',
      date: '27/32/2014',
      time: '12:24 PM',
      speciality: 'ENT',
      doctor: 'Dr. Frimpong',
      comment: 'This is a commsdfent'

    },
    {
      key: '1',
      fullname: 'Mildred Amissah',
      phone: '23324567078',
      email: 'straio@yahoo.com',
      address: 'East Legon',
      date: '27/32/2014',
      time: '12:24 PM',
      speciality: 'ENT',
      doctor: 'Dr. Asamoah',
      comment: 'This is a comment'

    }
  ];
  constructor() { }

  ngOnInit() {
  }



}
