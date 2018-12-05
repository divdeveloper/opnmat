import { Component, OnInit, Input } from '@angular/core';
import { ConfigService } from '../../../../../../services/service.config';
import { SocketService } from '../../../../../../services/socket.service';

@Component({
    selector: 'right-app-dialog-academy',
    templateUrl: './right-dialog-academy.component.html',
    styleUrls: ['./right-dialog-academy.component.scss'],
    providers: [ ConfigService ]
})
export class RightDialogAcademyComponent implements OnInit {
    @Input() public dialog;
    @Input() public isActive;
    @Input() public chatAcademyId;
    @Input() public typeChat;
    @Input() public typeAcademyChat;
    public noImg = '/assets/images/user-dafault.png';
    public baseUrl;
    public active:boolean = false;
    public my;
    public user;
    public userOnline;
    public sub;
    public sub1;

    constructor(private socketService: SocketService) {
        this.baseUrl = ConfigService.URL_SERVER;
        this.my = JSON.parse(localStorage.getItem('user'));
        this.sub = this.socketService.getOnline()
            .subscribe((data) => {
                if(this.user){
                    this.userOnline = data.id && data.id == this.user.id;
                }
            }, (error) => {
                console.log('Error',error);
            });
        this.sub1 = this.socketService.getOffline()
            .subscribe((data) => {
                if(this.user) {
                    this.userOnline = data.id && data.id == this.user.id;
                }
            }, (error) => {
                console.log('Error',error);
            });
    }

    ngOnInit() {
        if (this.typeAcademyChat == 'user') {
            this.user = this.dialog.academy;
        } else {
            this.user = this.dialog.users.find((el) => {
                return el.user_id != this.my.id;
            }).user;
            this.userOnline = this.user ? this.user['online'] : false;
        }
    }
}
