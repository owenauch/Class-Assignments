
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CREATE AN EVENT //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// brings up form to create an event
function createEventForm(event) {
    // add the div to display a create event form
    // need to break lines with \ to do multiline string
    var dateString = this.getAttribute("value");

    document.body.insertAdjacentHTML('afterbegin', "<div id='create-event-popup'>\
        <div id='create-event-inner'>\
            <h2 id='create-event-header'>Create an event:</h2>\
            <p>\
                <label for='event_name'>Event Name: </label>\
                <input type='text' name='event_name' id='event_name_input' />\
            </p>\
            <p>Event Date: <strong id='date-strong'>" + dateString.substring(0,10) + "</strong></p>\
            <p>\
                <label for='event_time'>Time: </label>\
                <input type='time' name='event_time' id='event_time_input' />\
            </p>\
            <p>Choose Category:</p>\
            <p>\
              <label>Work <input id='work_label' type='radio' name='label_name' value='work'checked/></label>\
              <label>Family <input id='family_label' type='radio' name='label_name' value='family'/></label>\
              <label>Random <input id='random_label' type='radio' name='label_name' value='random'/></label>\
            </p>\
            <button id='create-event-button'>\
              Create Event\
            </button>\
            <button id='cancel-create-event'>\
              Cancel\
            </button>\
            <input type='hidden' name='date' value='" + dateString + "' id='event_date_input'>\
        </div>\
    </div>");

    document.getElementById("create-event-button").addEventListener("click", createEvent, false);
    document.getElementById("cancel-create-event").addEventListener("click", function(event){
        $('#create-event-popup').remove();
    }, false);
}

function createEvent(event) {
    var eventName = document.getElementById('event_name_input').value;
    var eventTime = document.getElementById('event_time_input').value;

    var event_category = function(){
    var radio_category = document.getElementsByName("label_name");
      var which_category = "random";
      for(var i = 0; i < radio_category.length; i++){
        //.checked
        if(radio_category[i].checked){
          which_category = radio_category[i];
          //console.log(which_operation);
          break;
        }

      }
      //console.log(which_operation);
      return which_category;
    }
    var category = event_category().value;
    // validate forms
    if (eventName == "") {
        alert("Event must have a name to be created.");
        return false;
    }
    if (eventTime == "") {
        alert("Event must have a time to be created.");
        return false;
    }

    var eventDate = $('input#event_date_input').val();
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "php/create_event.php", true);
    xmlHttp.addEventListener("load", createEventCallback, false);
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.send("name= " + eventName + "&time=" + eventTime + "&date=" + eventDate + "&category=" + category);
}

function createEventCallback(event) {
    var jsonData = JSON.parse(event.target.responseText);
    if (jsonData.success) {
        $('#create-event-popup').remove();
        alert(jsonData.event_name + ' created successfully!')
    }
    else {
        alert("Failed to create event, try again!")
    }
    updateEvents();
}

// update events
function updateEvents(event_category) {
    // so scheisty but gets the job done
    var sampleDateString = $('#week-2').html().split('value="')[1].split('"')[0];
    console.log("in update events " + event_category)
    // query for events
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "php/get_events.php", true);
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.send("date= " + sampleDateString + "&event_category=" + event_category);
    xmlHttp.addEventListener("load", updateEventCallback, false);

}

