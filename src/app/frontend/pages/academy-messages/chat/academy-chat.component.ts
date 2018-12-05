import {
    Component, OnInit, OnDestroy, Input, ElementRef, ViewChild, HostListener,
    AfterViewChecked
} from '@angular/core';
import {SocketService} from '../../../../services/socket.service';
import {AcademyMessagesService} from '../academy-messages.service';
import {Subject} from 'rxjs/Subject';
import {ConfigService} from '../../../../services/service.config';

@Component({
    selector: 'app-academy-chat',
    templateUrl: './academy-chat.component.html',
    styleUrls: ['./academy-chat.component.scss'],
})
export class AcademyChatComponent implements OnInit, AfterViewChecked {
    public user: any;
    public me;
    public dialog;
    public isLoading: boolean = false;
    public messages = [];
    public skip = 1;
    public limit = 20;
    public disableScrollDown = false;
    public isAllMessages = false;
    public isLoadingNewMessages;
    public previousClientHeight;
    public baseUrl;
    public noImg = '/assets/images/user-dafault.png';
    @Input() public activeDialog: Subject<any>;
    @ViewChild('scrollMe') public myScrollContainer: ElementRef;
    @ViewChild('elMsg') public elMsg: ElementRef;

    constructor(private socketService: SocketService,
                private academyMessagesService: AcademyMessagesService) {
        this.baseUrl = ConfigService.URL_SERVER;
        this.me = JSON.parse(localStorage.getItem('user'));
        // this.socketService.onGetMessages()
        //     .subscribe((data) => {
        //         if(data.conversation_id == this.dialog.id) {
        //             this.messages.push(data);
        //             this.disableScrollDown = false;
        //         }
        //     }, (error) => {
        //         console.log('Error', error);
        //     }, () => {
        //         console.log('complete');
        //     });
    }

    public ngOnInit() {
        this.resetChat();
        this.activeDialog.subscribe((dialog) => {
            if (dialog) {
                this.resetChat();
                this.dialog = dialog;
                if (this.dialog['users']) {
                    this.user = this.dialog.users.find((el) => {
                        return el.user_id != this.me.id;
                    });
                }
                if (this.user && this.user['user']) {
                    this.user = this.user.user;
                }
                console.log(this.dialog);
                this.getMessage(this.dialog.id, this.skip, this.limit);
            }
        });

    }

    public resetChat() {
        this.isAllMessages = false;
        this.messages = [];
        this.skip = 1;
        this.disableScrollDown = false;
    }

    public getMessage(id, skip, limit) {
        this.isLoading = true;
        this.academyMessagesService.getMessagesById(id, skip, limit)
            .then((res) => {
                this.messages.unshift(...res.data.reverse());
                this.isAllMessages = res.total <= res.data.length + res.skip;
                if (!this.isAllMessages) {
                    this.skip++;
                }

                if (this.isLoadingNewMessages) {
                    this.myScrollContainer.nativeElement
                        .scrollTop = this.myScrollContainer.nativeElement.scrollHeight - this.previousClientHeight;
                }
                this.isLoadingNewMessages = false;
                this.isLoading = false;

            }, (err) => {
                console.log(err);
                this.isLoading = false;
            })
    }

    public ngOnDestroy() {
        this.activeDialog.unsubscribe();
    }


    public ngAfterViewChecked() {
        if (!this.disableScrollDown) {
            this.scrollToBottom();
        }
    }

    public sendMessage(msg) {
        if (msg.trim()) {
            let userSendDataTo = this.dialog.users[0].user;
            let data = {
                user_id: userSendDataTo.id,
                academy_id: this.dialog.academy_id,
                content: msg
            };
            if (this.dialog.users[0].conversation_id) {
                data['conversation_id'] = this.dialog.users[0].conversation_id;
            }
            console.log('message Data', data);
            this.academyMessagesService.sendMessage(data)
                .then((res) => {
                    this.elMsg.nativeElement.value = '';
                    if (res.conversation_id == this.dialog.id) {
                        this.messages.push(res);
                        this.disableScrollDown = false;
                    }
                }, (err) => {
                    console.log(err);
                })
        }
    }

    @HostListener('scroll', ['$event'])
    public checkScrollTop(event): void {
        const scrollHeight = event.target.scrollHeight;
        const dist = event.target.scrollTop;
        this.previousClientHeight = scrollHeight;
        if (dist === 0 && !this.isAllMessages) {
            this.isLoadingNewMessages = true;
            this.getMessage(this.dialog.id, this.skip, this.limit);
        }
    }

    @HostListener('scroll', ['$event'])
    public disableInitScrollBottom(event): void {
        if  (event.target.scrollTop > 0){
            const scrollHeight = event.target.scrollHeight;
            const clientHeight = event.srcElement.clientHeight;
            const scrolled = Math.ceil(event.target.scrollTop);
            if (scrollHeight - clientHeight <= scrolled) {
                this.disableScrollDown = true;
            }
        }

    }

    public scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) {
        }
    }

}
