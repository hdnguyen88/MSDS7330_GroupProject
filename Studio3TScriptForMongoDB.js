db.chicago_taxi_trips.find({})

use GroupProject

db.chicago


db.chicago_taxi_trips.aggregate(
[
{$group: {"_id": "$dropoff_centroid_latitude", "count": {$sum: 1}}}
])

db.chicago_taxi_trips.aggregate(
[
{$group: {"_id": "$dropoff_centroid_longitude", "count": {$sum: 1}}}
])

db.chicago_taxi_trips.aggregate(
[
{$group: {"_id": {"drop_long": "$dropoff_centroid_longitude", "drop_lat": "$dropoff_centroid_latitude"},"count": {$sum: 1}}}
])


db.chicago_taxi_trips.aggregate(
[
{$group: {"_id": {"pick_long": "$pickup_centroid_longitude", "pick_lat": "$pickup_centroid_latitude"},"count": {$sum: 1}}}
])

use test
db.taxi.find({})

db.taxi.aggregate(
[
{$group: {"_id": {"Latitude": "$Pickup Centroid Latitude", "Longitude": "$Pickup Centroid Longitude"},"count": {$sum: 1}}}
])


db.taxi.aggregate(
[
{$group: {"_id": {"Latitude": "$Dropoff Centroid Latitude", "Longitude": "$Dropoff Centroid Longitude"},"count": {$sum: 1}}}
])


db.taxi.aggregate(
[
{$group: {"_id": "$Trip Total","count": {$sum: 1}}}
])
//query cash payment to find total payment using cash
db.taxi.aggregate(
[
{$match: {"Payment Type" : "Cash"}},
{$group: {"_id":"$Trip Total", "Payment Type": {$first: "$Payment Type"}, "count": {$sum:1}}}
]
)
// query credit card payment to find total payment using credit card
db.taxi.aggregate(
[
{$match: {"Payment Type" : "Credit Card"}},
{$group: {"_id":"$Trip Total", "Payment Type": {$first: "$Payment Type"}, "count": {$sum:1}}}
]
)

db.taxi.find()
//group by trip total to find the trip total in mile per grouped trip total
db.taxi.aggregate(
[
{$group: {"_id":"$Trip Total", "TotalTripMile": {$sum: "$Trip Miles"}, "count": {$sum:1}}}
]
)


//using this database for experiment of ISO date
use GroupProject

//Code to understand how ISO date work.
db.chicago_taxi_trips.find({})

db.chicago_taxi_trips.find({ "trip_start_timestamp": { $gt:ISODate("2013-11-19T14:00:00Z"), $lt: ISODate("2013-11-19T20:00:00Z") } })

db.chicago_taxi_trips.find({ "trip_start_timestamp": ISODate("2016-02-13T23:45:00.000")})
db.chicago_taxi_trips.find().forEach(function(element){
  element.trip_end_timestamp = ISODate(element.trip_end_timestamp);
  db.chicago_taxi_trips.save(element);
})

db.chicago_taxi_trips.find({ "trip_end_timestamp": { $gte:ISODate("2015-09-27T16:00:00.000+0000"), $lt: ISODate("2016-02-13T23:45:00.000") } })

db.taxi.find({})

db.taxi.find({ "trip_start_timestamp": { $eq:"2016-09-27 11:15:00"}})
db.taxi.aggregate(
[
{$group: {_id: "$trip_start_timestamp",trip_miles: {$sum: "$trip_miles"}, 
  ave_mile:{$avg: "$trip_miles"},count: {$sum: 1}}}]
)
//Tried to understand how to update the trip from string to ISO date.
db.taxi.find().forEach(function(element){
  element.trip_end_timestamp = ISODate(element.trip_end_timestamp);
  db.taxi.save(element);
})

//using test database, the taxi which use for group project is under test database.
use test

db.taxi.aggregate(
[
{$group: {_id: "$Trip Total", "TotalTripMile": {$sum: "$Trip Miles"}, count: {$sum: 1}}}]
)

db.taxi.aggregate(
[
{$group: {_id: "$Trip Total", "AveTripMile": {$avg: "$Trip Miles"}, "TotalTripMile": {$sum: "$Trip Miles"}, count: {$sum: 1}}}]
)