function updateEventCallback(event) {
    var jsonData = JSON.parse(event.target.responseText);
    //console.log("in updateEventCallback " + event_category);
    // wipe calendar

    console.log("update e callback " + jsonData.display_category);

    $("p[class='event-display']").remove();

    if (jsonData.success && jsonData.display_category == "all") {
        // loop through events and put each one in its right place
        for (var looper in jsonData.events) {
            var eventDate = new Date(jsonData.events[looper].event_date).getDate();
            var eventHours = new Date(jsonData.events[looper].event_date).getHours();
            var eventMinutes = new Date(jsonData.events[looper].event_date).getMinutes();
            if (eventMinutes < 10) {
                eventMinutes += "0";
            }
            //console.log(eventMinutes);
            var hours = eventHours % 12;
            var eventTime = eventHours + ":" + eventMinutes;
            if (eventHours / 12 == 1) {
                eventTime += " PM";
            }
            else {
                eventTime += " AM";
            }

            var eventName = jsonData.events[looper].event_name;
            var eventCategory = jsonData.events[looper].event_category;

            if (eventDate > 14) {
                $(".month-day-calendar[value=" + eventDate + "]").last().append("<div class='event-display'>" + eventTime + "  " + eventName);
            }
            else {
                $(".month-day-calendar[value=" + eventDate + "]").first().append("<div class='event-display'>" + eventTime + "  " + eventName);
            }

        }
    } else if (jsonData.success && jsonData.display_category == "work"){
      for (var looper in jsonData.events) {
        if(jsonData.events[looper].event_category == "work"){
          var eventDate = new Date(jsonData.events[looper].event_date).getDate();
          var eventHours = new Date(jsonData.events[looper].event_date).getHours();
          var eventMinutes = new Date(jsonData.events[looper].event_date).getMinutes();
          if (eventMinutes < 10) {
              eventMinutes += "0";
          }
          //console.log(eventMinutes);
          var hours = eventHours % 12;
          var eventTime = eventHours + ":" + eventMinutes;
          if (eventHours / 12 == 1) {
              eventTime += " PM";
          }
          else {
              eventTime += " AM";
          }

          var eventName = jsonData.events[looper].event_name;
          var eventCategory = jsonData.events[looper].event_category;

          if (eventDate > 14) {
              $(".month-day-calendar[value=" + eventDate + "]").last().append("<p class='event-display'>" + eventTime + "  " + eventName);
          }
          else {
              $(".month-day-calendar[value=" + eventDate + "]").first().append("<p class='event-display'>" + eventTime + "  " + eventName);
          }
        }
      }
    } else if (jsonData.success && jsonData.display_category == "family"){
      for (var looper in jsonData.events) {
        if(jsonData.events[looper].event_category == "family"){
          var eventDate = new Date(jsonData.events[looper].event_date).getDate();
          var eventHours = new Date(jsonData.events[looper].event_date).getHours();
          var eventMinutes = new Date(jsonData.events[looper].event_date).getMinutes();
          if (eventMinutes < 10) {
              eventMinutes += "0";
          }
          //console.log(eventMinutes);
          var hours = eventHours % 12;
          var eventTime = eventHours + ":" + eventMinutes;
          if (eventHours / 12 == 1) {
              eventTime += " PM";
          }
          else {
              eventTime += " AM";
          }

          var eventName = jsonData.events[looper].event_name;
          var eventCategory = jsonData.events[looper].event_category;

          if (eventDate > 14) {
              $(".month-day-calendar[value=" + eventDate + "]").last().append("<p class='event-display'>" + eventTime + "  " + eventName);
          }
          else {
              $(".month-day-calendar[value=" + eventDate + "]").first().append("<p class='event-display'>" + eventTime + "  " + eventName);
          }
        }
      }
    } else if (jsonData.success && jsonData.display_category == "random"){
      for (var looper in jsonData.events) {
        if(jsonData.events[looper].event_category == "random"){
          var eventDate = new Date(jsonData.events[looper].event_date).getDate();
          var eventHours = new Date(jsonData.events[looper].event_date).getHours();
          var eventMinutes = new Date(jsonData.events[looper].event_date).getMinutes();
          if (eventMinutes < 10) {
              eventMinutes += "0";
          }
          //console.log(eventMinutes);
          var hours = eventHours % 12;
          var eventTime = eventHours + ":" + eventMinutes;
          if (eventHours / 12 == 1) {
              eventTime += " PM";
          }
          else {
              eventTime += " AM";
          }

          var eventName = jsonData.events[looper].event_name;
          var eventCategory = jsonData.events[looper].event_category;

          if (eventDate > 14) {
              $(".month-day-calendar[value=" + eventDate + "]").last().append("<p class='event-display'>" + eventTime + "  " + eventName);
          }
          else {
              $(".month-day-calendar[value=" + eventDate + "]").first().append("<p class='event-display'>" + eventTime + "  " + eventName);
          }
        }
      }
    }

    // event listener
    $(".event-display").click( function (event) {modEvent(event, "g");} );








}

// modify an event
function modEvent(event) {
    event.stopPropagation();
    var $div = $("<div id='create-event-popup'></div>").appendTo('body');
    $div.append("<h2 id='create-event-header'>Edit or Delete Event</h2>");
    $div.append("<h4>" + $(event.target).text() + "</h4>");
    $div.append("<p>\
        <label for='event_name'>Change event name: </label>\
        <input type='text' name='event_name' id='event_name_change'/>\
        <button id='change-name-button'>\
          Change\
        </button>\
    </p>\
    <p>\
        <label for='event_time'>Change event time: </label>\
        <input type='time' name='event_time' id='event_time_change'/>\
        <button id='change-time-button'>\
          Change\
        </button>\
    </p>\
    <button id='delete-event'>\
      Delete Event\
    </button>");

    $("#change-time-button").click(changeTime);
    $("#change-name-button").click(changeName);
}

// change event time
function changeTime(event) {
    var newTime = $("#event_time_change").val();
    console.log(newTime);
    console.log($("h4").split(""))
}
