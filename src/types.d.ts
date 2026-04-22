export type Class = {
  name: string
  instructor: string
  startTime: Date
  endTime: Date
  host: string
  _raw: unknown
}

export type UptownResponse = {
  data: {
    allOfferings: null | unknown
    categories: null | unknown
    categoriesMeta: null | unknown
    classes: UptownClass[]
    offerings: null | unknown
    offeringsMeta: null | unknown
    onDemandProducts: null | unknown
    widget: unknown[]
  }
}

export type UptownClass = {
  name: string
  class_name: string
  description: string
  price: number
  capacity: number
  duration: number // in minutes
  canceled: boolean
  host_name: string
  start_time: number
  end_time: number

  workout_types: string[]
  minimum_price: number
  max_capacity: number
  instructor_id: string
  meet_time: string
  dayOfWeek: string
  id: string
  hidden: boolean
  waitlistLength: number
  total_booked: number
  isBookable: boolean
  isWaitlistFull: boolean

  class_about: string
  created: number
  deleted: boolean
  experience_type: "Class"
  instructor_name: string
  preview_url: string
  zoom_user_id: string
  body_focus: string
  checkoutConfirmation: string
  descriptionHTML: string
  equipment_required: unknown[]
  host_ids: string[]
  intensity: string
  location: {
    address: string
    contentLink: string
    googlePlaceIdentifier: string
    lat: number
    lng: number
    cityState: string
    city: string
    country: string
    line1: string
    line2: string
    postal_code: string
    state: string
    id: string
    name: string
  }
  location_name: string
  location_type: string
  purchase_type: string
  roomId: string
  service_id: string
  livestreamSettings: string
  display: string
  preview_url_displayed: boolean
  challengeId: string
  recurringBookingEnabled: boolean
  purchaseNumberOfCredits: number
  week_position: number
  preparationDirections: {
    html: string
    text: string
  }
  platformID: string
  recurringClassId: string
  scheduledDelayDetailsId: string
  content_link: string
  images: string[]
  color: string
  gympassSlotGenerated: boolean
  gympassError: null
  gympassSlotId: number
  updatedAt: number
  lastBlockedSlot: number
  blockedSlots: number
  fiftyHourReminderSent: boolean
  twentyFourHourReminderSent: boolean
  doesUseAutomaticWaitlist: boolean
  timezoneCalculated: string
  hostData: {
    id: string
    name: string
    profileImageUrl: string
    about: string
    specialGuest: boolean
  }[]
  hostName: string
}

export type YogaZamaResponse = {
  count: number
  next: unknown | null
  previous: unknown | null
  results: YogaZamaClass[]
  meta: {
    pagination: {
      count: number
      pages: number
      page: number
      per_page: number
    }
  }
}

export type YogaZamaClass = {
  id: string
  name: string
  class_type: {
    id: string
    name: string
    description: string
    duration: number // minutes

    duration_formatted: string
    is_live_stream: boolean
  }
  instructors: [
    {
      id: string
      name: string
      bio: string
      instagram_handle: unknown | null
      instagram_url: unknown | null
      photo_urls: { large_url: string; thumbnail_url: string }
      spotify_url: unknown | null
    }
  ]
  available_spot_count: number
  capacity: number
  classroom_name: string
  is_cancelled: boolean
  spot_options: {
    primary_availability: number
    primary_capacity: number
    secondary_availability: number
    secondary_capacity: number
    standby_availability: number
    standby_capacity: number
    waitlist_availability: number
    waitlist_capacity: number
  }
  start_date: string // yyyy-mm-dd
  start_time: string // hh:mm:ss

  booking_start_datetime: string
  is_late_cancel_overridden: boolean
  class_tags: {
    id: string
    name: string
    slug: string
  }[]
  classroom: {
    id: string
    name: string
  }
  geo_check_in_end_datetime: unknown | null
  geo_check_in_start_datetime: unknown | null
  in_live_stream_window: boolean
  is_remaining_spot_count_public: boolean
  is_user_guest_reserved: boolean
  is_user_reserved: boolean
  is_user_waitlisted: boolean
  is_free_class: boolean
  layout_format: string
  location: {
    id: string
    address_line_one: string
    address_line_two: string
    address_line_three: string
    address_sorting_code: unknown | null
    city: string
    currency_code: string
    description: string
    email: string
    gate_geo_check_in_by_distance: boolean
    geo_check_in_distance: number
    is_newsletter_subscription_pre_checked: boolean
    latitude: string
    longitude: string
    primary_language: string
    name: string
    payment_gateway_type: string
    phone_number: string
    postal_code: string
    state_province: string
    timezone: string
    formatted_address: string[]
    listed: boolean
    region: {
      id: string
      name: string
    }
  }
  should_show_studio_address: boolean
  start_datetime: string
  status: unknown | null
  waitlist_count: number
  reservations: []
}

