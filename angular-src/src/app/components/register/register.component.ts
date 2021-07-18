import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { FlashMessagesService } from "angular2-flash-messages";
import { Router } from "@angular/router";
import { ViewEncapsulation } from "@angular/core";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public flashMessagesService: FlashMessagesService,
    public authService: AuthService,
    public router: Router
  ) {}

  ngOnInit() {
    this.checkLoggedIn();
    this.registerForm = this.formBuilder.group({
      //controlname: ['initial value', rules]
      username: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(14),
        ],
      ],
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirmPass: ["", [Validators.required, Validators.minLength(6)]],
      email: ["", [Validators.required, Validators.email]],
    });
  }

  checkLoggedIn(): void {
    if (this.authService.loggedIn()) {
      this.router.navigate(["/"]);
    }
  }

  onRegisterSubmit(): void {
    $("#error span").text("");
    this.authService.registerUser(this.registerForm.value).subscribe((data) => {
      console.log("REGISTER", data);
      if (data.success == true) {
        alert("Successfull!");
        this.router.navigate(["/login"]);
      } else {
        if (data.message == "EMAIL_EXISTS") {
          $("#error span").text("Email already exists!");
        } else {
          $("#error span").text(data.message);
        }
      }
    });
  }
}
