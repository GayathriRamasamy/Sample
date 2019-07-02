import { Injectable } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, OnInit, ApplicationRef, ChangeDetectorRef } from '@angular/core';
// import { AppBroadcastService } from './app.broadcast.service';
// import { AppState } from './app.state';
@Component({
  template: `
  <div class="delete-modal">
    <div class="modal-header">
      <h4 class="modal-title">Confirmation</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p class="padding-20">{{defaultPrompt}}</p>
    </div>
    <div class="modal-footer">
      <div class="pull-right buttongroup">
        <button class="btn primarybutton" (click)="activeModal.close(true)">Yes</button>
        <button class="btn secondarybutton mgn-rgh-ten" (click)="activeModal.close('close')">No</button>
      </div>
    </div>
  </div>
  `,
  styles: [`.buttongroup {width: 40% !important;} 
  .btn {     
    margin: auto 10% !important;
    width: 30% !important;
    background: #eae5c4;
  }
.btn:hover, .btn:active {
  background-color: #65675e !important;
  color: #ffffff !important;
}

.modal-body .padding-20 {
  padding: 20px 0px !important;
}

.modal-header .close {
  margin: auto !important;
}  

.modal-header .modal-title {
  width: 100% !important;
  margin: auto;
}


.modal-title {
width:100% !imporant;
}
  
  
  
  `, `.delete-modal {    margin-left: -25% !important; width: 150% !important; background: white !important;} `, `.modal-dialog { margin: auto !important}`]
})

export class AppCancelConfirmationDialogComponent {
  // tslint:disable-next-line:no-inferrable-types
  @Input() public defaultPrompt: string = '';
  constructor(public activeModal: NgbActiveModal, public changeRef: ChangeDetectorRef) {
  }
}

// tslint:disable-next-line:max-classes-per-file
@Injectable()
export class AppCancelConfirmationDialogService {
  constructor(private modalService: NgbModal) { }
  public confirm(overridePrompt: string = 'Do you want to cancel your changes?'): Promise<any> {
    const modalRef = this.modalService.open(AppCancelConfirmationDialogComponent, { keyboard: false, backdrop: 'static' });
    modalRef.componentInstance.changeRef.markForCheck();
    modalRef.componentInstance.defaultPrompt  = overridePrompt;
    return modalRef.result.then((response) => {
      return response;
    });
  }
}
