import { round, isEqual, cloneDeep } from 'lodash';
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, ElementRef } from "@angular/core";
import { NouiFormatter } from "ng2-nouislider";
import { DecimalPipe } from "@angular/common";
// import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs/Subject';
import { Subscription } from "rxjs/Subscription";
import { ToastrService } from 'ngx-toastr';

@Component({
    // tslint:disable-next-line:component-selector
    selector: "app-slider",
    templateUrl: "./slider.component.html",
    styleUrls: ["./slider.component.scss"]
})
export class SliderComponent implements OnInit, OnDestroy {
    public isSliderCollapsed: boolean;
    public config: any = {
        // tooltips: [true, true],
        behaviour: "tap-drag",
        connect: [true, true],
        margin: 1,
        limit: 20, // NOTE: overwritten by [limit]="10"
        range: {
            min: 0,
            max: 20
        },
        // pips: {
        //     mode: 'steps',
        //     density: 10
        // },
        start: [1, 10],
    };
    @ViewChild('slider') sliderRef;
    public minmnc: any;
    public maxmnc: any;

    public sub: Subscription;
    @Input() public title: string;
    public minValue;
    @Input() public set min(value: any) {
        this.minValue = value;
    }
    public maxValue;
    @Input() public set max(value: any) {
        this.maxValue = value;
    }
    public range;

    @Input() public set rangeValue(value: any[]) {
        if (value) {
            this.range = value;
            this.config.range.min = round(value[0]);
            this.config.range.max = round(value[1]);
            // this.minValue = value[0];
            // this.maxValue = value[1];
            // this.minValue = new DecimalPipe('en-us').transform(parseFloat(value[0]).toFixed(2), '1.2-2');
            // this.maxValue = new DecimalPipe('en-us').transform(parseFloat(value[1]).toFixed(2), '1.2-2');
            this.minmnc = new DecimalPipe('en-us').transform(parseFloat(value[0]).toFixed(2), '1.2-2');
            this.maxmnc = new DecimalPipe('en-us').transform(parseFloat(value[1]).toFixed(2), '1.2-2');
        }
    }
    public steps: any;
    @Input() public set step(value: any) {
        this.steps = value;
    }
    // public showConfig: boolean;
    // @Input() public set showPotentialConfig(value: any) {
    //     this.showConfig  = value;
    //     if (this.showConfig) {
    //         this.config = this.projectPotentialConfig;
    //     } else {
    //         this.config = this.defaultConfig;
    //     }
    // }
    @Input() public showTitle = true;
    @Input() public minTitle = '';
    @Input() public maxTitle = '';
    public sliderSetting = document.getElementById('slider');
    // tslint:disable-next-line:no-output-on-prefix
    @Output() public onChange: EventEmitter<any> = new EventEmitter<any>();


    public MinMNCkeyUp = new Subject<number>();
    public MaxMNCkeyUp = new Subject<number>();

    constructor(private toastr: ToastrService) { }

    public ngOnInit() {

        this.sub = this.MinMNCkeyUp
            .map(event => event['target'].value || this.minValue)
            .debounceTime(1000)
            .subscribe(minmncvalue => {
                if (this.MNCChange(minmncvalue, 'min')) {
                    // console.log
                    this.range = [+minmncvalue, +this.range[1]];
                    // this.onChange.emit(this.range);
                } else {
                    this.minmnc = +this.range[0];
                    this.minValue = +this.range[0];
                    // this.config.start[0] = +this.range[0];
                    this.toastr.error('Min value should be between the minimum and maximum value.');
                }
            });

        this.sub = this.MaxMNCkeyUp
            .map(event => event['target'].value || this.maxValue)
            .debounceTime(1000)
            .subscribe(maxmncvalue => {
                if (this.MNCChange(maxmncvalue, 'max')) {
                    this.range = [+this.range[0], +maxmncvalue];
                    // this.onChange.emit(this.range);
                } else {
                    this.maxmnc = +this.range[1];
                    this.maxValue =  +this.range[1];
                    // this.config.start[1] = +this.range[1];
                    this.toastr.error('Max value should be between the minimum and maximum value.');
                }
            });
    }

    public ngOnDestroy() {
        if (this.sub) { this.sub.unsubscribe(); }
    }

    public onChangeRange(event) {
        this.onChange.emit(event);
        this.minValue = 0;
        this.maxValue = 20;
        this.minmnc = new DecimalPipe('en-us').transform(parseFloat(event[0]).toFixed(2), '1.2-2');
        this.maxmnc = new DecimalPipe('en-us').transform(parseFloat(event[1]).toFixed(2), '1.2-2');
    }

    public resetValue(resetValue) {
        this.minValue = 0;
        this.maxValue = 20;
        this.range = [0, 20];
    }
  
    public onNgModelChange(event) {
        this.minValue = event[0];
        this.maxValue = event[1];
    }

    public MNCChange(mncvalue, minmax) {
        if (mncvalue > round(this.maxValue, 2) || mncvalue < round(this.minValue, 2)) {
            (minmax === 'min') ? this.minValue = null : this.maxValue = null;
            return false;
        } else {
            if (minmax === 'min') {
                if (mncvalue >= this.range[1]) {
                    return false;
                } else {
                    return true;
                }
            } else {
                if (mncvalue <= this.range[0]) {
                    return false;
                } else {
                    return true;
                }
            }
        }
    }
}

