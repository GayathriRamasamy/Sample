import { ActivatedRoute, Data } from '@angular/router';
import { Component, DebugElement } from '@angular/core';
import { async, inject, TestBed, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
// import { Injector, ReflectiveInjector } from '@angular/core';

import { TiltlabelComponent } from './tiltlabel.component';

describe('Tiltlabel Component', () => {
    let comp: TiltlabelComponent;
    let fixture: ComponentFixture<TiltlabelComponent>;

    beforeEach(async () => {

        TestBed.configureTestingModule({
            declarations: [TiltlabelComponent],
            providers: [
                MockBackend,
                BaseRequestOptions,
                {
                    provide: Http,
                    useFactory: (backend, options) => new Http(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                },
                // Injector,
                // { provide: ComponentFixtureAutoDetect, useValue: true },

            ],
            imports: [
                HttpModule
            ]
        }).compileComponents();
    });

    it('should status called', (async () => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(TiltlabelComponent);
            comp = fixture.componentInstance;
            comp.status = 'updated';
            expect(comp.status).toBeDefined();
        });

    }));

});
