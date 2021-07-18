import { Component, ElementRef } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { ViewEncapsulation } from "@angular/core";
import * as $ from "jquery";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent {
  title = "AInstrument";
  config: any;
  fullpage_api: any;
  links: any;
  violinInput: FormGroup;
  fluteInput: FormGroup;
  trumpetInput: FormGroup;
  uploadedFile: File;
  timer: any;
  loadTimer: any;

  constructor(
    public formBuilder: FormBuilder,
    public authService: AuthService,
    public router: Router,
    public el: ElementRef
  ) {
    this.violinInput = this.formBuilder.group({
      file: [""],
    });
    this.fluteInput = this.formBuilder.group({
      file: [""],
    });
    this.trumpetInput = this.formBuilder.group({
      file: [""],
    });
    this.timer = 10;

    this.config = {
      // fullpage options
      licenseKey: "YOUR LICENSE KEY HERE",
      anchors: ["violin", "guitar", "flute", "fourthPage", "lastPage"],
      scrollingSpeed: 1500,
      // navigation: true,
      menu: "#myTopnav",

      // fullpage callbacks
      afterResize: () => {
        console.log("After resize");
      },
      afterLoad: (origin, destination, direction) => {},
      onLeave: (origin, destination, direction) => {
        var current = document.getElementsByClassName("activated")[0];
        if (destination.anchor == "guitar") {
          var active = document.getElementsByClassName("guitar")[0];
          active.classList.toggle("activated");
          current.classList.toggle("activated");
        } else if (destination.anchor == "violin") {
          var active = document.getElementsByClassName("violin")[0];
          active.classList.toggle("activated");
          current.classList.toggle("activated");
        } else if (destination.anchor == "flute") {
          var active = document.getElementsByClassName("flute")[0];
          active.classList.toggle("activated");
          current.classList.toggle("activated");
        }
      },
    };
  }

  getRef(fullPageRef) {
    this.fullpage_api = fullPageRef;
  }
  myFunction() {
    console.log("Entered");
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  }
  onFileChange(event) {
    this.uploadedFile = event.target.files[0];
    console.log(this.uploadedFile);
  }
  active(event) {
    var active = document.getElementsByClassName("activated")[0];
    if (!event.target.classList.contains("activated")) {
      event.target.classList.toggle("activated");
      active.classList.toggle("activated");
    }
  }
  onLogoutClick(): boolean {
    this.authService.logout();
    this.router.navigate(["/login"]);
    this.collaspseNav();
    return false;
  }

  collaspseNav(): void {
    var active = document.getElementById("myTopnav");
    active.setAttribute("style", "display: none");
  }

  onViolinSubmit(): void {
    console.log("done");
    var songName = prompt(
      "Please enter song name - (should be same as file name)"
    );
    var checker = this.violinInput.get("file").value;
    if (checker && songName) {
      let formData = new FormData();
      formData.append("audio", this.uploadedFile);
      formData.append("songName", songName);
      formData.append("instrument", "Violin");
      $("#loader").toggleClass("none");
      $("#fullpage").toggleClass("none");
      this.collaspseNav();
      this.loadTimer = setInterval(() => this.updateTimer(), 10000);
      this.authService.postFile(formData).subscribe((data) => {
        console.log(data);
        if (data) {
          this.router.navigate(["/profile"]);
        } else {
          $("#loader").toggleClass("none");
          $("#fullpage").toggleClass("none");
          clearInterval(this.loadTimer);
        }
      });
    }
  }

  onFluteSubmit(): void {
    console.log("done");
    var songName = prompt(
      "Please enter song name - (should be same as file name)"
    );
    var checker = this.fluteInput.get("file").value;
    if (checker && songName) {
      let formData = new FormData();
      formData.append("audio", this.uploadedFile);
      formData.append("songName", songName);
      formData.append("instrument", "Flute");
      $("#loader").toggleClass("none");
      $("#fullpage").toggleClass("none");
      this.collaspseNav();
      this.loadTimer = setInterval(() => this.updateTimer(), 10000);
      this.authService.postFile(formData).subscribe((data) => {
        console.log(data);
        if (data) {
          this.router.navigate(["/profile"]);
        } else {
          $("#loader").toggleClass("none");
          $("#fullpage").toggleClass("none");
          clearInterval(this.loadTimer);
        }
      });
    }
  }

  onTrumpetSubmit(): void {
    console.log("done");
    var songName = prompt(
      "Please enter song name - (should be same as file name)"
    );
    var checker = this.trumpetInput.get("file").value;
    if (checker && songName) {
      let formData = new FormData();
      formData.append("audio", this.uploadedFile);
      formData.append("songName", songName);
      formData.append("instrument", "Trumpet");
      $("#loader").toggleClass("none");
      $("#fullpage").toggleClass("none");
      this.collaspseNav();
      this.loadTimer = setInterval(() => this.updateTimer(), 10000);
      this.authService.postFile(formData).subscribe((data) => {
        console.log(data);
        if (data) {
          this.router.navigate(["/profile"]);
        } else {
          $("#loader").toggleClass("none");
          $("#fullpage").toggleClass("none");
          clearInterval(this.loadTimer);
        }
      });
    }
  }

  updateTimer() {
    if (this.timer != 0) {
      $("#load-time").text(this.timer);
      this.timer = this.timer - 1;
    }
  }

  // openProfile() {
  //   setInterval(() => {
  //     $("#loader").toggleClass("none");
  //     $("#fullpage").toggleClass("none");
  //   }, 1000);
  //   this.router.navigate(["/profile"]);
  // }
}
