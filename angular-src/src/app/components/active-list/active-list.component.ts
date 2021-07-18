import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { ViewEncapsulation } from "@angular/core";

@Component({
  selector: "app-active-list",
  templateUrl: "./active-list.component.html",
  styleUrls: ["./active-list.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ActiveListComponent implements OnInit {
  @Input() tracks: Array<Object>;
  @Output() playSong = new EventEmitter<Array<string>>();

  constructor() {}

  ngOnInit() {}

  onUserClick(track: string, instrument: string): boolean {
    this.playSong.emit([track, instrument]);
    return false;
  }
  searchSong(input: string) {
    let i: number = 0;
    input = input.toLowerCase();
    var songs = <HTMLCollectionOf<Element>>(
      document.getElementsByClassName("list-group-item")
    );
    console.log(songs);
    for (i = 0; i < songs.length; i++) {
      console.log(songs[i].lastChild.parentNode.textContent.toLowerCase());
      if (
        !songs[i].lastChild.parentNode.textContent.toLowerCase().includes(input)
      ) {
        songs[i].setAttribute("style", "display: none");
      } else {
        songs[i].setAttribute("style", "display: block");
      }
    }
  }
}
