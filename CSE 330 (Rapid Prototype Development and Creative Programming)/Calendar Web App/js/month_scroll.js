//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CALENDAR Month Functions //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function changeMonth(direction, currentMonth){
  // changing month/year value
  //document.getElementById("month_year_label").textContent = currentMonth.month + " " + currentMonth.year;

  if (direction == "next"){
    currentMonth = currentMonth.nextMonth();
    updateCalendar();

  } else if (direction == "previous"){
    currentMonth = currentMonth.prevMonth();
    updateCalendar();

  } else{
   updateCalendar();
  }

  function getMonthName(month_num){
    switch(month_num){
      case 0:
        return "January";
        break;
      case 1:
        return "February";
        break;
      case 2:
        return "March";
        break;
      case 3:
        return "April";
        break;
      case 4:
        return "May";
        break;
      case 5:
        return "June";
        break;
      case 6:
        return "July";
        break;
      case 7:
        return "August";
        break;
      case 8:
        return "September";
        break;
      case 9:
        return "October";
        break;
      case 10:
        return "November";
        break;
      case 11:
        return "December";
        break;
    }
  }

  // update the calendar whenever we need to
  // sorry bout it
  function updateCalendar(){
  	var weeks = currentMonth.getWeeks();

    var x = getMonthName(currentMonth.month);

    document.getElementById("month_year_label").textContent = x + " " + currentMonth.year;



    //console.log(currentMonth.month);
    console.log("pressed");

  	for(var w in weeks){
      //days is an array with each day in a week
  	    var days = weeks[w].getDates();
        var week_number = parseInt(w);
        //console.log(w);
        var week_id = "week-" + week_number;
        //console.log(week_id);
        	// days contains normal JavaScript Date objects.
        //console.log()
        var week1_node = document.getElementById(week_id).getElementsByClassName("calendar-day");

  		for(var d in days){

  			// You can see console.log() output in your JavaScript debugging tool, like Firebug,
  			// WebWit Inspector, or Dragonfly.
      //  for(int i = 0; i < week1_node.childNodes.length-1; i++){
        week1_node[d].innerHTML = "<div class='month-day-calendar' value=" + days[d].getDate() + "> <div>" + days[d].getDate() + "</div></div>";
        week1_node[d].setAttribute("value", days[d]);
       //week1_node.childNodes[7].textContent = d;

      //  }
  			//console.log(days[d].toISOString());
  		}

  	}
    // if 6 weeks (0-5 weeks) (length = 6) update everything, else 5 weeks (0-4 weeks) (length = 5) and don't show last week (hidden)
    if (weeks.length == 5) {
       // clear sixth week (week-5)
       var week_six_node = document.getElementById("week-5").getElementsByClassName("calendar-day");
     //  days = weeks[4].getDates();

       for (i = 0; i < week_six_node.length; i++) {
         // var apple = document.getElementById("my-list").getElementsByClassName("fruits")[0];
         // document.getElementById("my-list").removeChild(apple);
         week_six_node[i].style.visibility = "hidden";
       }

     } else {
       // clear sixth week (week-5)
       var week_six_node = document.getElementById("week-5").getElementsByClassName("calendar-day");
     //  days = weeks[4].getDates();

       for (i = 0; i < week_six_node.length; i++) {
         // var apple = document.getElementById("my-list").getElementsByClassName("fruits")[0];
         // document.getElementById("my-list").removeChild(apple);
         week_six_node[i].style.visibility = "visible";
       }
     }


  }
}
