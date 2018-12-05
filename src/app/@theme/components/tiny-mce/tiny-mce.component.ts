import { Component, OnDestroy, AfterViewInit, Output, Input, EventEmitter, ElementRef } from '@angular/core';

@Component({
  selector: 'ngx-tiny-mce',
  template: '',
})
export class TinyMCEComponent implements OnDestroy, AfterViewInit {
  @Input() setContent: any;

  @Output() value: String;

  @Output() onEditorKeyup = new EventEmitter<any>();
  @Output() onGetContent = new EventEmitter<any>();

  editor: any;

  constructor(private host: ElementRef) {
   }

  ngAfterViewInit() {
    tinymce.init({
      target: this.host.nativeElement,
      plugins: ['link', 'paste', 'table'],
      skin_url: 'assets/skins/lightgray',
      setup: editor => {
        this.editor = editor;
        editor.on('change', () => {
          const content = editor.getContent();
          this.onEditorKeyup.emit(content);
        });
        editor.on('click', () => {
          const content = editor.getContent();
          this.onGetContent.emit(content);
        });
      },
      height: '320',
    });
    this.editor.setContent(this.setContent);
    this.value = this.editor;
  }

  ngOnDestroy() {
    tinymce.remove(this.editor);
  }
}