//group by the pickup latitude and pickup longitude to determine number of passengers pickup by taxi per location
db.taxi.aggregate(
[
{$group: {"_id": {"Pickup Latitude": "$Pickup Centroid Latitude", "Pickup Longitude": "$Pickup Centroid Longitude"},
  "AveTripMile": {$avg: "$Trip Miles"}, count: {$sum: 1}}}
])

//group by the drop off latitude and longitude to find out number of passengers drop off by taxi per location

db.taxi.aggregate(
[
{$group: {"_id": {"Dropoff Latitude": "$Dropoff Centroid Latitude", "Dropoff Longitude": "$Dropoff Centroid Longitude"},
  "AveTripMile": {$avg: "$Trip Miles"},count: {$sum: 1}}}
])

//query all taxi trip data
db.taxi.find()

//Since imported taxi data to MongoDB on bluemix for date as string instead of ISODate that make it difficult to 
//query certain date or time on the data. I have to extract the date string to date of trip and time of trip.
db.taxi.aggregate(
[
	{
	  $project:  
	  	{
	  	  "Trip Start Timestamp": 1,
	  	  "Trip Miles": 1,
	  	  DateOfRide: {$substr:["$Trip Start Timestamp",0,10]},
	  	  TimeOfRide: {$substr:["$Trip Start Timestamp",11,11]}
	  	  }
	},
	{
	  $group: 
	  	 {
	  	  	  _id: "$DateOfRide", count: {$sum: 1}, "AveTripMile": {$avg: "$Trip Miles"}, TotalMile:{$sum:"$Trip Miles"}
	  	  	}
	}
		
]
)

// To group the Trip start Timestamp, count the number of each grouped Trip start timestamp, calculate the average
//of mile and total mile of trip per grouped Trip start timestamp
db.taxi.aggregate(
[
{
	  	  $group: 
	  	  	{
	  	  	  _id: "$Trip Start Timestamp", count: {$sum: 1}, "AveTripMile": {$avg: "$Trip Miles"}, TotalMile:{$sum:"$Trip Miles"}
	  	  	}
	  	  
	  	}

]
)

// to select the start time for each trip and Trip Miles, also extract the time for each Trip from
//each Trip start Timestamp, then group by extracted time of Trip start timestamp, calculate the average trip miles and sum to//
// the total mile for each grouped trip start timestamp
db.taxi.aggregate(
[
	{
	  $project:  
	  	{
	  	  "Trip Start Timestamp": 1,
	  	  "Trip Miles": 1,
	  	  TimeOfRide: {$substr:["$Trip Start Timestamp",11,11]}
	  	  }
	},
	{
	  $group: 
	  	 {
	  	  	  _id: "$TimeOfRide", count: {$sum: 1}, "AveTripMile": {$avg: "$Trip Miles"}, TotalMile:{$sum:"$Trip Miles"}
	  	  	}
	}
		
]
)


db.CTASystemLStopMap.find({})
db.CTARiderDaily.find()

    
db.CTARiderDaily.find().forEach(function(element){
	element.date = ISODate("2001-01-01T00:00:00.000+0000");
	db.CTARdierDaily.save(element);
})




db.CTARiderDaily.aggregate(
[
	{
	  $group:{_id: "$stationname", totalRide: {$sum: "$rides"}, aveRidePerDay: {$avg: "$rides"}}
	}
]
)

//group by subway station name to find out each station location latitude and longitude.
db.CTASystemLStopMap.aggregate(
[
	{
	  $group: {_id: "$STATION_NAME", latitude: {$substr:["$Location",1,9]}, 
	    			longititue:{$substr["$Location",12,10]}
	  			}
	}	
	    
]
)


use test
db.taxi.find()

db.CTARiderDaily.find()
db.CTARiderDaily.find().sort({"rides": -1})

db.CTARiderDaily2.aggregate(
	[
	{
	  $group: {_id : "$stationname", count : {$sum: 1}}
	  }
	  ]

)
db.CTARiderDaily2.aggregate(
	[
	{
	  $project:  
	  	{
	  	  " ridedate" : 1
	  	  
	  	  }
	}
	
	]
	)
	
	
db.CTARiderDaily2.find(
{
  "ridedate" : {$gte : ISODate("2013-01-01T00:00:00.000+0000"), $lt : ISODate("2017-07-30T00:00:00.000+0000") }
}

)
