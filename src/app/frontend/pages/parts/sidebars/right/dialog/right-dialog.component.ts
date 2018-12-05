import {Component, OnInit, Input} from '@angular/core';
import {ConfigService} from '../../../../../../services/service.config';
import {SocketService} from '../../../../../../services/socket.service';
import {UsersService} from '../../../../../../services/users.service';

@Component({
    selector: 'right-app-dialog',
    templateUrl: './right-dialog.component.html',
    styleUrls: ['./right-dialog.component.scss'],
    providers: [ConfigService, UsersService]
})
export class RightDialogComponent implements OnInit {
    @Input() public dialog;
    @Input() public isActive;
    public noImg = '/assets/images/user-dafault.png';
    public baseUrl;
    public active: boolean = false;
    public me;
    public user;
    public academy;
    public userOnline;
    public sub;
    public sub1;

    constructor(private socketService: SocketService,
                private usersService: UsersService) {
        this.baseUrl = ConfigService.URL_SERVER;
    }

    ngOnInit() {
        this.usersService.getUserMe().subscribe(currentUser => {
            this.me = currentUser;
            if (this.dialog.academy_id != null) {
                this.academy = this.dialog.academy;
            } else {
                this.configureSockets();
                this.user = this.dialog.users.find(el => {
                    return el.user_id !== currentUser.id
                }).user;
                this.userOnline = this.user ? this.user['online'] : false;
            }
        });
    }

    private configureSockets() {
        this.sub = this.socketService.getOnline()
            .subscribe((data) => {
                if (data.id && data.id == this.user.id) {
                    this.userOnline = true;
                }
            }, (error) => {
                console.log('Error', error);
            });
        this.sub1 = this.socketService.getOffline()
            .subscribe((data) => {
                if (data.id && data.id == this.user.id) {
                    this.userOnline = false;
                }
            }, (error) => {
                console.log('Error', error);
            });
    }
}
