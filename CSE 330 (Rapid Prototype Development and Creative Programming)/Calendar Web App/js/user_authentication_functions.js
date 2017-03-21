//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// USER CREATION //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createUser(){
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("POST", "php/calendar_account_creator.php", true);

  //getting input values
  var createuser_username = document.getElementById("createuser_username").value;
  var createuser_password = document.getElementById("createuser_password").value;
  var createuser_retype_password = document.getElementById("createuser_retype_password").value;

  xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  //printing for debugging purposes
  console.log(createuser_username);
  console.log(createuser_password);
  console.log(createuser_retype_password);

  //sending post variables
  xmlHttp.send("user=" + createuser_username + "&pwd=" + createuser_password + "&repwd=" + createuser_retype_password);

  xmlHttp.onload = function () {
      // do something to response
       console.log(this.responseText);
       alert(this.responseText);


  };

}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// USER LOGIN Verification //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function verifyUser(){
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("POST", "php/verify_login.php", true);

  //getting input values
  var login_username = document.getElementById("login_username").value;
  var login_password = document.getElementById("login_password").value;

  xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  //printing for debugging purposes
  console.log(login_username);
  console.log(login_password);

  //sending post variables
  xmlHttp.send("user=" + login_username + "&pwd=" + login_password);

  xmlHttp.onload = function() {
      // do something to response
      console.log(this.responseText);
    //  alert(this.responseText);
      var jsonData = JSON.parse(event.target.responseText); // parse the JSON into a JavaScript object
      if(jsonData.success){  // in PHP, this was the "success" key in the associative array; in JavaScript, it's the .success property of jsonData
        alert("You've been Logged In!");
        var logged_in_user = document.getElementById("username_logged_in");
        //gotta get $session_['user'];
        //logged_in_user.textContent = "You are logged in as: " + jsonData.username + " ";
        checkSession();
        var all = "all";
        updateEvents(all);
        // var login_elements = document.getElementById("login_id").style.visibility = "hidden";
        // var create_account_elements = document.getElementById("create_account_id").style.visibility = "hidden";


      } else{
          alert("You were not logged in. " + jsonData.message);
      }


      //alert(this.responseText);

  };

}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LOGOUT //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function logoutUser(){

  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("POST", "php/logout_user.php", true);
  xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xmlHttp.send(null);

  xmlHttp.onload = function () {
      alert(this.responseText);
      checkSession();

  };

}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// USER SESSION Verification //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function checkSession() {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("POST", "php/check_user_session.php", true);

  xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xmlHttp.send(null);

  //sending post variables
  console.log("checking session");
  xmlHttp.onload = function() {
      // do something to response
      console.log("checksesh" + this.responseText);
    //  alert(this.responseText);
      var jsonData = JSON.parse(event.target.responseText); // parse the JSON into a JavaScript object
      console.log("checksesh " + jsonData.success);

      if(jsonData.success){  // in PHP, this was the "success" key in the associative array; in JavaScript, it's the .success property of jsonData

        var logged_in_user = document.getElementById("username_logged_in");
        //gotta get $session_['user'];
        logged_in_user.textContent = "You are logged in as: " + jsonData.username + " ";

        var login_elements = document.getElementById("login_id").style.visibility = "hidden";
        var create_account_elements = document.getElementById("create_account_id").style.visibility = "hidden";


      } else {
          console.log("not logged in, the user log in stuff should show up");
          var login_elements = document.getElementById("login_id").style.visibility = "visible";
          var create_account_elements = document.getElementById("create_account_id").style.visibility = "visible";
          var logged_in_user = document.getElementById("username_logged_in");

          logged_in_user.textContent = "You are not logged in right now.";
      }


      //alert(this.responseText);
  };
}
