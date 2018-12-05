import { Component, OnInit, OnDestroy, Input, ElementRef, ViewChild, HostListener,
    AfterViewChecked } from '@angular/core';
import { MessagePageService } from '../../../../message/message-page.service';
import { ConfigService } from '../../../../../../services/service.config';
import { SocketService } from '../../../../../../services/socket.service';

@Component({
  selector: 'right-app-chat-academy',
  templateUrl: './right-chat-academy.component.html',
  styleUrls: ['./right-chat-academy.component.scss'],
  providers: [ ConfigService, MessagePageService ]
})
export class RightChatAcademyComponent implements OnInit, AfterViewChecked {
    public user;
    public userMy;
    public isLoading: boolean = false;
    public messages = [];
    public skip = 1;
    public limit = 20;
    public disableScrollDown = false;
    public isAllMessages = false;
    public isLoadingNewMessages;
    public previousClientHeight;
    public baseUrl;
    public userOnline;
    public noImg = '/assets/images/user-dafault.png';
    public sub;
    public sub1;
    @Input() public dialog;
    @Input() public chatAcademyId;
    @Input() public typeAcademyChat;
    @ViewChild('scrollMe') public myScrollContainer: ElementRef;
    @ViewChild('elMsg') public elMsg: ElementRef;

    constructor(private socketService: SocketService,
                private messagePageService: MessagePageService) {
        this.baseUrl = ConfigService.URL_SERVER;
        this.userMy = JSON.parse(localStorage.getItem('user'));
        this.socketService.onGetMessages()
            .subscribe((data) => {
                console.log('this.dialog', this.dialog);
                console.log('new-message', data);
                if(data.conversation_id == this.dialog.id) {
                    this.messages.push(data);
                    this.disableScrollDown = false;
                }
            }, (error) => {
                console.log('Error', error);
            });
    }

    public ngOnInit() {
        if(this.dialog) {
            if (this.dialog['last_message']) {
                this.messagePageService.setViewsMessages(this.dialog.last_message.conversation_id)
                    .then((res) => {
                        console.log(res);
                    }, (error) => {
                        console.log(error);
                    });
            }
            this.resetChat();
            /*this.user = this.dialog.users.find((el) => {
                return el.user_id != this.me.id;
            });
            if(this.user['user']){
                this.user = this.user.user;
            }
            this.getMessage(this.dialog.id, this.skip, this.limit);*/

            if(this.dialog['users']){
                this.user = this.dialog.users.find((el) => {
                    return el.user_id != this.userMy.id;
                });
                console.log('user', this.user);
            }
            if(this.user['user']){
                this.user = this.user.user;
                console.log('user', this.user);
            }
            this.userOnline = this.user['online'];

            if(this.chatAcademyId && this.typeAcademyChat == 'user'){
                this.user = this.dialog.academy;
                console.log('this.user- ', this.user);
            }
            this.getMessage(this.dialog.id, this.skip, this.limit);
            this.sub = this.socketService.getOnline()
                .subscribe((data) => {
                    console.log('user online', data);
                    console.log(this.user.id);
                    this.userOnline = data.id && data.id == this.user.id;
                }, (error) => {
                    console.log('Error',error);
                });
            this.sub1 = this.socketService.getOffline()
                .subscribe((data) => {
                    console.log('user offline', data);
                    console.log(this.user.id);
                    this.userOnline = data.id && data.id == this.user.id;
                }, (error) => {
                    console.log('Error',error);
                });
            console.log('user', this.user);
        } else {
            this.user = this.dialog;
            console.log('user', this.user);
        }
    }

    public resetChat(){
        this.isAllMessages = false;
        this.messages =[];
        this.skip = 1;
        this.previousClientHeight = '';
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
    }


    public ngAfterViewChecked() {
        if (!this.disableScrollDown) {
            this.scrollToBottom();
        }
    }

    public sendMessage(msg){
        if(msg.trim()){
            let data = {
                content: msg,
                user_id: 0
            };
            console.log(this.user);
            if (!this.chatAcademyId) {
                data['user_id'] = this.user.user ? this.user.user.id : this.user.id;

                if(this.user.conversation_id){
                    data['conversation_id'] = this.user.conversation_id;
                }
            } else {
                data['academy_id'] = this.user.id;
                data['conversation_id'] = this.dialog.id;
            }
            console.log('before send', data);
            this.messagePageService.sendMessage(data)
                .then((res) => {
                    this.elMsg.nativeElement.value = '';
                }, (err) => {
                    console.log(err);
                    this.elMsg.nativeElement.value = '';
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
        const scrollHeight = event.target.scrollHeight;
        const clientHeight = event.srcElement.clientHeight;
        const scrolled = Math.ceil(event.target.scrollTop);
        if (scrollHeight - clientHeight <= scrolled) {
            this.disableScrollDown = true;
        }
    }

    public scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) { }
    }

}
