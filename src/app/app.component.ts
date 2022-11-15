import {Component, OnInit} from '@angular/core';
import {GlobalDataService} from "./shared/services/global-data.service";
import {Router} from "@angular/router";
import {AuthService} from "./shared/services/auth.service";
import {NotificationService} from "./shared/services/notification.service";
import {User} from "./shared/model/user.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'user-management';

  user: User = {} as User;
  loading: boolean = false;
  loggedIn: boolean = false;
  constructor(private globalDataService: GlobalDataService, private router: Router, private authService: AuthService, private snackMessage: NotificationService) {

  }

  logout(){
    this.authService.logOut();
    this.router.navigate(['/page/login']);
  }

  ngOnInit() {
    this.loading = true;
    this.authService.getCurrentUser().then((res: any) => {
      this.loading = false;
      if(res != null && res.error != null){
        this.router.navigate(['/page/login']);
        this.snackMessage.show({
          message: res.error?.message || 'Failed to login',
        });
        return;
      }
      this.loggedIn = true;
      this.user = res.data;
      this.globalDataService.currentUser$.next(this.user)
    }, error => {
      this.loading = false;
      this.loggedIn = false;
      this.globalDataService.currentUser$.next(null)
    });

    this.globalDataService.currentUser$.subscribe(data=>{
      if(data){
        this.loggedIn = true;
      }else{
        this.loggedIn = false;
      }
    })
  }
}
