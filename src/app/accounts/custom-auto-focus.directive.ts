import { Directive, AfterViewInit, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appCustomAutoFocus]'
})
export class CustomAutoFocusDirective implements OnInit {

  constructor(private el: ElementRef) { }

  ngOnInit() {
    this.el.nativeElement.focus();
  }

}
