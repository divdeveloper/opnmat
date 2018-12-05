import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    ViewChild,
    ElementRef,
} from '@angular/core';
import {
    PostService,
} from '../../../../../services/posts.service';
import {
    AcademiesService,
} from '../../../../../services/academies.service';
import {
    Observable,
} from 'rxjs/Observable';

@Component({
    selector: 'opn-new-post-form',
    templateUrl: './new-post.component.html',
    styleUrls: ['./new-post.component.scss'],
    providers: [AcademiesService],
})
export class NewPostFormComponent implements OnInit {
    _photos: Array < any > = [];
    _video: any = [];
    imagesSrc: any = [];
    videoSrc: String = '';

    private saveStatus: Boolean = false;
    private visibility: Boolean = false;
    private userAvatar: any;
    private emptyData: Boolean = true;
    private postTmp: any = {};
    private userProfile: any = {};

    @Input() academyId: String;

    @Output()
    postAdded: EventEmitter < any > = new EventEmitter < any > ();

    @ViewChild('photosInput', {
        read: ElementRef
    }) photosInput: ElementRef;
    @ViewChild('videoInput', {
        read: ElementRef
    }) videoInput: ElementRef;
    @ViewChild('description', {
        read: ElementRef
    }) description: ElementRef;

    constructor(private postService: PostService, private academyService: AcademiesService) {}

    ngOnInit() {
        console.log(this.academyId);
        if (this.academyId) {
            this.academyService.getAcademyById(this.academyId).subscribe(res => {
                this.userAvatar = res.photo;
            });
        } else {
            this.postService.getUser().subscribe(res => {
                this.userAvatar = res.avatar;
                this.userProfile = res;
            });
        }
    }


    InputChangeVideo(e) {
        const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];

        if (file.size > 314572800) {
            alert('Video exceeds the allowable size of 300 mb');
            return;
        }
        this._video = file;
        this.videoSrc = file.name;
        this.checkEmptyData();
    }

    InputChangePhoto(e) {
        const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;

        if (files.length > 3 || (files.length + this._photos.length) > 3) {
            alert("Maximum number of images exceeded, no more than 3 pictures");
            return;
        }
        for (let i = 0; i < files.length; i++) {
            let reader = new FileReader();
            reader.onload = this._ReaderLoadedPhoto.bind(this, files.item(i).name);

            reader.readAsDataURL(files.item(i));
            this._photos.push(files.item(i));
        }
        this.checkEmptyData();
    }

    _ReaderLoadedPhoto(name, e) {
        const reader = e.target;
        this.imagesSrc.push({
            name: name,
            src: reader.result
        });
    }


    onRemovePhoto(e, n) {
        this.photosInput.nativeElement.value = '';
        const tpmImages = [];
        this.imagesSrc = [];
        for (let i = 0; i < this._photos.length; i++) {
            if (this._photos[i].name === n) {
                continue;
            }
            let reader = new FileReader();
            reader.onload = this._ReaderLoadedPhoto.bind(this, this._photos[i].name);

            reader.readAsDataURL(this._photos[i]);
            tpmImages.push(this._photos[i]);
        }
        this._photos = tpmImages;
        this.checkEmptyData();
    }
    onRemoveVideo() {
        this.videoInput.nativeElement.value = '';
        this.videoSrc = '';
        this.checkEmptyData();
    }

    onChangeVisibility(val) {
        this.visibility = val;
    }

    savePhotos(photos, postId): Observable < any > {
        let formData = new FormData();
        for (let file of photos) {
            formData.append('photos', file, file.name);
        }
        return this.postService.saveFilesPost(formData, postId);
    }
    saveVideo(video, postId): Observable < any > {
        let formData = new FormData();
        formData.append('videos', video, video.name);
        return this.postService.saveFilesPost(formData, postId);
    }

    checkEmptyData() {
        if (this.videoSrc != '' || this._photos.length > 0 || this.description.nativeElement.value != '') {
            this.emptyData = false;
        } else {
            this.emptyData = true;
        }
    }

    clearForm() {
        this._photos = [];
        this._video = [];
        this.imagesSrc = [];
        this.videoSrc = '';
        this.videoInput.nativeElement.value = '';
        this.photosInput.nativeElement.value = '';
        this.description.nativeElement.value = '';
    }

    onCreatePost(event) {
        this.saveStatus = true;
        this.postService.createPost({
            title: 'title',
            content: this.description.nativeElement.value,
            public: true,
            share_from: this.visibility,
            academy_id: (this.academyId) ? this.academyId : 0,
        }).subscribe(res => {

            if (res.status) {
                res.post.user = this.userProfile;
                res.post.is_like = false;
                if (this._photos.length == 0 && this._video.length == 0) {
                    this.postAdded.emit(res.post);
                    this.clearForm();
                    this.checkEmptyData();
                    this.saveStatus = false;
                } else {
                    this.saveFiles(res.post);
                }
            }
        });
    }
    saveFiles(post) {
        let savePgotos = true;
        if (this._photos.length > 0) {
            savePgotos = false;
            this.savePhotos(this._photos, post.id).subscribe(photos => {
                if (photos.status) {
                    savePgotos = true;
                    post.files = photos.files;

                    if (this._video.length == 0) {
                        this.postAdded.emit(post);
                        this.clearForm();
                        this.checkEmptyData();
                        this.saveStatus = false;
                    }else {
                        this.afterSavePost(post);
                    }
                }
            });
        }
        if (savePgotos) {
            this.afterSavePost(post);
        }
    }
    afterSavePost(post) {
        if (this._video !== [] && this._video.name) {
            this.saveVideo(this._video, post.id).subscribe(video => {
                if (post.files && post.files.length > 0) {
                    post.files.push(video.files[0]);
                } else {
                    post.files = video.files;
                }
                this.postAdded.emit(post);
                this.clearForm();
                this.checkEmptyData();
                this.saveStatus = false;
            });
        }
    }
    onEditText(inputText) {
        this.checkEmptyData();
    }
}
