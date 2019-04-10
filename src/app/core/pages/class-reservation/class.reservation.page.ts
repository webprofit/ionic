import { Component, OnInit, Inject } from '@angular/core';
import { Class } from '../../model/classs.model';
import { NotifierService } from 'angular-notifier';
import { DataBaseService } from '../../services/data-base.service';
import { ClassReservation } from '../../model/class-reservation.model';
import Student from '../../model/student.model';


@Component({
  selector: 'app-class.reservation',
  templateUrl: './class.reservation.page.html',
  styleUrls: ['./class.reservation.page.scss'],
})
export class ClassReservationPage implements OnInit {

  selectClass: string;
  reservation = new ClassReservation;
  classes = new Array<Class>();
  students = new Array<Student>();
  classReservation = new Array<ClassReservation>();
  isAddReservation = false;
  
  constructor(
    @Inject(NotifierService) private notifier: NotifierService,
    @Inject(DataBaseService) private baseSvc: DataBaseService,
  ) {
    this.baseSvc.read('classes')
    .subscribe((snap)=>{
      snap.forEach((item)=>{
        const cls = item.data() as Class;
        cls.objectId = item.id;
        this.classes.push(cls);
      })
    })
    this.baseSvc.read('students')
    .subscribe((snap)=>{
      snap.forEach((item)=>{
        const st = item.data() as Student;
        st.objectId = item.id;
        this.students.push(st);
      })
    })
   }
  //  getData(){
  //   this.baseSvc.read('classes')
  //   .subscribe((snap)=>{
  //     snap.forEach((item)=>{
  //       const cls = item.data() as Class;
  //       cls.objectId = item.id;
  //       console.log(cls);
        
  //       this.classes.push(cls);
  //     })
  //   })
  //   this.baseSvc.read('students')
  //   .subscribe((snap)=>{
  //     snap.forEach((item)=>{
  //       const st = item.data() as Student;
  //       st.objectId = item.id;
  //       this.students.push(st);
  //     })
  //   })
  //  }

  ngOnInit() {
    
    this.baseSvc.read('class-student')
    .subscribe((snap)=>{
      snap.forEach((item)=>{
        const cls = item.data() as ClassReservation;
        cls.objectId = item.id;
        this.classReservation.push(cls);
      })
    })

  }



  Save(){
    this.baseSvc.create('class-student', this.reservation)
    .then(()=>{
      this.notifier.notify('Info', 'Data has been saved');
      this.isAddReservation = false;
    })
  }

}
