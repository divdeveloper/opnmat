import {Component, OnInit, EventEmitter, Input, Output, ViewChild, ElementRef} from '@angular/core';
import {SocketService} from '../../../services/socket.service';
import {AcademyMessagesService} from './academy-messages.service';
import {ConfigService} from '../../../services/service.config';

import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import {UsersService} from '../../../services/users.service';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'opn-academy-messages-page',
    templateUrl: './academy-messages.component.html',
    styleUrls: ['./academy-messages.component.scss'],
})

export class AcademyMessagesComponent implements OnInit {
    public dialogs = [];
    public isDialog = 0;
    public baseUrl;
    public isLoading: boolean = false;
    public noImg = '/assets/images/user-dafault.png';
    public me;
    academyId;
    activeDialogId;
    isManager = false;
    public listSearch: Array<any> = [];
    public activeDialog: Subject<any> = new Subject();
    @ViewChild('search') public inputSearch: ElementRef;
    private subjectSearch: Subject<string> = new Subject();

    constructor(private socketService: SocketService,
                private activatedRoute: ActivatedRoute,
                private academyMessagesService: AcademyMessagesService,
                private usersService: UsersService) {
        this.usersService.getUserMe().subscribe(user => {
                this.me = user;
                this.subjectSearch.debounceTime(500)
                    .subscribe((searchValue) => {
                        this.searchUsers(searchValue);
                    });

                this.socketService.onGetMessages()
                    .subscribe((data) => {
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
                            if (data.user.id == this.me.id) {
                                this.dialogs.unshift(data);
                            }
                        }
                    }, (error) => {
                        console.log('Error', error);
                    });
            }
        );
    };

    public ngOnInit() {
        this.activatedRoute.params.subscribe(params => {
            this.academyId = params['id'];
            this.getDialogs(this.academyId);
        });
        this.baseUrl = ConfigService.URL_SERVER;
    }

    public getDialogs(academyId) {
        this.isLoading = true;
        this.academyMessagesService.getDialogs(academyId)
            .then((res) => {
                this.dialogs = res.data;
                console.log(res.data);
                if (this.dialogs.length) {
                    this.activeDialog.next(this.dialogs[0]);
                    this.activeDialogId = this.dialogs[0].id;
                    this.isDialog = this.dialogs[0];
                }
                this.isLoading = false;
            }, (err) => {
                console.log(err);
                this.isLoading = false;
            })
    }

    public onChangeDialog(dialog) {
        this.activeDialogId = dialog.id;
        this.activeDialog.next(dialog);
        this.isDialog = dialog;
        this.academyMessagesService.setViewsMessages(dialog.id)
            .then((res) => {
                console.log(res);
            }, (error) => {
                console.log(error);
            });
    }

    public toChat(user) {
        const data = {
            'user_id': user.id
        };
        this.inputSearch.nativeElement.value = '';
        this.listSearch = [];
        this.academyMessagesService.getConversation(data)
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

    public onSearch(value: string) {
        this.subjectSearch.next(value);
    }

    public searchUsers(value: string) {
        if (value.trim()) {
            this.academyMessagesService.getUsersWithoutMe(value.trim(), this.me.id)
                .then((res) => {
                    this.listSearch = res.data;
                }, (err) => {
                    console.log(err);
                })
        } else {
            this.listSearch = [];
        }
    }

    onCheckManager(status) {
        this.isManager = status;
    }
}
