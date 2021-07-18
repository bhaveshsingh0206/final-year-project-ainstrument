import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  constructor(public authService: AuthService, public router: Router) {}

  ngOnInit() {
    setTimeout(() => {
      this.router.navigate(["/login"]);
    }, 4500);
  }
}
