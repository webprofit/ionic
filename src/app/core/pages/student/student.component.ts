import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Status } from '../../model/status.model';
import { DataBaseService } from '../../services/data-base.service';
import Student from '../../model/student.model';
import { NotifierService } from 'angular-notifier';


import { IonInfiniteScroll } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
  providers: [Camera],
})
export class StudentComponent implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  students: Array<Student> = [];
  newStudent: boolean;
  status = Status;
  createStudent = new Student();
  tableName = 'students';
  studentDetail: Student = null;
  showStudentDetail = false;
  myPhoto = null;
  lat: number;
  lon: number;



  constructor(
    private camera: Camera,
    private geolocation: Geolocation,
    @Inject(NotifierService) private notifier: NotifierService,
    @Inject(DataBaseService) private baseSvc: DataBaseService,
  ) {
  }



  ngOnInit() {
    this.getData();
  }

  getData() {
    this.baseSvc.read('students')
      .subscribe((snap) => {
        this.students = new Array<Student>();

        snap.forEach((item) => {
          let st = new Student();
          st = item.data() as Student;
          st.objectId = item.id;
          this.students.push(st);
        });
      });

  }

  getGeo() {
    this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true })
      .then((resp) => {
        this.lat = resp.coords.latitude;
        this.lon = resp.coords.longitude;
      })
      .catch((err) => this.errorHandler(err));
  }

  takePhoto() {
    const options: CameraOptions = {
      quality: 80,
      targetHeight: 1000,
      targetWidth: 1000,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options)
      .then((imageData) => this.myPhoto = 'data:image/jpeg;base64,' + imageData)
      .catch((err: any) => this.errorHandler(err));
  }

  loadData(event: any) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();

      this.getData();
      if (this.students.length === 1000) {
        event.target.disabled = true;
      }
    }, 500);
  }


  toggleInfiniteScroll() {
    // if (this.infiniteScroll) {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
    console.log(this.infiniteScroll.disabled);
    // this.infiniteScroll.disabled = false;
    // }
  }

  CreateStudent(form: any) {
    if (form.valid) {
      this.baseSvc.create('students', this.createStudent)
        .then((res) => {
          this.newStudent = false;
          this.createStudent.objectId = res.id;
          this.students.push(this.createStudent);
          this.notifier.notify('info', 'Data was saved');
        });
    } else {
      form._submitted = true;
    }
  }

  DetailStudent(studetId: string) {
    this.baseSvc.readById('students', studetId)
      .subscribe((res) => {
        this.createStudent = res.data() as Student;
        this.createStudent.objectId = res.id;
        this.studentDetail = this.createStudent;
        this.showStudentDetail = true;
      });
  }

  Back() {
    this.ngOnInit();
    this.showStudentDetail = false;
  }

  RemoveStudent(studentId: string) {
    this.baseSvc.delete('students', studentId)
      .then((res) => {
        this.ngOnInit();
        this.notifier.notify('info', 'Data has been deleted');

      });
  }

  errorHandler(err: Error | any) {
    const errMsg = `${err.code ? err.code : ''} ${err.message ? err.message : ''}`;
    this.notifier.notify('error', `${errMsg ? errMsg : 'Something went wrong'}  ${err}`);
  }

}
