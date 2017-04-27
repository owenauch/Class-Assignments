import React from 'react'
import ReactDOM from 'react-dom'
import { Map, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet'

import {Col} from 'react-bootstrap';

const position = [38.646746, -90.309143]

export default class EventMap extends React.Component {
    constructor(props) {
        super(props);
        // dummy initial event
        this.state = {
            events: [{
                "_id": {
                    "$oid": "58f5b06754ec6830e4ef9345"
                },
                "title": "gars",
                "description": "hello",
                "organization": "washu",
                "location": "duc",
                "latitude": "38.647941",
                "longitude": "-90.310446",
                "freeFood": "false",
                "date": "",
                "time": ""
            }],
            clicked: false,
            clickLoc: null
        }
    }

    // when component recieves props, state is changed to match those props
    // and the component is re-rendered
    componentWillReceiveProps(nextProps) {
        this.setState(
            {
                events: nextProps.events
            }
        )
    }

    // locate user when map is clicked
    handleClick = () => {
        this.refs.map.leafletElement.locate();
    };

    // callback for when location is found
    handleLocationFound = e => {
        this.setState({
          clicked: true,
          clickLoc: e.latlng,
        });
        console.log(e.latlng);
    };


    render() {
        // markers array of JSX objects
        var markers = [];
        // go through all events in state
        for (event in this.state.events) {

            // screen out events that aren't today
            var datestring = this.state.events[event].date;
            var eventDate = new Date(datestring);
            eventDate.setDate(eventDate.getDate() + 1);
            var todaysDate = new Date();
            if (eventDate.setHours(0,0,0,0) == todaysDate.setHours(0,0,0,0)) {
                //generating randomness
                if (Math.random() < 0.5){
                  var ran = Math.random() * (0.00020);
                } else {
                  var ran = Math.random() * (0.00020) * -1;
                }

                var latLong = [(parseFloat(this.state.events[event].latitude) + ran).toString(), (parseFloat(this.state.events[event].longitude) + ran).toString()];

                // free food strings
                var freeFood = "Nope, sorry!";
                if (this.state.events[event].freeFood == "true") {
                    freeFood = "Yes!";
                }

                // create marker object
                const marker =
                <Marker position={latLong} >
                    <Popup>
                        <span><strong>Title:   </strong>{this.state.events[event].title}<br/>
                        <strong>Description:   </strong>{this.state.events[event].description}<br/>
                        <strong>Organization:   </strong>{this.state.events[event].organization}<br/>
                        <strong>Location:   </strong>{this.state.events[event].location}<br/>
                        <strong>Free Food?   </strong>{freeFood}<br/>
                        <strong>Date:   </strong>{this.state.events[event].date}<br/>
                        <strong>Time:   </strong>{this.state.events[event].time}</span>
                    </Popup>
                </Marker>
                // add to array
                markers.push(marker);
            }

            // make circle marker when user clicks on map
            if (this.state.clicked) {
                var lat = this.state.clickLoc.lat;
                var long = this.state.clickLoc.lng;
                var loc = [lat, long];
                var circ = <CircleMarker center={loc}> <Popup><span>You are here!</span></Popup> </CircleMarker>
                markers.push(circ);
            }

        }

        // return the map with the markers
        return (
            <Col md={8}>
              <h4><strong>Click the map to show your current location (wait a moment for it to load)</strong></h4>
              <div id="map">
                <Map
                  style={{height: "100vh"}}
                  center={position}
                  onClick={this.handleClick}
                  onLocationfound={this.handleLocationFound}
                  ref="map"
                  zoom={16}>
                  <TileLayer
                    url="https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib3dlbmF1Y2giLCJhIjoiY2owbzBnZmU4MDBrbTJxb2Ezcm9odGY2byJ9.0YjNeMOCJByZ6PXlCAevrg"
                    attribution="AmbalamAuchComputing" />
                    {markers}
                </Map>
              </div>
            </Col>
        )
      }
}
