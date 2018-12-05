import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ConfigService } from '../../../../services/service.config';
import { SocketService } from '../../../../services/socket.service';

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit, OnDestroy {
    @Input() public dialog;
    public noImg = '/assets/images/user-dafault.png';
    public baseUrl;
    public active:boolean = false;
    public my;
    public user;
    public userOnline;
    public sub;
    public sub1;
    @Input() public isDialog;

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
                    this.userOnline = !data.id && data.id == this.user.id;
                }
            }, (error) => {
                console.log('Error',error);
            });
    }

    ngOnInit() {
        if(this.dialog.users){
            const findUser = this.dialog.users.find((el) => {
                return el.user_id != this.my.id;
            });
            this.user = (findUser) ? findUser.user : null;
            this.userOnline = this.user ? this.user['online'] : false;
        } else {
            this.user = this.dialog.user;
            this.userOnline = this.dialog.user['online'];
        }
    }

    ngOnDestroy () {
        // this.sub.unsubscribe();
        // this.sub1.unsubscribe();
    }
}
