import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { FlashMessagesService } from "angular2-flash-messages";
import { ViewEncapsulation } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { InstrumentService } from "../../services/instrument.service";
import * as $ from "jquery";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public authService: AuthService,
    public router: Router,
    public flashMessagesService: FlashMessagesService,
    public instrumentService: InstrumentService
  ) {}

  ngOnInit() {
    this.checkLoggedIn();
    this.loginForm = this.formBuilder.group({
      //controlname: ['initial value', rules]
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  checkLoggedIn(): void {
    if (this.authService.loggedIn()) {
      this.router.navigate(["/dashboard"]);
    }
  }

  onLoginSubmit(): void {
    $("#loader").toggleClass("none");
    $("#loginContainer").toggleClass("none");
    this.authService
      .authenticateUser(this.loginForm.value)
      .subscribe((dataFile) => {
        console.log("DATA", dataFile);
        if (dataFile.success == true) {
          this.authService.storeUserData(
            dataFile.data.token,
            dataFile.data.email
          );
          this.router.navigate(["/dashboard"]);
        } else {
          if (dataFile.message == "INVALID_PASSWORD")
            $("#error span").text("Incorrect Password");
          $("#loader").toggleClass("none");
          $("#loginContainer").toggleClass("none");
        }
      });
  }
}
