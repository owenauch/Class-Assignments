import React, { Component } from 'react';
import {Form, FormGroup, Col, ControlLabel, FormControl, Checkbox, Button, Input, Row} from 'react-bootstrap';

class EventInputForm extends React.Component {
  constructor(props) {
    super(props);

    //creating new date object and setting it to yesterday
    var date = new Date();
    date.setDate(date.getDate() - 1);

    this.state = {
      title: '',
      description: '',
      organization: '',
      hasFreeFood: false,
      date: '',
      time: '',
      location: 'duc',
      currentDate: date,
      currentTime: new Date().toTimeString().split(" ")[0].slice(0,5)

    };
    // bind to EventInputForm
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  //  alert(new Date().toTimeString().split(" ")[0]);
    //alert(this.state.currentDate);
  }

  // changes class variables as it is typed
  handleInputChange(event) {
    const target = event.target;
    console.log(target);
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  //handles submission, send a request
  handleSubmit(event) {

    var title = this.state.title;
    var organization = this.state.organization;
    var hasFreeFood = this.state.hasFreeFood;
    var date = this.state.date;
    var time = this.state.time;
    var description = this.state.description;
    var location = this.state.location;

    // logic for hardcoding the locations
    const locationLats = {
        "duc": 38.647941,
        "bd": 38.644619,
        "brookings": 38.647987,
        "francis": 38.647890,
    };
    const locationLongs = {
        "duc": -90.310446,
        "bd": -90.313378,
        "brookings": -90.305067,
        "francis": -90.313695,
    };

    var lat = locationLats[location];
    var long = locationLongs[location];

    // post request to put in db
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "http://localhost:3001/new_event", true);
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlHttp.send(
      "title=" + title +
      "&description=" + description +
      "&organization=" + organization +
      "&location=" + location +
      "&latitude=" + lat +
      "&longitude=" + long +
      "&freeFood=" + hasFreeFood +
      "&date=" + date +
      "&time=" + time
    );

    alert("Your event has been posted!");

    var date = new Date();
    date.setDate(date.getDate() - 1);

    this.setState({
      title: '',
      decription: '',
      organization: '',
      hasFreeFood: false,
      date: date,
      time: '',
      location: 'duc',
    });

    //calls getEvents in parent component to update component list
    this.props.getEvents();

    event.preventDefault();
  }

  // creating the form
  render() {
    return (
        <Col md={4}>
          <Form onSubmit={this.handleSubmit} method="POST">
            <FormGroup>
                <Row>
                    <ControlLabel>Title</ControlLabel>
                </Row>
                <Row>
                    <input
                      name="title"
                      type="text"
                      value={this.state.title}
                      onChange={this.handleInputChange}>
                    </input>
                </Row>
            </FormGroup>
            <FormGroup>
                <Row>
                    <ControlLabel>Description</ControlLabel>
                </Row>
                <Row>
                    <input
                      name="description"
                      type="text"
                      value={this.state.description}
                      onChange={this.handleInputChange}/>
                </Row>
            </FormGroup>
            <FormGroup>
                <Row>
                    <ControlLabel>Organization</ControlLabel>
                </Row>
                <Row>
                    <input
                      name="organization"
                      type="text"
                      value={this.state.organization}
                      onChange={this.handleInputChange}/>
                </Row>
            </FormGroup>
            <FormGroup>
                <Row>
                    <ControlLabel>Location</ControlLabel>
                </Row>
                <Row>
                    <select
                    name="location"
                    type="select"
                    value={this.state.location}
                    onChange={this.handleInputChange}>
                        <option value="duc">DUC</option>
                        <option value="bd">Bear&apos;s Den</option>
                        <option value="brookings">Brookings</option>
                        <option value="francis">Francis Field</option>
                    </select>
                </Row>
            </FormGroup>
            <FormGroup>
                <Row>
                    <strong>Free Food?</strong>
                    <input
                    name="hasFreeFood"
                    type="checkbox"
                    checked={this.state.hasFreeFood}
                    onChange={this.handleInputChange} />
                </Row>
            </FormGroup>
            <FormGroup>
                <Row>
                    <ControlLabel>Date</ControlLabel>
                </Row>
                <Row>
                    <input
                     name="date"
                     type="date"
                     min= {this.state.currentDate.toISOString().slice(0,10)}
                     value= {this.state.date}
                     checked={this.state.date}
                     onChange={this.handleInputChange} />
                </Row>
            </FormGroup>
            <FormGroup>
                <Row>
                    <ControlLabel>Time</ControlLabel>
                </Row>
                <Row>
                    <input
                     name="time"
                     type="time"
                     min={this.state.currentTime}
                     value= {this.state.time}
                     checked={this.state.time}
                     onChange={this.handleInputChange} />
                </Row>

            </FormGroup>
            <input  type="submit" value="Submit" />

          </Form>
    </Col>
    );
  }
}

export default EventInputForm;
