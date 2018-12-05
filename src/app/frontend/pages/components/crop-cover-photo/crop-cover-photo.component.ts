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
} from '@angular/core';
import {
    ImageCropperComponent,
    CropperSettings,
    Bounds,
} from 'ng2-img-cropper';
import {
    AcademiesService,
} from '../../../../services/academies.service';
import {
    ProfileService,
} from '../../../../services/profile.service';


@Component({
    selector: 'opn-crop-cover-photo',
    templateUrl: './crop-cover-photo.component.html',
    styleUrls: ['./crop-cover-photo.component.scss'],
})
export class CropCoverPhotoComponent implements OnInit, OnChanges {

    data: any;
    cropperSettings: CropperSettings;
    @ViewChild('cropper', undefined) cropper: ImageCropperComponent;

    @Input() academyId?: any;
    @Input() cropperSrc: any;
    @Input() profileId?: any;
    @Output() saveCover: EventEmitter<any> = new EventEmitter<any>();
    @Output() closeModel: EventEmitter<any> = new EventEmitter<any>();

    constructor(private academyService: AcademiesService,
                private profileService: ProfileService,) {
        this.cropperSettings = new CropperSettings();
        this.cropperSettings.width = 1132;
        this.cropperSettings.height = 320;
        this.cropperSettings.keepAspect = false;
        this.cropperSettings.noFileInput = true;
        this.cropperSettings.preserveSize = false;
        this.cropperSettings.croppingClass = 'hiden';

        this.cropperSettings.croppedWidth = 1132;
        this.cropperSettings.croppedHeight = 320;

        this.cropperSettings.canvasWidth = 900;
        this.cropperSettings.canvasHeight = 300;

        this.cropperSettings.minWidth = 900;
        this.cropperSettings.minHeight = 300;

        this.cropperSettings.rounded = false;

        this.cropperSettings.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
        this.cropperSettings.cropperDrawSettings.strokeWidth = 1;

        this.data = {};
    }

    ngOnInit() {
        if (this.cropperSrc) {
            this.cropper.setImage(this.cropperSrc);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        const cropperSrc: SimpleChange = changes.cropperSrc;
        if (cropperSrc.currentValue) {
            this.cropper.setImage(cropperSrc.currentValue);
        }

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
        this.closeModel.emit();
    }

    onSave() {
        if (this.academyId) {
            this.academyService.editAcademyById(this.academyId, {
                cover_photo_base: this.data.image,
            }).subscribe(res => {
                if (res.cover_photo) {
                    this.saveCover.emit(res);
                }
            });
        }
        if (this.profileId) {
            this.profileService.updateUserById(this.profileId, {
                cover_photo_base: this.data.image,
            }).subscribe(res => {
                if (res.cover_photo) {
                    this.saveCover.emit(res);
                }
            });
        }
    }
}