export type V12YogaResponse = {
  contents: string
  use_iframe: boolean
}

// V12Yoga example contents:
//
// <tr
//   class="hc_class"
//   id="70181181754760"
//   data-hc-id="70181181754760"
//   data-hc-mbo-class="9"
//   data-hc-trainer="100000038"
//   data-hc-day="3"
//   data-hc-time-of-day="1"
//   data-hc-mbo-class-id="29618"
//   data-hc-mbo-class-name="all_level_flow"
// >
//   <td class="session__details">
//     <span class="hc_time">
//       <span class="hc_starttime" data-datetime="&quot;2026-04-22T12:00:00.000+00:00&quot;">12:00 PM</span>
//       <span class="hc_endtime" data-datetime="&quot;2026-04-22T13:00:00.000+00:00&quot;"> -  1:00 PM</span></span>
//   </td>
//   <td class="hc_cart_wrapper">
//     <span class="hc_cart_button"></span>
//     <span class="hc_class_availability"></span>
//   </td>
//   <td class="mbo_class">
//     <span class="classname classindex_0 all_level_flow" id="item_29618_mbo_class"><a data-url="https://widgets.mindbodyonline.com/widgets/class_lists/821565604f8/class_description?site_mbo_id=141420&amp;class_description_id=9&amp;widget_type=Schedule" data-bw-identity-site="true" data-hc-open-modal="modal-iframe" rev="iframe" href="">All Level Flow</a></span>
//   </td>
//   <td class="trainer">
//     <span class="trainer" id="item_29618_trainer">
//       <a data-url="https://widgets.mindbodyonline.com/widgets/staff_lists/821565604f8/staff?site_mbo_id=141420&amp;staff_id=100000038&amp;widget_type=Schedule" data-bw-identity-site="true" data-hc-open-modal="modal-iframe" rev="iframe" href="">
//         Sean Beiersdorfer
//       </a>
//     </span>
//   </td>
// </tr>

export type PilatesMethodologyResponse = {
  payload: {
    sessionName: string
    level: string // description
    startsAt: string
    endsAt: string
    durationMinutes: number
    teacher: string

    capacity: number
    id: number
    hostId: number
    remainingSpots: {
      remaining: number
      total: number
    }

    type: string
    image: string
    allowWaitlist: boolean
    link: string
    location: string
    locationId: number
    inPerson: boolean
    price: unknown | null
    fixedTicketPrice: number
    dynamicTicketPriceMin: unknown | null
    ticketsSold: number
    freeEvent: boolean
    ticketPriceType: string
    teacherId: number
    teacherPicture: string
    teacherHasBio: boolean
    originalTeacher: string
    originalTeacherId: number
    additionalTeachers: []
    semester: unknown | null
    course: unknown | null
    isCancelled: boolean
    waitlistCapacity: unknown | null
    waitlistFull: boolean
    requireMembershipBooking: boolean
    currency: string
    salesCutoff: unknown | null
    priceInEventCredits: string
  }[]
  pagination: {
    page: number
    pageSize: number
    totalCount: number
  }
}
