import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ProfileComponent implements OnInit {
  user: Object;
  playpause_btn: Element;
  next_btn: Element;
  prev_btn: Element;
  seek_slider: HTMLElement;
  track_index: any;
  isPlaying: Boolean;
  curr_track: HTMLAudioElement;
  track_list: Array<Object>;
  updateTimer: any;
  curr_time: any;
  total_duration: any;

  constructor(public authService: AuthService, public router: Router) {}

  ngOnInit() {
    // this.authService.getProfile().subscribe(
    //   data => {
    //     this.user = data.user;
    //   },
    //   err => {
    //     console.log(err);
    //     return false;
    //   }
    // );

    this.track_index = 0;
    this.isPlaying = false;
    this.getProfileData();
    this.curr_track = document.createElement("audio");
    // this.track_list = [
    //   {
    //     songName: "Night Owl",
    //     extractedSongUrl: "../../../assets/audio/kabira.mp3",
    //   },
    // ];
    this.seek_slider = document.getElementById("progress-bar");
    this.playpause_btn = document.querySelector("#play");
    this.next_btn = document.querySelector("#next");
    this.prev_btn = document.querySelector("#prev");
    this.curr_time = document.querySelector(".current-time");
    this.total_duration = document.querySelector(".total-duration");
  }
  play() {
    let controlPanelObj = document.getElementById("control-panel"),
      infoBarObj = document.getElementById("info");
    console.log(controlPanelObj.classList);
    console.log(infoBarObj.classList);
    Array.from(controlPanelObj.classList).find(function (element) {
      console.log(element);
      if (element !== "active") controlPanelObj.classList.add("active");
      else controlPanelObj.classList.remove("active");
      return false;
    });

    Array.from(infoBarObj.classList).find(function (element) {
      if (element !== "active") infoBarObj.classList.add("active");
      else infoBarObj.classList.remove("active");
      return false;
    });

    if (!this.isPlaying) this.playTrack();
    else this.pauseTrack();
  }

  loadTrack(track_index) {
    // Clear the previous seek timer
    clearInterval(this.updateTimer);
    this.resetValues();

    // Load a new track
    this.curr_track.src = this.track_list[track_index]["extractedSongUrl"];
    this.curr_track.load();
    console.log(this.curr_track);
    document.getElementById("trackName").innerHTML = this.track_list[
      track_index
    ]["songName"];

    // Update details of the track
    // track_art.style.backgroundImage =
    //    "url(" + track_list[track_index].image + ")";
    // track_name.textContent = track_list[track_index]["songName"];
    // track_artist.textContent = track_list[track_index].artist;
    // now_playing.textContent =
    //    "PLAYING " + (track_index + 1) + " OF " + track_list.length;

    // Set an interval of 1000 milliseconds
    // for updating the seek slider
    this.updateTimer = setInterval(
      () => this.seekUpdate(this.curr_track),
      1000
    );
  }

  resetValues() {
    this.curr_time.textContent = "00:00";
    // total_duration.textContent = "00:00";
    this.seek_slider.style.width = "0%";
  }

  playTrack() {
    // Play the loaded track
    this.curr_track.play();
    this.isPlaying = true;
  }

  pauseTrack() {
    // Pause the loaded track
    this.curr_track.pause();
    this.isPlaying = false;
  }

  nextTrack() {
    // Go back to the first track if the
    // current one is the last in the track list
    console.log("here");
    console.log(this.track_list);
    console.log(this.track_list.length);
    if (this.track_index < this.track_list.length - 1) this.track_index += 1;
    else this.track_index = 0;

    // Load and play the new track
    this.loadTrack(this.track_index);
    this.playTrack();
  }

  reload() {
    this.track_index = 0;
    this.loadTrack(this.track_index);
    this.playTrack();
  }

  prevTrack() {
    // Go back to the last track if the
    // current one is the first in the track list
    if (this.track_index > 0) this.track_index -= 1;
    else this.track_index = this.track_list.length;

    // Load and play the new track
    this.loadTrack(this.track_index);
    this.playTrack();
  }

  seekUpdate(curr_track): void {
    let seekPosition = 0;
    // Check if the current track duration is a legible number
    if (!isNaN(curr_track.duration)) {
      seekPosition = curr_track.currentTime * (100 / curr_track.duration);
      let width = seekPosition.toString() + "%";
      this.seek_slider.style.width = width;

      // Calculate the time left and the total duration
      let currentMinutes = Math.floor(curr_track.currentTime / 60);
      let currentSeconds = Math.floor(
        curr_track.currentTime - currentMinutes * 60
      );
      let durationMinutes = Math.floor(curr_track.duration / 60);
      let durationSeconds = Math.floor(
        curr_track.duration - durationMinutes * 60
      );

      var finalCurrentMinutes = currentMinutes.toString();
      var finalCurrentSeconds = currentSeconds.toString();
      var finalDurationMinutes = durationMinutes.toString();
      var finalDurationSeconds = durationSeconds.toString();

      // Add a zero to the single digit time values
      if (currentSeconds < 10) {
        var currSeconds = "0" + currentSeconds.toString();
        finalCurrentSeconds = currSeconds;
      }
      if (durationSeconds < 10) {
        var durSeconds = "0" + durationSeconds.toString();
        finalDurationSeconds = durSeconds;
      }
      if (currentMinutes < 10) {
        var currMinutes = "0" + currentMinutes.toString();
        finalCurrentMinutes = currMinutes;
      }
      if (durationMinutes < 10) {
        var durMinutes = "0" + durationMinutes.toString();
        finalDurationMinutes = durMinutes;
      }

      // Display the updated duration
      this.curr_time.textContent =
        finalCurrentMinutes + ":" + finalCurrentSeconds;
      this.total_duration.textContent =
        finalDurationMinutes + ":" + finalDurationSeconds;

      if (
        finalCurrentMinutes == finalDurationMinutes &&
        finalCurrentSeconds == finalDurationSeconds
      ) {
        this.isPlaying = false;
        this.play();
        this.pauseTrack();
      }
    }
  }

  playSong(song) {
    var found = false;
    if (this.isPlaying) {
      this.isPlaying = false;
      this.play();
      this.pauseTrack();
    }
    this.track_list.forEach((track, index) => {
      if (track["songName"] == song[0] && track["instrument"] == song[1]) {
        document.getElementById("trackName").innerHTML = song[0];
        this.track_index = index;
        this.loadTrack(this.track_index);
        if (!this.isPlaying) {
          this.isPlaying = true;
          this.play();
          this.playTrack();
        } else {
          this.isPlaying = false;
          this.play();
          this.pauseTrack();
        }
        found = true;
      }
    });
    if (!found) {
      if (this.isPlaying) {
        this.isPlaying = false;
        this.play();
        this.pauseTrack();
        alert("Oops! Song is unavailable, please upload again!");
      } else {
        this.pauseTrack();
        alert("Oops! Song is unavailable, please upload again!");
      }
    }
  }

  modifySongName(song) {
    song = song.replaceAll(".wav", "");
    song = song.replaceAll("_", " ");
    var re = /(\b[a-z](?!\s))/g;
    song = song.replace(re, function (x) {
      return x.toUpperCase();
    });
    return song;
  }

  getProfileData() {
    $("#loader").toggleClass("none");
    $("#profileContainer").toggleClass("none");
    this.authService.getProfile().subscribe((dataFile) => {
      $("#loader").toggleClass("none");
      $("#profileContainer").toggleClass("none");
      document.getElementById("username").innerHTML = dataFile.data["name"];
      document.getElementById("email").innerHTML = dataFile.data["email"];
      console.log(dataFile);
      dataFile.data["songs"].forEach((track, index) => {
        track["songName"] = this.modifySongName(track["songName"]);
      });
      this.track_list = dataFile.data["songs"].reverse();
      this.loadTrack(this.track_index);
    });
  }

  collaspseNav(): void {
    var active = document.getElementById("myTopnav");
    active.setAttribute("style", "display: none");
  }

  onLogoutClick(): boolean {
    this.authService.logout();
    this.router.navigate(["/login"]);
    this.collaspseNav();
    return false;
  }
}
