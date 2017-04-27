import React, { Component } from 'react';
import {Well, Grid, Row, Col, Panel, ListGroup, ListGroupItem, Button, ControlLabel} from 'react-bootstrap';

class EventList extends Component{
  constructor(props) {
    super(props);
    this.state = {
          sorter: "time",
        };

    this.handleInputChange = this.handleInputChange.bind(this);

  }

  //changes class variables as it is typed
  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  render(){
  console.log(this.state.sorter);
  if (this.state.sorter == "time"){
    var sortedByDate = this.props.posts.sort(function(a,b){
      var aDate = a.date;
      var bDate = b.date;

      if (aDate < bDate){
        return -1;
      }
      if (aDate > bDate){
        return 1;
      }
      return 0;
    });

    var sortedArray = this.props.posts.sort(function(a,b){
      var aTime = a.time;
      var bTime = b.time;

      if (aTime < bTime){
        return -1;
      }
      if (aTime > bTime){
        return 1;
      }
      return 0;
    });
  } else if (this.state.sorter == "name"){
    //sorting array by title, or "name"
    var sortedArray = this.props.posts.sort(function(a,b){
      var aTitle = a.title;
      var bTitle = b.title;
      //alert(aTitle + " " + bTitle + " " + (aTitle < bTitle));
      if (aTitle < bTitle){

        return -1;
      }
      if (aTitle > bTitle){
        return 1;
      }
      return 0;


    });
  } else if (this.state.sorter == "organization"){
    //sorting array by organization name
    var sortedArray = this.props.posts.sort(function(a,b){
      var a = a.organization;
      var b = b.organization;
      //alert(aTitle + " " + bTitle + " " + (aTitle < bTitle));
      if (a < b){

        return -1;
      }
      if (a > b){
        return 1;
      }
      return 0;


    });
  } else {
    //this shouldn't happen
    var sortedArray = this.props.posts;
  }


  const sidebar = (
      <div>
          <form>
            <ControlLabel>Sort By:</ControlLabel>
            <select
            name="sorter"
            type="select"
            value={this.state.sorter}
            onChange={this.handleInputChange}>
                <option value="time">Time (soonest event first)</option>
                <option value="name">Name (alphabetical)</option>
                <option value="organization">Organization (alphabetical)</option>
            </select>
          </form>
          <br />
          <ul>
            {sortedArray.map((post) =>
              <li key={post.__id}>
                {post.title}
              </li>
            )}
          </ul>
    </div>
  );

  const description = sortedArray.map((post) =>

      <div key={post.__id}>
        <ListGroupItem>

          <h3>{post.title}</h3>
          <h4><strong>Date: </strong>{post.date}, <strong>Time: </strong>{post.time}, <strong>Location: </strong>{post.location}</h4>
          <p>{post.description}</p>
            {post.freeFood === 'true' &&
                <p> Come get some free food! </p>
             }
             {post.freeFood === 'false' &&
                 <p> Come enjoy the event! </p>
              }
          <p><strong>Hosted by: </strong>{post.organization} </p>
        </ListGroupItem>

      </div>
  );
    return(
        <Grid>
            <Row>
                <Col md={3}>
                    <Panel bsStyle="primary">
                        {sidebar}
                    </Panel>
                </Col>
                <Col md={9}>
                    <Well>
                        <ListGroup>
                            {description}
                        </ListGroup>
                    </Well>
                </Col>
            </Row>
        </Grid>
    );
  }
}


export default EventList;
