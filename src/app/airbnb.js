const airbnb = require('airbnbapijs');
const axios = require('axios');
const got = require('got');
const terminalImage = require('terminal-image');
const is_docker = require('is-docker');
const geolib = require('geolib');
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));
const INTERVAL = process.env.INTERVAL || 86400000;
const SNOOZE_TIME = 3000;
var mongo;

Date.prototype.add_days = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

setInterval(search, INTERVAL);

async function search(options) {

  var options = options || {};

  function parse_env(env) {
    return env === 'true' ? true : (env === 'false' ? false : env);
  }

  const LATITUDE = options.LATITUDE || parse_env(process.env.LATITUDE) || null;
  const LONGITUDE = options.LONGITUDE || parse_env(process.env.LONGITUDE) || null;
  const MAX_DISTANCE_IN_METERS = options.MAX_DISTANCE_IN_METERS || parse_env(process.env.MAX_DISTANCE_IN_METERS) || null;
  const BASE_ROOM_URL = "https://www.airbnb.com/rooms/";
  const TOKEN = options.TOKEN || parse_env(process.env.TOKEN);
  const USERNAME = options.USERNAME || parse_env(process.env.USERNAME);
  const PASSWORD = options.PASSWORD || parse_env(process.env.PASSWORD);
  const START_DATE = options.START_DATE || parse_env(process.env.START_DATE) || null;
  const END_DATE = options.END_DATE || parse_env(process.env.END_DATE) || null;
  const GUESTS = options.GUESTS || parse_env(process.env.GUESTS) || 1;
  const SHOW_IMAGES = options.SHOW_IMAGES || parse_env(process.env.SHOW_IMAGES ? parse_env(process.env.SHOW_IMAGES) : (is_docker() ? false : true));
  const PERSIST_STATE = options.PERSIST_STATE || parse_env(process.env.PERSIST_STATE) || false;
  if (PERSIST_STATE) mongo = require(__dirname + '/mongo');
  const APPEND_CALENDARS = options.APPEND_CALENDARS || parse_env(process.env.APPEND_CALENDARS) || true;
  const NUM_LISTINGS = options.NUM_LISTINGS || parse_env(process.env.NUM_LISTINGS) || 5;
  const LIMIT = Math.min(NUM_LISTINGS, 20);
  const CLEAR = options.CLEAR || parse_env(process.env.CLEAR) || false;
  const MAKE_INQUIRIES = options.MAKE_INQUIRIES || parse_env(process.env.MAKE_INQUIRIES) || false;
  const PIPE_TO_SLACK = options.PIPE_TO_SLACK || parse_env(process.env.PIPE_TO_SLACK) || false;
  const LOCATION = options.LOCATION || parse_env(process.env.LOCATION) || 'London';
  const CURRENCY = options.CURRENCY || parse_env(process.env.CURRENCY) || 'USD';
  const MIN_BEDROOMS = options.MIN_BEDROOMS || parse_env(process.env.MIN_BEDROOMS) || 0;
  const MIN_BATHROOMS = options.MIN_BATHROOMS || parse_env(process.env.MIN_BATHROOMS) || 0;
  const MIN_BEDS = options.MIN_BEDS || parse_env(process.env.MIN_BEDS) || 0;
  const MIN_PRICE = options.MIN_PRICE || parse_env(process.env.MIN_PRICE) || 0;
  const MAX_PRICE = options.MAX_PRICE || parse_env(process.env.MAX_PRICE) || 1e18;
  const MIN_PIC_COUNT = options.MIN_PIC_COUNT || parse_env(process.env.MIN_PIC_COUNT) || 0;
  const INQUIRY_MESSAGE = options.INQUIRY_MESSAGE || parse_env(process.env.INQUIRY_MESSAGE) || 'Hi!';
  const LOG_VERBOSE = options.LOG_VERBOSE || parse_env(process.env.LOG_VERBOSE) || true;
  const CITY = options.CITY || parse_env(process.env.CITY) || null;
  const EXTRA_HOST_LANGUAGES = parse_env(process.env.EXTRA_HOST_LANGUAGES) ? parse_env(process.env.EXTRA_HOST_LANGUAGES.split(',')) : (options.EXTRA_HOST_LANGUAGES ? options.EXTRA_HOST_LANGUAGES.split(',') : null);
  const IS_BUSINESS_TRAVEL_READY = options.IS_BUSINESS_TRAVEL_READY || parse_env(process.env.IS_BUSINESS_TRAVEL_READY) || null;
  const IS_FAMILY_PREFERRED = options.IS_FAMILY_PREFERRED || parse_env(process.env.IS_FAMILY_PREFERRED) || null;
  const LOCALIZED_CITY = options.LOCALIZED_CITY || parse_env(process.env.LOCALIZED_CITY) || null;
  const NEIGHBOURHOOD = options.NEIGHBOURHOOD || parse_env(process.env.NEIGHBOURHOOD) || null;
  const PERSON_CAPACITY = options.PERSON_CAPACITY || parse_env(process.env.PERSON_CAPACITY) || null;
  const HOST_HAS_PROFILE_PIC = options.HOST_HAS_PROFILE_PIC || parse_env(process.env.HOST_HAS_PROFILE_PIC) || null;
  const HOST_IS_SUPERHOST = options.HOST_IS_SUPERHOST || parse_env(process.env.HOST_IS_SUPERHOST) || null;
  const HOST_LATEST_CREATED_AT = options.HOST_LATEST_CREATED_AT || parse_env(process.env.HOST_LATEST_CREATED_AT) || null;
  const HOST_MIN_REVIEWS = options.HOST_MIN_REVIEWS || parse_env(process.env.HOST_MIN_REVIEWS) || 0;
  const ROOM_TYPE = options.ROOM_TYPE || parse_env(process.env.ROOM_TYPE) || null;
  const MIN_STAR_RATING = options.MIN_STAR_RATING || parse_env(process.env.MIN_STAR_RATING) || 0;
  const MIN_NIGHTLY_PRICE = options.MIN_NIGHTLY_PRICE || parse_env(process.env.MIN_NIGHTLY_PRICE) || 0;
  const MAX_NIGHTLY_PRICE = options.MAX_NIGHTLY_PRICE || parse_env(process.env.MAX_NIGHTLY_PRICE) || 1e18;
  const HAS_DOUBLE_BLIND_REVIEWS = options.HAS_DOUBLE_BLIND_REVIEWS || parse_env(process.env.HAS_DOUBLE_BLIND_REVIEWS) || null;
  const HOST_MIN_REVIEWEE_COUNT = options.HOST_MIN_REVIEWEE_COUNT || parse_env(process.env.HOST_MIN_REVIEWEE_COUNT) || null;
  const HOST_MIN_RECOMMENDATION_COUNT = options.HOST_MIN_RECOMMENDATION_COUNT || parse_env(process.env.HOST_MIN_RECOMMENDATION_COUNT) || null;
  const CANCELLATION_POLICY = parse_env(process.env.CANCELLATION_POLICY) ? parse_env(process.env.CANCELLATION_POLICY.split(',')) : (options.CANCELLATION_POLICY ? options.CANCELLATION_POLICY.split(',') : null);
  const BED_TYPE = options.BED_TYPE || parse_env(process.env.BED_TYPE) || null;
  const REQUIRE_GUEST_PROFILE_PICTURE = options.REQUIRE_GUEST_PROFILE_PICTURE || parse_env(process.env.REQUIRE_GUEST_PROFILE_PICTURE) || null;
  const REQUIRE_GUEST_PHONE_VERIFICATION = options.REQUIRE_GUEST_PHONE_VERIFICATION || parse_env(process.env.REQUIRE_GUEST_PHONE_VERIFICATION) || null;
  const CANCEL_POLICY = options.CANCEL_POLICY || parse_env(process.env.CANCEL_POLICY) || null;
  const SQUARE_FEET = options.SQUARE_FEET || parse_env(process.env.SQUARE_FEET) || null;
  const HAS_LICENSE = options.HAS_LICENSE || parse_env(process.env.HAS_LICENSE) || null;
  const REQUIRES_LICENSE = options.REQUIRES_LICENSE || parse_env(process.env.REQUIRES_LICENSE) || null;
  const MAX_CLEANING_FEE_NATIVE = options.MAX_CLEANING_FEE_NATIVE || parse_env(process.env.MAX_CLEANING_FEE_NATIVE) || null;
  const MAX_EXTRA_FEE_NATIVE = options.MAX_EXTRA_FEE_NATIVE || parse_env(process.env.MAX_EXTRA_FEE_NATIVE) || null;
  const ACCESS = options.ACCESS || parse_env(process.env.ACCESS) || null;
  const AMENITIES = options.AMENITIES || parse_env(process.env.AMENITIES) ? parse_env(process.env.AMENITIES.split(',')) : null;
  const IS_LOCATION_EXACT = options.IS_LOCATION_EXACT || parse_env(process.env.IS_LOCATION_EXACT) || null;
  const IN_LANDLORD_PARTNERSHIP = options.IN_LANDLORD_PARTNERSHIP || parse_env(process.env.IN_LANDLORD_PARTNERSHIP) || null;
  const ALLOW_SMOKING = options.ALLOW_SMOKING || parse_env(process.env.ALLOW_SMOKING) || null;
  const ALLOW_PETS = options.ALLOW_PETS || parse_env(process.env.ALLOW_PETS) || null;

  var SEARCH_OPTIONS = {
    location: LOCATION,
    offset: 0,
    limit: LIMIT,
    language: 'en-US',
    currency: CURRENCY,
    guests: GUESTS,
    minBathrooms: MIN_BATHROOMS,
    minBedrooms: MIN_BEDROOMS,
    minBeds: MIN_BEDS,
    minPrice: MIN_PRICE,
    maxPrice: MAX_PRICE,
    minPicCount: MIN_PIC_COUNT,
    sortDirection: 1
  };

  var CALENDAR_OPTIONS = {
    month: new Date(START_DATE).getMonth()+1,
    year: 2019,
    count: (new Date(END_DATE).getMonth()+1)-(new Date(START_DATE).getMonth()+1)
  };

  var PRIVATE_CALENDAR_OPTIONS = {
    startDate: START_DATE,
    endDate: END_DATE,
  };

  var START_THREAD_OPTIONS = {
    checkIn: START_DATE,
    checkOut: END_DATE,
    guestNum: GUESTS,
    message: INQUIRY_MESSAGE
  }

  var SLACK_OPTIONS = {
    webhook: options.SLACK_WEBHOOK || parse_env(process.env.SLACK_WEBHOOK),
    channel: options.SLACK_CHANNEL || parse_env(process.env.SLACK_CHANNEL),
    username: options.SLACK_USERNAME || parse_env(process.env.SLACK_USERNAME)
  }

  var token = USERNAME && PASSWORD ? await get_token({username: USERNAME, password: PASSWORD}) : TOKEN;
  var authenticated = await authenticate(TOKEN);
  var logged_job = log_job(options);
  var listings = await get_listings(SEARCH_OPTIONS);
  var filtered_listings = filter_additional(listings);
  var calendared_listings = APPEND_CALENDARS ? await append_calendars(filtered_listings, CALENDAR_OPTIONS) : [];
  var advance_listings = filter_advanced(calendared_listings);
  var within_distance = MAX_DISTANCE_IN_METERS !== null ? filter_outside_distance(advance_listings) : advance_listings;
  var available_listings = (START_DATE !== null && END_DATE !== null) ? filter_unavailable(within_distance, START_DATE, END_DATE) : within_distance;
  var created_threads = await create_threads(available_listings, START_THREAD_OPTIONS, SLACK_OPTIONS);
  if (LOG_VERBOSE) await log_result(available_listings, created_threads, listings, within_distance);
  return {available_listings: available_listings, created_threads: created_threads};

  async function get_token(options) {
    var token = await airbnb.login(options);
    return token;
  }

  async function authenticate(token) {
    var logged_in = await airbnb.testAuth(token);
    var set_token = await airbnb.setDefaultToken(token);
    return logged_in;
  }

  async function get_listings(options) {
    var total = Infinity;
    var listings = [];
    while (options.offset < Math.min(NUM_LISTINGS, total)) {
      log_fetching_listings(options.limit);
      var result = await airbnb.listingSearch(options);
      listings = listings.concat(result.search_results);
      total = result.metadata.listings_count;
      options.offset = options.offset + result.search_results.length;
    }
    return listings;
  }

  async function append_calendars(listings, options) {
    var calendars = [];
    for (var listing of listings) {
      calendars.push(get_calendar(listing, options));
    }
    var done = await Promise.all(calendars);
    return listings;
  }

  async function get_calendar(listing, options) {
    options.id = listing.listing.id;
    log_fetching_calendar(listing);
    var calendar = await airbnb.getPublicListingCalendar(options);
    var days = calendar ? calendar.calendar_months.map(e => e.days).reduce((a,b) => a.concat(b), []) : [];
    var available_days = days ? days.filter(e => e.available) : [];
    listing.days = days;
    listing.available_days = available_days;
    var additional_info = await airbnb.getListingInfo(listing.listing.id);
    listing.additional_info = additional_info;
  }

  async function create_threads(listings, create_options, slack_options) {
    if (CLEAR) await mongo.drop_listings();
    var threads = [];
    for (var listing of listings) {
      create_options.id = listing.listing.id;
      var saved_listing = PERSIST_STATE ? await mongo.insert_contacted_listing(listing) : true;
      if (saved_listing !== true) continue;
      if (PIPE_TO_SLACK) log_notifying(listing);
      var piped_to_slack = PIPE_TO_SLACK ? await pipe_to_slack(listing, slack_options) : null;
      if (MAKE_INQUIRIES) log_creating_thread(listing);
      var started_thread = MAKE_INQUIRIES ? await airbnb.createThread(create_options) : null;
      if (started_thread) threads.push(started_thread);
    }
    var closed_connection = mongo ? await mongo.close_connection() : null;
    return threads;
  }

  async function pipe_to_slack(listing, options) {
    var piped = await axios.post(options.webhook, {
          channel: options.channel,
          username: options.username,
          text: format_listing(listing) + "\n" + listing.listing.picture_url,
          icon_emoji: ':printer:',
    });
    return piped;
  }

  function filter_outside_distance(listings) {
    return listings.filter(e => {
      var distance = geolib.getDistance(
        {latitude: e.listing.lat, longitude: e.listing.lng},
        {latitude: LATITUDE, longitude: LONGITUDE}
      );
      e.distance = distance;
      return distance < MAX_DISTANCE_IN_METERS;
    });
  }

  function filter_unavailable(listings, start, end) {
    var needed_days = get_dates(new Date(start), new Date(end)).map(e => format_date(e));
    return listings.filter(e => has_all(needed_days, e.days.filter(e => e.available).map(e => e.date)) && e.days.filter(e => needed_days.length < e.min_nights).length === 0 && e.days.filter(e => needed_days.length > e.max_nights).length === 0);
  }

  function filter_additional(listings) {
    var filtered = listings.filter(e => {
    return  (CITY ? e.listing.city === CITY : true)
        &&  (EXTRA_HOST_LANGUAGES !== null ? has_all(EXTRA_HOST_LANGUAGES, e.listing.extra_host_languages) : true)
        &&  (IS_BUSINESS_TRAVEL_READY !== null ? e.listing.is_business_travel_ready === IS_BUSINESS_TRAVEL_READY : true)
        &&  (IS_FAMILY_PREFERRED !== null ? e.listing.is_family_preferred === IS_FAMILY_PREFERRED : true)
        &&  (LOCALIZED_CITY !== null ? e.listing.localized_city === LOCALIZED_CITY : true)
        &&  (NEIGHBOURHOOD !== null ? e.listing.neighbourhood === NEIGHBOURHOOD : true)
        &&  (PERSON_CAPACITY !== null ? e.listing.person_capacity === PERSON_CAPACITY : true)
        &&  (HOST_HAS_PROFILE_PIC !== null ? e.listing.primary_host.has_profile_pic === HOST_HAS_PROFILE_PIC : true)
        &&  (HOST_LATEST_CREATED_AT !== null ? new Date(e.listing.primary_host.created_at).getTime() < new Date(HOST_LATEST_CREATED_AT).getTime() : true)
        &&  (HOST_IS_SUPERHOST !== null ? e.listing.primary_host.is_superhost === HOST_IS_SUPERHOST : true)
        &&  (HOST_MIN_REVIEWS !== null ? e.listing.reviews_count >= HOST_MIN_REVIEWS : true)
        &&  (ROOM_TYPE !== null ? e.listing.room_type_category === ROOM_TYPE : true)
        &&  (MIN_STAR_RATING !== null ? e.listing.star_rating >= MIN_STAR_RATING : true)
        &&  (MIN_NIGHTLY_PRICE !== null ? e.pricing_quote.nightly_price >= MIN_NIGHTLY_PRICE : true)
        &&  (MAX_NIGHTLY_PRICE !== null ? e.pricing_quote.nightly_price <= MAX_NIGHTLY_PRICE : true);
    });
    return filtered;
  }

  function filter_advanced(listings) {
    var filtered = listings.filter(e => {
    return  (HAS_DOUBLE_BLIND_REVIEWS !== null ? e.additional_info.listing.has_double_blind_reviews === HAS_DOUBLE_BLIND_REVIEWS : true)
        &&  (HOST_MIN_REVIEWEE_COUNT !== null ? e.additional_info.listing.primary_host.reviewee_count >= HOST_MIN_REVIEWEE_COUNT : true)
        &&  (HOST_MIN_RECOMMENDATION_COUNT !== null ? e.additional_info.listing.primary_host.recommendation_count >= HOST_MIN_RECOMMENDATION_COUNT : true)
        &&  (CANCELLATION_POLICY ? intersect(CANCELLATION_POLICY, [e.additional_info.listing.cancel_policy_short_str]) : true)
        &&  (BED_TYPE !== null ? e.additional_info.listing.bed_type === BED_TYPE : true)
        &&  (REQUIRE_GUEST_PROFILE_PICTURE !== null ? e.additional_info.listing.require_guest_profile_picture === REQUIRE_GUEST_PROFILE_PICTURE : true)
        &&  (REQUIRE_GUEST_PHONE_VERIFICATION !== null ? e.additional_info.listing.require_guest_phone_verification === REQUIRE_GUEST_PHONE_VERIFICATION : true)
        &&  (CANCEL_POLICY !== null ? e.additional_info.listing.cancel_policy === CANCEL_POLICY : true)
        &&  (SQUARE_FEET !== null ? e.additional_info.listing.square_feet === SQUARE_FEET : true)
        &&  (HAS_LICENSE !== null ? e.additional_info.listing.has_license === HAS_LICENSE : true)
        &&  (REQUIRES_LICENSE !== null ? e.additional_info.listing.requires_license === REQUIRES_LICENSE : true)
        &&  (MAX_CLEANING_FEE_NATIVE !== null ? e.additional_info.listing.cleaning_fee_native <= MAX_CLEANING_FEE_NATIVE : true)
        &&  (MAX_EXTRA_FEE_NATIVE !== null ? e.additional_info.listing.extra_fee_native <= MAX_EXTRA_FEE_NATIVE : true)
        &&  (ACCESS !== null ? e.additional_info.listing.access === ACCESS : true)
        &&  (AMENITIES !== null ? has_all(AMENITIES, e.additional_info.listing.amenities) : true)
        &&  (IS_LOCATION_EXACT !== null ? e.additional_info.listing.is_location_exact === IS_LOCATION_EXACT : true)
        &&  (IN_LANDLORD_PARTNERSHIP !== null ? e.additional_info.listing.in_landlord_partnership === IN_LANDLORD_PARTNERSHIP : true)
        &&  (ALLOW_SMOKING !== null ? e.additional_info.listing.guest_controls.allows_smoking_as_host === ALLOW_SMOKING : true)
        &&  (ALLOW_PETS !== null ? e.additional_info.listing.guest_controls.allows_pets_as_host === ALLOW_PETS : true);
    });
    return filtered;
  }

  function has_all(arr1, arr2) {
    return arr1.every(elem => arr2.indexOf(elem) > -1);
  }

  function intersect(arr1, arr2) {
    return arr1.filter(elem => arr2.indexOf(elem) > -1).length > 0;
  }

  function get_dates(startDate, stopDate) {
      var dateArray = new Array();
      var currentDate = startDate;
      while (currentDate <= stopDate) {
          dateArray.push(new Date (currentDate));
          currentDate = currentDate.add_days(1);
      }
      return dateArray;
  }

  function format_date(date) {
      var d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [year, month, day].join('-');
  }

  function pretty_print_date(date) {
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' ' + year;
  }

  function format_listing(listing) {
    var summary = listing.additional_info ? listing.additional_info.listing.summary + "\n" : '';
    var url = '\nURL: '
    return summary + url + BASE_ROOM_URL + new String(listing.listing.id);
  }

  function log_fetching_listings(limit) {
    console.log("Fetching " + limit + " new listings...")
  }

  function log_fetching_calendar(listing) {
    console.log("Fetching calendar for listing with id: " + listing.listing.id);
  }

  function log_creating_thread(listing) {
    console.log("Creating thread for listing with id: " + listing.listing.id);
  }

  function log_notifying(listing) {
    console.log("Notifying you for listing with id: " + listing.listing.id);
  }

  function log_job(OPTIONS) {
    console.log("\x1b[37m", "Searching for listings in the vicinity of " + LOCATION);
    if (START_DATE && END_DATE) console.log("\x1b[33m", "Including listings available from the " + pretty_print_date(new Date(START_DATE)) + " to the " + pretty_print_date(new Date(END_DATE)));
    if (MAX_DISTANCE_IN_METERS) console.log("\x1b[32m", "Inluding listings within " + MAX_DISTANCE_IN_METERS/1000 + " km" + " of latitude " + LATITUDE + " and longitude " + LONGITUDE);
    console.log("\x1b[31m", "Listings to scan in total: " + NUM_LISTINGS);
    console.log("\x1b[35m", "Inquire about availability: " + MAKE_INQUIRIES);
    if (MAKE_INQUIRIES) console.log("\x1b[35m", "Message to host: " + INQUIRY_MESSAGE);
    console.log("\x1b[33m", "Send pictures to Slack: " + PIPE_TO_SLACK);
    console.log("\x1b[37m", "Persist state: " + PERSIST_STATE);
 }

  async function log_result(available_listings, threads, all_listings, filtered_listings) {
    console.log("\n");
    console.log("_________________________________________________________________________________________");
    console.log("\n");
    for (var listing of available_listings.reverse()) {
      const {body} = await got(listing.additional_info.listing.xl_picture_url, {encoding: null});
  	  if (SHOW_IMAGES) console.log(await terminalImage.buffer(body));
      console.log(format_listing(listing));
      if (START_DATE && END_DATE) console.log("\x1b[33m", "Available from the " + pretty_print_date(new Date(START_DATE)) + " to the " + pretty_print_date(new Date(END_DATE)));
      console.log("\x1b[35m", "Price per night: " + listing.pricing_quote.nightly_price + " " + CURRENCY);
      console.log("\x1b[37m", "Price per month: " + listing.pricing_quote.nightly_price * 30 + " " + CURRENCY);
      console.log("\x1b[32m", "Reviews: " + listing.listing.reviews_count);
      console.log("\x1b[33m", "Rating: " + listing.listing.star_rating + " stars");
      console.log("\x1b[33m", "Pictures: " + listing.additional_info.listing.xl_picture_url);
      if (MAX_DISTANCE_IN_METERS) console.log("\x1b[32m", "Distance from point of interest: " + listing.distance/1000 + " km");
      console.log("________________________________________________________________________________________");
      console.log("\n");
      await snooze(SNOOZE_TIME);
    }
    console.log("\x1b[35m", "# of examined listings: " + all_listings.length);
    console.log("\x1b[35m", "# of listings that fit your criteria: " + filtered_listings.length);
    if (START_DATE && END_DATE) console.log("\x1b[33m", "# of listings available from the " + pretty_print_date(new Date(START_DATE)) + " to the " + pretty_print_date(new Date(END_DATE)) + ": " + available_listings.length);
    console.log("\x1b[33m", "# of initialized inquiries: " + threads.length);
    console.log("\x1b[32m", "Trying again at " + new Date(Date.now() + INTERVAL));
  }

}

module.exports = {
  search: search
}
