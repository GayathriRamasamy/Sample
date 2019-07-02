import { Component, OnInit , Input} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as momentImported from 'moment';
const moment = momentImported;
import { Config } from 'src/app/_config/dashboard.config';
import { DashboardService } from '../../_services/+dashboard/dashboard.service';
import { FilterSettings } from '../../_services/+dashboard/modal-setting';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-custom-date',
  templateUrl: './custom-date.component.html',
  styleUrls: ['./custom-date.component.scss']
})
export class CustomDateComponent implements OnInit {
@Input()  customDateRange ;

  public labels = {
    'requiredLabel': Config.requiredLabel,
    'placeholder': Config.popUpPlaceholder,
    'header': Config.CustomDateRangePopupHeader
  };

  public popUpButtons = {
    'setDateBtn': Config.buttons['setDate'],
    'cancelBtn': Config.buttons['cancel']
  };


  public placeholder = Config.popUpPlaceholder;
  public cancelBtn = Config.buttons['cancel'];
  public setDateBtn = Config.buttons['setDate'];
  public requiredLabel = Config.requiredLabel;
  public selectedEndDate: string;
  public selectedStartDate: string;
  public selected: any = {};
  public minStartDate = new Date('1990-01-01');
  public maxStartDate = new Date('2500-12-12');
  public minEndDate;
  public maxEndDate;
  public isStartValid: boolean = false;
  public isEndValid : boolean = false;
  public isEnableEndDate: boolean = true;
  public isEnableStartDate: boolean = true;


  constructor(public activeModal: NgbActiveModal, private toastr: ToastrService,public dashboardService : DashboardService ) { }

  ngOnInit() {
  }

  public setEndDate(date) {    
   if(moment(date, 'YYYY/MM/DD', true).isValid() && moment(date, 'YYYY-MM-DD', true).isValid()){
    this.selectedEndDate = moment(date).format('YYYY-MM-DD');
     this.isEndValid = true;
     this.maxStartDate = date;
   }else{
     this.isEndValid = false;
   }
  }

  public setStartDate(date) {
    if (moment(date, 'YYYY/MM/DD', true).isValid() && moment(date, 'YYYY-MM-DD', true).isValid()) {
      this.selectedStartDate = moment(date).format('YYYY-MM-DD');
      this.minEndDate = date;
      this.isStartValid = true;
    }else{  
      this.isStartValid = false;
    }
  }


  public onLoad() {
    let dateObject = {
      startDate: this.selectedStartDate,
      endDate: this.selectedEndDate,
    };
    this.activeModal.close(dateObject);
  }

  close() {
    this.activeModal.close();
  }
}
