import { Component, OnInit, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { SocketService } from '../../../services/socket.service';
import { MessagePageService } from './message-page.service';
import { ConfigService } from '../../../services/service.config';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import {UsersService} from '../../../services/users.service';

@Component({
    selector: 'opn-message-page',
    templateUrl: './message-page.component.html',
    styleUrls: ['./message-page.component.scss'],
})

export class MessagePageComponent implements OnInit {
    public dialogs = [];
    public isDialog = 0;
    public baseUrl;
    public isLoading: boolean = false;
    public noImg = '/assets/images/user-dafault.png';
    public me;
    public listSearch: Array<any> = [];
    public activeDialog: Subject<any> = new Subject();
    @ViewChild('search') public inputSearch: ElementRef;
    private subjectSearch: Subject<string> = new Subject();

    constructor(private socketService: SocketService,
                private messagePageService: MessagePageService,
                private usersService: UsersService) {
        this.usersService.getUserMe().subscribe(user=>{
          this.me = user;
        });
        this.subjectSearch.debounceTime(500)
            .subscribe( (searchValue) => {
                this.searchUsers(searchValue) ;
            });

        this.socketService.onGetMessages()
            .subscribe((data) => {
                if(data.user.id == this.me.id || data.sender_id == this.me.id){
                    let element = this.dialogs.find((el) => {
                        return el.id == data.conversation_id;
                    });
                    const index = this.dialogs.indexOf(element);
                    let newDialog;
                    if (index !== -1) {
                        if (this.dialogs[index].last_message) {
                            this.dialogs[index].last_message.content = data.content;
                        }
                        newDialog = this.dialogs[index];
                        this.dialogs = this.dialogs.filter((el) => {
                            return el.id != data.conversation_id;
                        });
                        this.dialogs.unshift(newDialog);
                    } else {
                        const newData = {
                            id: data.conversation_id,
                            updated_at: data.updated_at,
                            users: [
                                {
                                    user: data.user,
                                    user_id: data.user_sender
                                },
                                {
                                    user: data.user_sender,
                                    user_id: data.user
                                },
                            ],
                            last_message: {
                                conversation_id : data.id,
                                sender_id: data.user_sender.id,
                                user_id: data.user.id,
                                content: data.content
                            }
                        };
                        this.dialogs.unshift(newData);
                        this.onChangeDialog(newData);
                    }
                }
            }, (error) => {
                console.log('Error',error);
            });
    }

    public ngOnInit() {
        this.baseUrl = ConfigService.URL_SERVER;
        this.getDialogs();
    }

    public getDialogs(){
        this.isLoading = true;
        this.messagePageService.getDialogs()
            .then((res) => {
                this.dialogs = res.data;
                if(this.dialogs.length) {
                    this.activeDialog.next(this.dialogs[0]);
                    this.isDialog = this.dialogs[0];
                }
                this.isLoading = false;
            }, (err)=> {
                console.log(err);
                this.isLoading = false;
            })
    }

    public onChangeDialog(dialog) {
        this.activeDialog.next(dialog);
        this.isDialog = dialog;
        this.messagePageService.setViewsMessages(dialog.id)
            .then((res) => {
                console.log(res);
            }, (error) => {
                console.log(error);
            });
    }

    public toChat(user){
        const data = {
            "user_id": user.id
        };
        this.inputSearch.nativeElement.value = '';
        this.listSearch = [];
        this.messagePageService.getConversation(data)
            .then((res) => {
                let dialog = res;
                const index = this.dialogs.filter((el) => {
                    return el.id == res.id
                });
                if (!index.length) {
                    this.dialogs.unshift(dialog);
                }
                this.isDialog = dialog.id;
                this.onChangeDialog(dialog);
            }, (err) => {
                console.log(err);
            })
    }

    public onSearch (value: string) {
        this.subjectSearch.next(value);
    }

    public searchUsers (value: string) {
        if(value.trim()) {
            this.messagePageService.getUsersWithoutMe(value.trim(), this.me.id)
                .then((res) => {
                    this.listSearch = res.data;
                }, (err) => {
                    console.log(err);
                })
        } else {
            this.listSearch = [];
        }
    }
}
