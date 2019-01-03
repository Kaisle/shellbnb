const airbnb = require(__dirname + '/airbnb')

airbnb.search({
  START_DATE: '2019-03-22',
  END_DATE: '2019-03-24',
  LATITUDE: '35.699890',
  LONGITUDE: '139.689316',
  LOCATION: 'Toshima, Tokyo',
  MAX_DISTANCE_IN_METERS: 10000,
  NUM_LISTINGS: 10,
  MAKE_INQUIRIES: false,
  PIPE_TO_SLACK: false
});
