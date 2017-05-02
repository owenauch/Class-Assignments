import React, { Component } from 'react';

import EventList from './EventList.js';
import EventMap from './EventMap.js';
import EventInputForm from './EventInputForm.js';
import {Grid, Row, Button} from 'react-bootstrap';


class EventContainer extends Component{
  constructor(props) {
    super(props);

    this.state = {
      events: [],
    };

    this.getEvents = this.getEvents.bind(this);
  }

  // get events from API
  getEvents(event) {
      // get request to API for all events
      var xmlHttp = new XMLHttpRequest();

      xmlHttp.open("GET", "https://free-food-api.herokuapp.com/get_events", true);
      xmlHttp.addEventListener("load", function(event) {
          var newEvents = JSON.parse(event.target.response);
          var newEventsArr = Object.keys(newEvents).map(function(k){
            console.log(newEvents[k]);
            return newEvents[k];
          });

          this.setState({
            events: newEventsArr
          });

      }.bind(this), false);
      xmlHttp.send(null);

  }

  componentWillMount() {
      this.getEvents();
  }

  render() {

    return(
      <Grid>
        <Row>
            <EventMap events={this.state.events} />
            <EventInputForm getEvents={this.getEvents}/>
        </Row>
        <br />
        <Row>
            <Button bsStyle="primary" onClick={this.getEvents}> Click here to refresh list! </Button>
        </Row>
        <EventList posts={this.state.events} />
      </Grid>
    );
  }

}

export default EventContainer;
