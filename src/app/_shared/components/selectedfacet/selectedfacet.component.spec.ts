import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectedFacetComponent } from './selectedfacet.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';

describe('SelectedFacetComponent', () => {
    let component: SelectedFacetComponent;
    let fixture: ComponentFixture<SelectedFacetComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SelectedFacetComponent],
            imports: [CommonModule, FormsModule, TagInputModule]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SelectedFacetComponent);
        component = fixture.componentInstance;
        component.facets = [
            {
                key: "EUROPE / A.M.E.E.",
                doc_count: 10,
                isChecked: true,
                groupName: "Region"
            },
            {
                key: "GREATER ASIA",
                doc_count: 20,
                isChecked: false,
                groupName: "Region"
            }];
        fixture.detectChanges();
    });

    it('should create', () => {
        component.ngOnInit();
        expect(component).toBeTruthy();
    });

    it('onRemoving', () => {
        let item = {
            key: "EUROPE / A.M.E.E.",
            doc_count: 10,
            isChecked: true,
            groupName: "Region"
        };
        component.onRemoving(item);
    });
});
