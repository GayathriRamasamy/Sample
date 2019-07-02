import { Component, OnInit } from '@angular/core';
import html2canvas from "html2canvas";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'myprefix-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss'],
  providers: [NgbActiveModal]
})
export class PrintComponent implements OnInit {

  public enablePrint: boolean = false;
  public enableDetail: boolean = false;
  constructor (
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
    if(localStorage.getItem('enablePrint') === 'true') {
      this.enablePrint = true;
    } 
    if(localStorage.getItem('enableDetail') === 'true') {
      this.enableDetail = true;
    }
  }

  ngAfterViewChecked() {
  }

  ngOnDestroy() {
  }


  public printResult() {
    html2canvas(document.body, {
      width: screen.width ,
      height: screen.height + 250 
    }).then((canvas) => {
      const ref = window.open("", '_blank', 'width=' + (screen.width) + ',height=' + (screen.height) +
        ',fullscreen=yes,scrollbars=yes,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
      ref.document.body.appendChild(canvas);
      ref.document.title = "PUMA";
      ref.print();
     // localStorage.clear();
     localStorage.setItem("enablePrint", "false");
     localStorage.setItem("enableDetail", "false");
     this.enablePrint = false;
     this.enableDetail = false;
      window.close();
      
    }, (error) => {
    });
  }
}
