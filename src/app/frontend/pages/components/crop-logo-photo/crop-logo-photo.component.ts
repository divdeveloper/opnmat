import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    ViewChild,
    Type,
    OnChanges,
    SimpleChanges,
    SimpleChange,
    ElementRef,
} from '@angular/core';
import {
    ImageCropperComponent,
    CropperSettings,
    Bounds,
} from 'ng2-img-cropper';


@Component({
    selector: 'opn-crop-logo-photo',
    templateUrl: './crop-logo-photo.component.html',
    styleUrls: ['./crop-logo-photo.component.scss'],
})
export class CropLogoPhotoComponent implements OnInit, OnChanges {

    data: any;
    cropperSettings: CropperSettings;
    @ViewChild('cropper', undefined) cropper: ImageCropperComponent;
    @ViewChild('cropLogo', {read: ElementRef}) cropLogoRef: ElementRef;
    @ViewChild('file', {read: ElementRef}) fileRef: ElementRef;

    @Output() onCropped: EventEmitter<any> = new EventEmitter<any>();
    @Output() closeModel: EventEmitter<any> = new EventEmitter<any>();

    constructor() {
        this.cropperSettings = new CropperSettings();
        this.cropperSettings.width = 150;
        this.cropperSettings.height = 150;
        this.cropperSettings.keepAspect = false;
        this.cropperSettings.noFileInput = true;
        this.cropperSettings.preserveSize = false;
        this.cropperSettings.croppingClass = 'hiden';

        this.cropperSettings.croppedWidth = 200;
        this.cropperSettings.croppedHeight = 200;

        this.cropperSettings.canvasWidth = 250;
        this.cropperSettings.canvasHeight = 200;

        this.cropperSettings.minWidth = 130;
        this.cropperSettings.minHeight = 130;

        this.cropperSettings.rounded = true;

        this.cropperSettings.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
        this.cropperSettings.cropperDrawSettings.strokeWidth = 1;

        this.data = {};
    }

    ngOnInit() {
        this.cropLogoRef.nativeElement.style.display = 'none';
        // if (this.cropperSrc) {
        //   this.cropper.setImage(this.cropperSrc);
        // }
    }

    ngOnChanges(changes: SimpleChanges) {
        const cropperSrc: SimpleChange = changes.cropperSrc;
        if (cropperSrc.currentValue) {
            this.fileRef.nativeElement.value = '';
            this.cropper.setImage(cropperSrc.currentValue);
        }

    }

    onEditLogoPhoto($event) {
        const image: any = new Image();
        const file: File = $event.target.files[0];
        const myReader: FileReader = new FileReader();
        const that = this;
        myReader.onloadend = function (loadEvent: any) {
            image.src = loadEvent.target.result;
            that.cropLogoRef.nativeElement.style.display = 'block';
            that.cropper.setImage(image);
        };
        myReader.readAsDataURL(file);
        $event.target.value = ''
    }

    cropped(bounds: Bounds) {
        //console.log(this.data);
    }

    fileChangeListener($event) {
        const image: any = new Image();
        const file: File = $event.target.files[0];
        const myReader: FileReader = new FileReader();
        const that = this;
        myReader.onloadend = function (loadEvent: any) {
            image.src = loadEvent.target.result;
            that.cropper.setImage(image);
        };

        myReader.readAsDataURL(file);
    }

    onCloseModal() {
        this.cropLogoRef.nativeElement.style.display = 'none';
        this.cropper.reset();
        this.fileRef.nativeElement.value = null;
    }

    onSave() {
        this.onCropped.emit(this.data.image);
        this.cropper.reset();
        this.cropLogoRef.nativeElement.style.display = 'none';
    }
}
