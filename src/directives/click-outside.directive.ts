import { Directive, OnInit, OnDestroy, Output, EventEmitter, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/do';

@Directive({
    selector: '[click-outside]'
})

export class ClickOutsideDirective implements OnInit, OnDestroy {

    @Output('clickOutside') public clickOutside: EventEmitter<Object>;

    private listening: boolean;
    private globalClick;

    constructor(private _elRef: ElementRef) {
        this.listening = false;
        this.clickOutside = new EventEmitter();
    }

    public ngOnInit() {
        this.globalClick = Observable
            .fromEvent(document, 'click')
            .delay(1)
            .do(() => {
                this.listening = true;
            }).subscribe((event: MouseEvent) => {
                this.onGlobalClick(event);
            });
    }

    public ngOnDestroy() {
        if (this.globalClick) {this.globalClick.unsubscribe();}
    }

    public onGlobalClick(event: MouseEvent) {
        if (event instanceof MouseEvent && this.listening === true) {
            if (this.isDescendant(this._elRef.nativeElement, event.target) === true) {
                this.clickOutside.emit({
                    target: (event.target || null),
                    value: false
                });
            } else {
                this.clickOutside.emit({
                    target: (event.target || null),
                    value: true
                });
            }
        }
    }

    public isDescendant(parent, child) {
        let node = child;
        while (node !== null) {
            if (node === parent) {
                return true;
            } else {
                node = node.parentNode;
            }
        }
        return false;
    }
}
