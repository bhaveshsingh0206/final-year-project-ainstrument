import { Component, OnInit, ElementRef } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  constructor(
    public authService: AuthService,
    public router: Router,

    public el: ElementRef
  ) {}

  ngOnInit() {}

  onLogoutClick(): boolean {
    // this.chatService.disconnect();
    this.authService.logout();
    this.router.navigate(["/login"]);
    this.onNavigate();
    return false;
  }

  onNavigate(): void {
    this.collaspseNav();
  }

  collaspseNav(): void {
    let butt = this.el.nativeElement.querySelector(".navbar-toggle");
    let isCollapsed = this.hasClass(butt, "collapsed");
    if (isCollapsed == false) {
      butt.click();
    }
  }

  hasClass(element, cls) {
    return (" " + element.className + " ").indexOf(" " + cls + " ") > -1;
  }

  // active(event) {
  //   var active = document.getElementsByClassName("activated")[0];
  //   if (!event.target.classList.contains("activated")) {
  //     event.target.classList.toggle("activated");
  //     active.classList.toggle("activated");
  //   }
  // }
}
