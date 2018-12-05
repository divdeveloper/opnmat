import { Component, OnInit, OnDestroy, Input, ElementRef, ViewChild, HostListener,
    AfterViewChecked } from '@angular/core';
import { SocketService } from '../../../../services/socket.service';
import { MessagePageService } from '../message-page.service';
import { Subject } from 'rxjs/Subject';
import { ConfigService } from '../../../../services/service.config';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, AfterViewChecked {
    public user:any;
    public userMy;
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
                private messagePageService: MessagePageService) {
        this.baseUrl = ConfigService.URL_SERVER;
        this.userMy = JSON.parse(localStorage.getItem('user'));
        this.socketService.onGetMessages()
            .subscribe((data) => {
                if(data.conversation_id == this.dialog.id) {
                    this.messages.push(data);
                    this.disableScrollDown = false;
                }
            }, (error) => {
                console.log('Error', error);
            }, () => {
                console.log('complete');
            });
    }

    public ngOnInit() {
        let i = 0;
        this.activeDialog.subscribe( (dialog) => {
            if(dialog){
                this.resetChat();
                this.dialog = dialog;
                if(this.dialog['users']){
                    this.user = this.dialog.users.find((el) => {
                        return el.user_id != this.userMy.id;
                    });
                }
                if(this.user && this.user['user']){
                    this.user = this.user.user;
                }
                this.messages = [];
                this.getMessage(this.dialog.id, this.skip, this.limit);
            }
        });
    }

    public resetChat(){
        this.isAllMessages = false;
        this.messages = [];
        this.skip = 1;
        this.disableScrollDown = false;
    }

    public getMessage(id, skip, limit){
        this.isLoading = true;
        this.messagePageService.getMessagesById(id, skip, limit)
            .then((res) => {
                this.messages.unshift(...res.data.reverse());
                this.isAllMessages = res.total <=  res.data.length + res.skip;
                if(!this.isAllMessages){
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

    public sendMessage(msg){
        if(msg.trim()){
            let data = {
                user_id: this.user.user ? this.user.user.id : this.user.id,
                content: msg
            };
            if(this.user.conversation_id){
                data['conversation_id'] = this.user.conversation_id;
            }
            this.messagePageService.sendMessage(data)
                .then((res) => {
                    this.elMsg.nativeElement.value = '';
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
            console.log('scroll to new messages');
        }
    }

    @HostListener('scroll', ['$event'])
    public disableInitScrollBottom(event): void {
        if  (event.target.scrollTop > 0) {
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
        } catch (err) { }
    }

}
