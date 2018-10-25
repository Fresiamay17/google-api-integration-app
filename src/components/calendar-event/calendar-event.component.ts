import { Component, OnInit, EventEmitter, Output, Input, NgZone } from '@angular/core';
import { Event } from './Event';
import { Router } from '@angular/router';
import { User } from "../../models/user";
import { AppContext } from "../../infrastructure/app.context";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-calendar-event',
  templateUrl: './calendar-event.component.html',
  styleUrls: ['./calendar-event.component.css']
})
export class CalendarEventComponent implements OnInit {

  @Output() newEvent: EventEmitter<Event> = new EventEmitter();
  @Input() currentEvent: Event;
  @Input() isEdit: boolean;
  users: User[]=[];
  url: string = `https://calendar.google.com/calendar/embed?showPrint=0&amp;showTabs=0&amp;showCalendars=0&amp;showTz=0&amp;height=600&amp;wkst=1&amp;bgcolor=%23FFFFFF&amp;src=malicdemj@google.com&amp;color=%23AB8B00&amp;ctz=Asia%2FManila`;
  urlSafe: SafeResourceUrl;
  selectedUserEmail: string;

  constructor(
    private router: Router,
    private zone: NgZone,
    private appContext: AppContext,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.users = this.appContext.Repository.User.getAll();
    this.selectedUserEmail = this.users[1].Email;
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

  addEvent(eventname, location, description, startdate, enddate, timezone) {
    if(!eventname || !startdate || !enddate || !timezone) {
      alert('Please fill in all required fields');
    } else {
      startdate = startdate + ':00';
      enddate = enddate + ':00';
      var reqBody = {
        'summary': eventname,
        'location': location,
        'description': description,
        'start': {
          'dateTime': startdate,
          'timeZone': timezone
        },
        'end': {
          'dateTime': startdate,
          'timeZone': timezone
        }
      }
      gapi.client['calendar'].events.insert({
        calendarId: 'primary',
        resource:  reqBody
      }).then((res) => {
            this.zone.run(() => {
              console.log('REQUEST: ', res);
            });
      });
    }
  }

  back() {
    this.router.navigate(['/home']);
  }

}
