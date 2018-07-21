var config = {
    apiKey: "AIzaSyB1F4bErJNDdtu3C13D7ixcGRKTzYpo7vU",
    authDomain: "train-scheduler-3bf24.firebaseapp.com",
    databaseURL: "https://train-scheduler-3bf24.firebaseio.com",
    projectId: "train-scheduler-3bf24",
    storageBucket: "train-scheduler-3bf24.appspot.com",
    messagingSenderId: "224428923075"
};

firebase.initializeApp(config);

var database = firebase.database();

$("#add-Train").on('click', function (event) {
    event.preventDefault();

    var tName = $("#tName").val().trim();
    var tDest = $("#tDest").val().trim();
    var tTime = $("#tTime").val().trim();
    var tFreq = $("#tFreq").val().trim();

    var tNew = {
        name: tName,
        destination: tDest,
        time: tTime,
        frequency: tFreq
    };

    $("#tName").val("");
    $("#tDest").val("");
    $("#tTime").val("");
    $("#tFreq").val("");
    
    database.ref().push(tNew);
});

database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    var tName = childSnapshot.val().name;
    var tDest = childSnapshot.val().destination;
    var tTime = childSnapshot.val().time;
    var tFreq = childSnapshot.val().frequency;

    var timeConversion = moment(tTime, "HH:mm").subtract(1, "years");
    console.log(timeConversion);

    var timeCurrent = moment();
    var timeDiff = moment().diff(moment(timeConversion), "minutes");
    var timeRemainder = timeDiff % tFreq;

    var timeMinutesUntilNextTrain = tFreq - timeRemainder;
    var tNext = moment().add(timeMinutesUntilNextTrain, "minutes");
    var tArrival = moment(tNext).format("hh:mm A")

    var newRow = $("<tr>").append(
        $("<td>").text(tName),
        $("<td>").text(tDest),
        $("<td>").text(tFreq),
        $("<td>").text(tArrival),
        $("<td>").text(timeMinutesUntilNextTrain)
    );

    $("#train-table > tbody").append(newRow);
});