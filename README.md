# shellbnb
Airbnb in your shell.

* Scan through available places at your destination directly from your terminal. 

* Apply more than 30 filters to refine your search.

* Automatically send a message to the host when a place matching your criteria is found.

* Send pictures and links to Slack whenever a new place matching your criteria is found.

* Make it automatically repeat the search every 24 hours.

[![asciicast](https://asciinema.org/a/PlPAsIcMxMxWahtQe9NhY40cA.svg)](https://asciinema.org/a/PlPAsIcMxMxWahtQe9NhY40cA)

## Usage

Docker:

```
docker run -e LOCATION=Berlin kaisle/airbnb
```

Docker-compose:

```
git clone https://github.com/Kaisle/airbnb && cd airbnb
docker-compose build && docker-compose up
```

Node (npm):

```
const airbnb = require('airbnb');
airbnb.search({LOCATION: 'Berlin'});
```

Node (source):

```
git clone https://github.com/Kaisle/airbnb && cd airbnb
npm start
```

## Options

The search function will accept arguments from the options object passed to it (first priority) or from environment variables (second priority).

Node:

```
const airbnb = require('airbnb');
const options = {
 LOCATION: "London",
 MAKE_INQUIRIES: false,
 PIPE_TO_SLACK: false,
 PERSIST_STATE: false,
 LATITUDE: 51.509,
 LONGITUDE. -0.118,
 MAX_DISTANCE_IN_METERS: 4000,
 GUESTS: 1,
 NUM_LISTINGS: 50,
 CURRENCY: "USD",
 MIN_PRICE: 20,
 MAX_PRICE: 100,
 START_DATE: "2019-03-01",
 END_DATE: "2019-03-03",
 MIN_BATHROOMS: 1,
 MIN_STAR_RATING: 4,
 HOST_MIN_REVIEWS: 5,
 MIN_PIC_COUNT: 2,
 CANCELLATION_POLICY: ['Flexible', 'Moderate', 'Strict'],
 AMENITIES: ['Kitchen'],
 ROOM_TYPE: "entire_room",
 ALLOW_SMOKING: false,
 ALLOW_PETS: false
};
airbnb.search(options);
```

Docker:

```
docker run -e LOCATION=London -e MIN_PRICE=20 -e MAX_PRICE==100 kaisle/airbnb
``` 

Docker-compose:

```
environment:
  PERSIST_STATE: "false"
  LOCATION: "London"
  MIN_PRICE: 20
  MAX_PRICE: 100
  START_DATE: "2019-03-01"
  END_DATE: "2019-03-03"
  PIPE_TO_SLACK: "false"
  MAKE_INQUIRIES: "false"
  GUESTS: 1
```

There are lots of other options not pictured here. For a full overview please check the bottom of this page.

## Sending messages to Slack

To send descriptions and pictures of listings to Slack, specify the following options in the options object or as environment variables:

```
PIPE_TO_SLACK: true,
SLACK_WEBHOOK: <YOUR_SLACK_WEBHOOK>
SLACK_CHANNEL: <YOUR_SLACK_CHANNEL>
SLACK_USERNAME: <YOUR_SLACK_USERNAME>
```

Follow the guide here to create a personal channel and get a webhook: https://api.slack.com/incoming-webhooks

## Contacting hosts automatically

Sometimes you may want to automatically send a message to all of the hosts that fulfill your criteria.

In this message you could ask them to confirm whether the place is available during your stay and ask them any additional questions you might have.

Messaging can be turned on by specifying the following options:

```
MAKE_INQUIRIES: true,
INQUIRY_MESSAGE: "Hi! I'm in London from the 5th of January till the 7th of January and I would love to stay at your place. Can you confirm that it is available during this period? How far is it to public transport?",    
```

You will also need to authenticate to Airbnb so the messages can be sent from your account. This can be done by specifying a combination of username and password:

```
USERNAME: <YOUR AIRBNB USERNAME>
PASSWORD: <YOUR AIRBNB PASSWORD>
```
Or by supplying an API-token:

```
TOKEN: <YOUR AIRBNB API TOKEN>
```

Here's a guide on how to obtain the APi token: https://stackoverflow.com/questions/38243819/how-to-acquire-api-key-for-airbnb.

## Persistence

To avoid replaying the same places across runs, enable the persistence flag and run the module alongside a MongoDB instance. 

The docker-compose file will fire up a MongoDB instance automatically when run.

Node:

```
PERSIST_STATE: true
```

Docker-compose: 

```
environment:
  PERSIST_STATE: "true"
```

To clear persistent storage at runtime:

```
CLEAR: true
``` 

## Restrict date range

You can specify a start date and an end date for your stay by using the following options:

```
START_DATE: "2019-03-01",
END_DATE. "2019-03-03"
```
This will only include listings that are within 4 km of 51.509,-0.118. 

## Restrict location using coordinates

You can specify a maximum distance from a certain location by using the following options:

```
LATITUDE: 51.509,
LONGITUDE. -0.118,
MAX_DISTANCE_IN_METERS: 4000, 
```
This will only include listings that are within 4 km of 51.509,-0.118. 

## Full description of options

Options are either a boolean, a string, an array of strings or null. Any option can be turned off by setting its value to null.

```
LATITUDE: Latitude of point of interest (e.g. work). Default: null,

LONGITUDE: Longitude of point of interest. Default: null,

MAX_DISTANCE_IN_METERS: Maximum distance in meters to point of interest. Default: null.

TOKEN: Your AirBnb API token.

START_DATE: The date that you intend to start your stay, e.g. "2019-03-01". Default: null.

END_DATE: The date that you intend to end your stay, e.g. "2019-03-03". Default: null.

GUESTS: The number of guests. Default: 1.

SHOW_IMAGES: Whether to show images directly in the terminal. Defaults to true when using Node and false when using Docker.

PERSIST_STATE: Whether to remember previously found listings. Requires MongoDB listening on port 27017. Default: false.

NUM_LISTINGS: Amount of listings to scan through. Default: 20.

CLEAR: Clear persistent storage at runtime. Default: false.

LOCATION: The location to search at. Default: "London".

CURRENCY: The currency to use. Default: "USD".

MIN_PRICE: The min price per night. Default: 0

MAX_PRICE: The max price per night. Default: 10e18

MIN_BEDS: Self-explanatory. Default: 0.

MIN_BEDROOMS: Self-explanatory. Default: 0.

MIN_BATHROOMS: Self-explanatory. Default: 0.

EXTRA_HOST_LANGUAGES: Languages of host as an array, e.g. ["English", "French"]. Default: null

IS_FAMILY_PREFRRED: Is good for families (true/false/null).: Default: null

IS_BUSINESS_TRAVEL_READY: is good for business travel (true/false/null). Default: null.

NEIGHBOURHOOD: Neighbourhood to search at. Default: null.

HOST_HAS_PROFILE_PIC: Whether host has a profile pic (true/false/null). Default: null.

HOST_IS_SUPERHOST: Whether host is a superhost (true/false/null). Default: null.

HOST_MIN_REVIEWS: Min reviews of host. Default: 0.

MIN_STAR_RATING: Min rating for listing in stars. Default: 0.

ROOM_TYPE: Type of room, e.g. 'entire_home'. Default: null.

HAS_DOUBLE_BLIND_REVIEWS: Whether host has double blind reviews. Default: null.

HOST_MIN_RECOMMENDATION_COUNT: Min recommendations of host. Default: 0.

CANCELLATION_POLICY: Cancellation policies acceptable to you, e.g. ["Flexible", "Moderate", "Strict"]. Default. null.

HAS_LICENSE: Whether host is licensed. Default: null.

REQUIRES_LICENSE: Whether host requires license. Default: null.

MAX_CLEANING_FEE_NATIVE: Maximum clenaing fee in host's native currency. Default: null.

MAX_EXTRA_FEE_NATIVE: Maximum extra fee in host's native currency. Default: null.

AMENITIES: Array of amenities you require, e.g. ["Kitchen, "Dryer"]. Default: null.

IS_LOCATION_EXACT: Whether the listing is at its exact location. Default: null.

IS_LANDLORD_PARTNERSHIP: Whether the listing is a landlord partnership. Default: null.

ALLOW_SMOKING: Self-explanatory. Default: null.

ALLOW_PETS: Self-explanatory. Default: null.

SLACK_CHANNEL: Your Slack channel name.

SLACK_WEBHOOK: Your Slack webhook.

SLACK_USERNAME: The Slack username to post with.

USERNAME: Your Airbnb username. Can be used in combination with password instead of API token.

PASSWORD: Your Airbnb password. Can be used in combination with username instead of API token.

MAKE_INQIURIES: Whether to message the matching hosts. Default: false. 

INQUIRY_MESSAGE: Message to send to the hosts. Default: "Hi!"
```

