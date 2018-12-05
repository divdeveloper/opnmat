import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {ConfigService} from '../../../../services/service.config';
import {SocketService} from '../../../../services/socket.service';
import {UsersService} from '../../../../services/users.service';

@Component({
    selector: 'app-academy-dialog',
    templateUrl: './academy-dialog.component.html',
    styleUrls: ['./academy-dialog.component.scss']
})
export class AcademyDialogComponent implements OnInit, OnDestroy {
    @Input() public dialog;
    public noImg = '/assets/images/user-dafault.png';
    public baseUrl;
    public active: boolean = false;
    public me;
    public user;
    public userOnline;
    public sub;
    public sub1;

    constructor(private socketService: SocketService,
                private usersService: UsersService) {
        this.baseUrl = ConfigService.URL_SERVER;
        this.sub = this.socketService.getOnline()
            .subscribe((data) => {
                if (this.user) {
                    this.userOnline = data.id && data.id == this.user.id;
                }
            }, (error) => {
                console.log('Error', error);
            });
        this.sub1 = this.socketService.getOffline()
            .subscribe((data) => {
                if (this.user) {
                    this.userOnline = !data.id && data.id == this.user.id;
                }
            }, (error) => {
                console.log('Error', error);
            });
    }

    ngOnInit() {
        this.usersService.getUserMe().subscribe(currentUser => {
            this.me = currentUser;
            if (this.dialog.last_message) {
                this.user = this.dialog.users[0].user;
                this.userOnline = this.user ? this.user['online'] : false;
            }
        });
    }

    ngOnDestroy() {
        // this.sub.unsubscribe();
        // this.sub1.unsubscribe();
    }
}
