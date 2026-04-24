# TUXEDO CONCIERGE — Complete Application Documentation

## Overview

Tuxedo Concierge is a luxury ride-management mobile application built with React Native (Expo).
It is designed for hotel concierge staff and managers to book, dispatch, and track premium
chauffeur rides for hotel guests. The app also includes a passenger-facing ride tracking flow
accessible via a deep link sent to the guest.

- Platform: React Native (Expo) — iOS & Android
- Design Language: Glassmorphism, black background, gold (#D4AF37) accents
- State Management: React Context API (AppContext)
- Navigation: React Navigation (Native Stack)
- Persistent Storage: AsyncStorage (membership state, coupons)
- Pricing: Base fare $45.00 (card), $54.00 (cash, 20% surcharge), 15% commission rate

---

## User Roles

| Role       | Description                                              |
|------------|----------------------------------------------------------|
| Concierge  | Hotel staff who books and manages rides for guests       |
| Manager    | Hotel management with access to performance dashboards   |
| Passenger  | Hotel guest who receives a tracking link (web/deep link) |

---

## Application Architecture

### Navigation Stack (App.tsx)

All screens are registered in a single Native Stack Navigator with no visible headers.
The initial route is "Login". Transitions use slide_from_right animation.

```
Login
  └─> Home (ConciergeHomeScreen)
        ├─> GuestDetails
        │     └─> WaitingForPayment ──> Home
        ├─> ScheduleBooking
        │     └─> WaitingForPayment ──> Home
        ├─> DriverAssignmentMode
        │     ├─> DriverMatching ──> DriverETA
        │     ├─> DriverList
        │     │     └─> DriverProfile ──> DriverConfirmation ──> DriverETA
        │     └─> DriverSwipe ──> DriverProfile ──> DriverConfirmation ──> DriverETA
        ├─> DriverETA ──> ActiveRide ──> RideCompletion ──> Home
        ├─> Profile ──> Login (logout)
        ├─> CommissionWallet
        ├─> RideHistory
        ├─> TrackRide (Passenger Flow)
        │     ├─> Membership ──> MembershipPayment ──> DriverList ──> TrackRide
        │     └─> DriverList ──> TrackRide
        ├─> Membership ──> MembershipPayment ──> DriverList
        └─> MembershipPayment ──> DriverList
```

### Global State (AppContext)

| State Field   | Type         | Purpose                                  |
|---------------|--------------|------------------------------------------|
| user          | User or null | Logged-in concierge/manager profile      |
| setUser       | Dispatch     | Update user (also used for logout)       |
| rides         | Ride[]       | All rides created in the session         |
| setRides      | Dispatch     | Add/update rides                         |
| activeRide    | Ride or null | Currently active ride                    |
| setActiveRide | Dispatch     | Update active ride state                 |
| commissions   | Commission[] | Commission records                       |
| setCommissions| Dispatch     | Update commission records                |

---

## Data Models (types/index.ts)

### User
```
id            string
name          string
email         string
phone         string
role          'concierge' | 'manager' | 'passenger'
hotelId       string
hotelName     string
deviceBound   boolean
deviceName    string (optional)
kycStatus     'pending' | 'approved' | 'rejected'
isMember      boolean
rideCredit    number
```

### Driver
```
id              string
name            string
phone           string
photo           string
vehicle         { brand, model, plate, year, interior, photo, color }
rating          number
experience      string | number
eta             number (minutes)
distance        number (miles)
verified        boolean
hotelPreferred  boolean
vipOnly         boolean (optional)
backgroundCheck boolean (optional)
languages       string[] (optional)
status          string (optional)
acceptanceRate  number (optional)
onTimeRate      number (optional)
chauffeurId     string (optional)
amenities       { wifi, music, childSeat, refreshments, water, charger, luggage, wheelchair, silentMode }
```

### Ride
```
id            string
status        'creating'|'matching'|'assigned'|'arriving'|'onboard'|'enroute'|'completed'|'cancelled'
guestInfo     { phone, email, present }
pickupLocation string
destination   string (optional)
vehicleType   'sedan'|'suv'|'luxury'|'van'
paymentType   'card'|'cash'
fare          number
commission    number
driver        Driver (optional)
createdBy     string
createdAt     Date
completedAt   Date (optional)
addOns        string[] (optional)
cashConfirmed boolean (optional)
rating        number (optional)
tip           number (optional)
isScheduled   boolean (optional)
scheduledAt   Date (optional)
```

### Commission
```
date   string
rides  number
total  number
```

---

## Mock Driver Data (mockDrivers.ts)

Five pre-defined luxury chauffeurs are available throughout the app:

| # | Name              | Vehicle                    | Rating | ETA  | Special Flags              |
|---|-------------------|----------------------------|--------|------|----------------------------|
| 1 | Michael Thompson  | Mercedes-Benz S-Class 2024 | 4.9    | 3min | Hotel Preferred            |
| 2 | Sarah Martinez    | BMW 7 Series 2023          | 4.8    | 5min | Hotel Preferred, Wheelchair|
| 3 | James Anderson    | Rolls-Royce Phantom 2024   | 5.0    | 7min | VIP Only, Hotel Preferred  |
| 4 | David Chen        | Cadillac Escalade ESV 2024 | 4.7    | 4min | Wheelchair, Large Luggage  |
| 5 | Emily Roberts     | Mercedes-Benz Maybach S680 | 4.9    | 6min | VIP Only, Hotel Preferred  |

All drivers are verified, background-checked, and carry amenities including WiFi, water,
charger, music, and silent mode (except David Chen).

---

## Pricing Logic (utils/pricing.ts)

| Payment Type | Fare    | Formula              |
|--------------|---------|----------------------|
| Card         | $45.00  | BASE_FARE            |
| Cash         | $54.00  | BASE_FARE × 1.20     |

Commission = Fare × 0.15 (15%)

---

---

# SCREEN-BY-SCREEN FEATURE BREAKDOWN

---

## Screen 1 — Login Screen

File: src/screens/LoginScreen.tsx
Route: "Login"

### Purpose
Entry point of the app. Authenticates hotel staff via phone number or email using OTP
(One-Time Password) verification. Supports two roles: Concierge and Manager.

### Features

1. Role Selector
   - Toggle between "Concierge" and "Manager" roles
   - Active role highlighted with gold background
   - Role is stored in the user object after login

2. Contact Input
   - Accepts phone number (default) or email address
   - Phone keyboard shown for phone input
   - Input validated before OTP can be sent

3. Demo Accounts (Quick Fill)
   - Two demo accounts shown in a box:
     - +1 (555) 100-0001 — Concierge Demo
     - +1 (555) 200-0002 — Manager Demo
   - Tap any demo account to auto-fill the contact field

4. Send OTP
   - Button enabled only when contact field is non-empty
   - Transitions to OTP entry view on press

5. OTP Entry View
   - 6 individual digit input boxes
   - Auto-advances focus to next box on digit entry
   - Auto-submits when all 6 digits are filled
   - Back button returns to contact entry

6. OTP Timer & Resend
   - 30-second countdown timer shown after OTP is sent
   - "Resend OTP" button appears after timer expires
   - Resend clears OTP fields and restarts timer

7. Demo OTP (Quick Fill)
   - Demo code "123456" shown in a tappable box
   - Tap auto-fills all 6 digits and immediately verifies

8. OTP Verification
   - On successful verification, loads persisted membership state from AsyncStorage
   - Creates user object with:
     - id: '1'
     - name: 'James Anderson'
     - email: derived from contact (or default)
     - phone: derived from contact (or default)
     - role: selected role
     - hotelId: 'hotel-1'
     - hotelName: 'The Grand Majestic Hotel'
     - deviceBound: true
     - deviceName: 'Concierge Desk Mobile'
     - kycStatus: 'approved'
     - isMember: loaded from AsyncStorage
     - rideCredit: loaded from AsyncStorage (0 if not member)
   - Navigates to "Home" using navigation.replace (no back stack)

9. Security Footer
   - "Secure Device-Bound Authentication" label at bottom

### Navigation
- On successful OTP verification → Home (replace, no back)

---

## Screen 2 — Concierge Home Screen

File: src/screens/ConciergeHomeScreen.tsx
Route: "Home"

### Purpose
Main dashboard for the concierge. Central hub for all actions: booking rides, viewing
stats, accessing history, wallet, and tracking.

### Features

1. Header
   - Displays logged-in user's name (large, white)
   - Displays hotel name below name (gray)
   - Profile icon button (top right) → navigates to Profile screen

2. Primary CTA Card — Request Guest Transport
   - Animated floating car icon (bounces up/down in loop)
   - "Request Guest Transport" title
   - "Call a Car" button (primary gold) → navigates to GuestDetails
     - Passes bookingMode: 'instant' and pickupLocation (hotel name)
   - "Reserve a Ride" button (secondary outline) → navigates to ScheduleBooking
     - Shows "Schedule Reservation" sub-label
   - Italic note: "Tracking link will be sent automatically to the guest"

3. Stats Grid (2×2)
   Four stat cards displayed in a responsive grid:
   - Today's Earnings: $142.50
   - Rides Today: 12
   - Weekly Growth: +15%
   - Recent Payout: $856
   (All mock/static data)

4. Secondary Action Buttons (ghost style)
   - "Ride History" → navigates to RideHistory
   - "Commission Wallet" → navigates to CommissionWallet
   - "Passenger Track Ride" → navigates to TrackRide

### Navigation
- Profile icon → Profile
- Call a Car → GuestDetails (instant mode)
- Reserve a Ride → ScheduleBooking
- Ride History → RideHistory
- Commission Wallet → CommissionWallet
- Passenger Track Ride → TrackRide

---

## Screen 3 — Guest Details Screen

File: src/screens/GuestDetailsScreen.tsx
Route: "GuestDetails"
Params received: bookingMode ('instant'), pickupLocation (hotel name)

### Purpose
Collects guest contact information before dispatching a chauffeur. Also allows the
concierge to preview and share the passenger tracking deep link.

### Features

1. Back Button → returns to Home

2. Contact Method Toggle
   - Default: Phone Number input
   - Toggle link: "Don't have a phone? Use Email instead" / "Use Phone Number instead"
   - Animated transition between phone and email input fields

3. Phone Input
   - Phone number keyboard
   - Enabled when length > 5 characters

4. Email Input
   - Email keyboard, auto-lowercase
   - Real-time validation: must match standard email format
   - Inline error message shown for invalid email

5. Preview Passenger Link
   - "Preview Passenger Link" button (dashed border, shown before link is generated)
   - Generates a unique tracking URL:
     Format: https://conciergeapptuxedo.vercel.app/track-ride?token=XXXXXXXX&pickup=<hotel>
   - Token is random 8-character alphanumeric string

6. Generated Link Display Box
   - Shows the full passenger deep link URL
   - "Copy" button — copies link to clipboard, shows "Copied!" confirmation for 2 seconds
   - "Share" button — opens native share sheet with message:
     "Your Tuxedo Chauffeur is ready. Tap to track your ride: <link>"
   - Note: "Tap the link on iOS/Android to open the Passenger app directly"

7. Send Chauffeur Request Button
   - Disabled until valid contact is entered
   - On press: generates passenger link and navigates to WaitingForPayment
   - Passes: guestPhone, guestEmail, bookingMode, pickupLocation, passengerLink

### Navigation
- Back → Home
- Send Chauffeur Request → WaitingForPayment

---

## Screen 4 — Schedule Booking Screen

File: src/screens/ScheduleBookingScreen.tsx
Route: "ScheduleBooking"

### Purpose
Multi-step wizard for scheduling a future ride. Collects guest contact, date/time,
and chauffeur preference before confirming the booking.

### Features

1. Step Progress Indicator
   - 4 dots connected by lines at the top
   - Active steps highlighted in gold
   - Steps: guest → schedule → chauffeur → confirm

2. Step 1 — Guest Info
   - Same phone/email toggle as GuestDetails screen
   - Phone or email input with validation
   - "Send Ride Request" button → advances to step 2

3. Step 2 — Date & Time Selection
   - Date picker: tapping the date field opens a custom Calendar Modal
   - Calendar Modal features:
     - Month/year header with left/right navigation arrows
     - 7-column day grid (Sun–Sat)
     - Past dates and out-of-month dates are disabled (grayed out)
     - Today's date has a gold border
     - Selected date has gold background
     - Tap a date to select and close modal
   - Time input: free-text field (HH:MM format)
   - Summary box appears when both date and time are filled:
     "Scheduled For: YYYY-MM-DD at HH:MM"
   - "Continue" button → advances to step 3

4. Step 3 — Chauffeur Selection
   - Two options presented as selectable cards:
     - "Yes, Choose a Chauffeur" — Browse and select a preferred driver
     - "Auto-Assign" — Best available chauffeur will be assigned
   - If "Yes, Choose a Chauffeur" selected → navigates to DriverList
   - If "Auto-Assign" selected → advances to step 4

5. Step 4 — Confirm Booking
   - Summary box showing scheduled date and time
   - "Confirm Booking" button → navigates to WaitingForPayment
   - Passes: bookingMode 'scheduled', scheduledDate, scheduledTime,
     chooseChauffeur, guestPhone/guestEmail, pickupLocation

### Navigation
- Back (step 1) → Home
- Back (steps 2–4) → previous step
- Choose Chauffeur → DriverList
- Confirm Booking → WaitingForPayment

---

---

## Screen 5 — Waiting For Payment Screen

File: src/screens/WaitingForPaymentScreen.tsx
Route: "WaitingForPayment"
Params received: guestPhone, guestEmail, bookingMode, pickupLocation, passengerLink,
                 scheduledDate, scheduledTime, chooseChauffeur

### Purpose
Confirmation screen shown to the concierge after a ride request is sent. Indicates
the system is waiting for the guest to enter their destination and complete payment
on the passenger-facing web app.

### Features

1. Animated Loader
   - Spinning gold ring (CSS-style spinner animation, 1.2s loop)
   - Pulsing car icon in the center of the spinner

2. Status Message
   - Title: "REQUEST SENT"
   - Subtitle: "The automated tracking link has been sent to the guest. Waiting for
     destination entry and payment."

3. Status Badge
   - "Status: Chauffeur Radar Active" — gold text on dark background

4. Return to Dashboard Button (primary gold)
   - Navigates back to Home

5. Resend Tracking SMS Button
   - Ghost button (no navigation wired — UI placeholder)
   - Label: "Resend Tracking SMS"

6. Back Link
   - Small back arrow + "Back" text → returns to previous screen

7. Footer Note
   - "Concierge will be notified once the passenger completes the secure payment flow."

### Navigation
- Return to Dashboard → Home
- Back → previous screen (GuestDetails or ScheduleBooking)

---

## Screen 6 — Driver Assignment Mode Screen

File: src/screens/DriverSelectionScreens.tsx
Route: "DriverAssignmentMode"

### Purpose
Lets the concierge choose how to assign a chauffeur to the ride. Three modes available.

### Features

1. Back Button → returns to previous screen

2. Three Assignment Mode Cards (animated, staggered entry)

   a) Auto Match
      - Icon: Zap (lightning bolt)
      - Description: "System selects best available driver"
      - Navigates to: DriverMatching (auto-matching flow)

   b) Manual Selection
      - Icon: List
      - Description: "Browse and choose from available drivers"
      - Navigates to: DriverList

   c) Swipe Match
      - Icon: Heart
      - Description: "Luxury experience - swipe to find perfect match"
      - Navigates to: DriverSwipe

### Navigation
- Auto Match → DriverMatching
- Manual Selection → DriverList
- Swipe Match → DriverSwipe

---

## Screen 7 — Driver Matching Screen (Auto Match)

File: src/screens/DriverMatchingScreen.tsx
Route: "DriverMatching"

### Purpose
Animated loading screen shown while the system automatically finds the best available
driver. Auto-advances to DriverETA after 4 seconds.

### Features

1. Animated Car Icon
   - Pulsing gold glow ring behind the car icon (scale 0.8→1.4, loop)
   - Car icon gently scales up/down (1.0→1.05, loop)

2. Status Text
   - Title: "FINDING YOUR CHAUFFEUR"
   - Subtitle: "Connecting you with the closest available premium vehicle..."

3. Spinning Loader
   - Gold ring spinner (1.2s rotation loop)

4. Auto-Navigation
   - After 4000ms, automatically navigates to DriverETA

5. Cancel Request Button
   - Small text button at bottom
   - Navigates to Home (cancels the ride request)

### Navigation
- Auto (4s timer) → DriverETA
- Cancel Request → Home

---

## Screen 8 — Driver List Screen

File: src/screens/DriverSelectionScreens.tsx
Route: "DriverList"
Params received: fromTrackRide (boolean), paymentMethod (string or null)

### Purpose
Displays all available chauffeurs in a scrollable list. Supports filtering (members only).
Used in both the concierge booking flow and the passenger track-ride flow.

### Features

1. Header Row
   - Back button
   - Ride Credit Badge (shown only for Gold Members):
     "Credit: $XX.XX" with wallet icon
   - Filters button:
     - For members: shows filter panel toggle (SlidersHorizontal icon)
     - For non-members: shows lock icon + "Unlock Filters" → navigates to Membership

2. Filter Panel (Members Only, collapsible)
   - "Hotel Preferred Only" checkbox filter
   - "Verified Only" checkbox filter (default: true)
   - Filters applied in real-time to driver list

3. Driver Count
   - "X driver(s) found for your schedule"

4. Track Ride Hint (when fromTrackRide = true)
   - Gold text: "Gold member — pick your chauffeur to continue to live tracking"

5. Driver Cards (one per available driver, animated staggered entry)
   Each card shows:
   - Avatar circle with user icon + verified shield badge (gold, bottom-right)
   - First name + last initial (e.g., "Michael T.")
   - Star rating (gold filled stars + numeric value)
   - Vehicle make and model
   - Distance in miles (gray)
   - ETA in minutes (gold)
   - "View Profile" button → DriverProfile
   - "Select Chauffeur" button (gold) → DriverConfirmation (or TrackRide if fromTrackRide)

6. Default Filters Applied
   - verified: true
   - minRating: 4.5
   - maxDistance: 5 miles
   - hotelPreferred: false (off by default)

### Navigation
- View Profile → DriverProfile (passes driver, fromTrackRide, paymentMethod)
- Select Chauffeur (concierge flow) → DriverConfirmation
- Select Chauffeur (passenger flow) → TrackRide (with fromMembershipPurchase: true)
- Unlock Filters → Membership

---

## Screen 9 — Driver Profile Screen

File: src/screens/DriverSelectionScreens.tsx
Route: "DriverProfile"
Params received: driver object, fromTrackRide (boolean), paymentMethod

### Purpose
Detailed profile view for a specific chauffeur. Shows credentials, vehicle details,
and amenities (amenities locked behind membership).

### Features

1. Header
   - Back button
   - Ride Credit Badge (members only)

2. Profile Header
   - Large avatar circle with driver's first initial (gold text)
   - Verified shield badge (gold, bottom-right of avatar)
   - Driver name (first name + last initial)
   - Stats row:
     - Rating (numeric, gold)
     - Years of Experience
     - Divider between stats

3. Vehicle Details Box
   - Make/Model
   - License Plate (partially masked, e.g., ***LUX24)
   - Year
   - Interior material

4. Premium Amenities Section
   - For Gold Members: shows amenity chips (WiFi, Audio, Child Seat icons)
   - For non-members: locked box with dashed border
     - "Premium Amenities Locked"
     - "Join Membership to View" link → Membership screen

5. Bio Quote
   - Static professional bio text

6. "Assign This Chauffeur" Button (gold, full width)
   - Concierge flow → DriverConfirmation
   - Passenger flow → TrackRide (with fromMembershipPurchase: true)

### Navigation
- Assign This Chauffeur (concierge) → DriverConfirmation
- Assign This Chauffeur (passenger) → TrackRide
- Join Membership → Membership

---

## Screen 10 — Driver Swipe Screen

File: src/screens/DriverSelectionScreens.tsx
Route: "DriverSwipe"

### Purpose
Tinder-style swipe interface for selecting a chauffeur. Presents one driver at a time
with pass/info/select actions.

### Features

1. Back Button

2. Driver Card (one at a time)
   - Large avatar circle with driver's first initial
   - Driver name (first name + last initial)
   - Star rating
   - Vehicle make and model
   - Distance and ETA

3. Action Buttons (3 buttons below card)
   - Pass (red X button): skips to next driver
   - Info (gold info button): navigates to DriverProfile
   - Select (gold checkmark button): navigates to DriverConfirmation

4. Queue Empty State
   - Shown when all drivers have been passed
   - Car icon (gray), "Queue Empty" title
   - "Back to Menu" button → DriverAssignmentMode

### Navigation
- Pass → next driver (or DriverAssignmentMode if queue empty)
- Info → DriverProfile
- Select → DriverConfirmation

---

## Screen 11 — Driver Confirmation Screen

File: src/screens/DriverConfirmationScreen.tsx
Route: "DriverConfirmation"
Params received: driver object, paymentType

### Purpose
Final confirmation step before dispatching the selected chauffeur. Shows driver
summary, trust badges, and ETA. Concierge confirms or changes driver.

### Features

1. Back Button — "Change Driver" label → returns to driver selection

2. Driver Summary Card (animated scale-in)
   - Avatar with first initial + verified checkmark badge
   - Full driver name + Hotel Preferred award icon (if applicable)
   - Star rating + years of experience
   - Vehicle make and model
   - ETA row:
     - Distance in miles (left)
     - ETA in minutes (right, gold)

3. Trust Badges Row (animated slide-up)
   Three possible badges shown based on driver flags:
   - "Limo Verified" (green) — if driver.verified
   - "Background Check" (blue) — if driver.backgroundCheck
   - "Hotel Preferred" (gold) — if driver.hotelPreferred

4. Confirm Assignment Button (gold, full width)
   - Calculates estimated fare using calculateFare(paymentType)
   - Navigates to DriverETA with driver, paymentType, estimatedFare

5. Choose Different Driver Button (outline)
   - Returns to previous screen (driver selection)

### Navigation
- Confirm Assignment → DriverETA
- Choose Different Driver → back (DriverList / DriverSwipe)

---

---

## Screen 12 — Driver ETA Screen

File: src/screens/DriverETAScreen.tsx
Route: "DriverETA"
Params received: driver object, paymentType, estimatedFare

### Purpose
Shows the concierge that the chauffeur is on the way. Displays driver details,
vehicle info, and ETA countdown. Entry point to the active ride tracking.

### Features

1. Cancel Ride Button (top left)
   - Navigates to Home (cancels the ride)

2. Animated Car Icon
   - Car icon inside a gold-bordered circle
   - Gentle floating animation (translateY 0 → -8, loop)

3. Status Display
   - Title: "CHAUFFEUR ARRIVING"
   - Large ETA value (e.g., "3 min") in gold, 56px font
   - Vehicle name below ETA (e.g., "Mercedes-Benz S-Class")

4. Driver Details List (animated staggered entry)
   Three rows:
   - Chauffeur: driver name
   - Rating: ★ X.X
   - License Plate: plate number

5. Track Ride Button (gold, full width)
   - Navigates to ActiveRide with driver, paymentType, estimatedFare

### Navigation
- Cancel Ride → Home
- Track Ride → ActiveRide

---

## Screen 13 — Active Ride Screen

File: src/screens/ActiveRideScreen.tsx
Route: "ActiveRide"
Params received: driver object, paymentType, estimatedFare

### Purpose
Live ride status timeline showing the progression of the ride from assignment to
completion. Concierge can monitor the ride status and mark it complete.

### Features

1. Back Button → returns to DriverETA

2. Ride Timeline
   Five status stages displayed as a vertical timeline:
   - Assigned (2:15 PM) — completed (gold dot + checkmark)
   - Arriving (2:18 PM) — completed (gold dot + checkmark)
   - Onboard (2:20 PM) — completed (gold dot + checkmark)
   - En Route (Now) — in progress (gray dot, no checkmark)
   - Completed (Pending) — not yet (gray dot)

   Visual design:
   - Completed stages: gold filled circle with black checkmark
   - Gold glow shadow on completed dots
   - Connecting lines between dots: gold for completed, gray for pending
   - Each item animated with staggered slide-in from left

3. Complete Ride Button (gold, full width)
   - Navigates to RideCompletion with driver, paymentType, estimatedFare

### Navigation
- Back → DriverETA
- Complete Ride → RideCompletion

---

## Screen 14 — Ride Completion Screen

File: src/screens/RideCompletionScreen.tsx
Route: "RideCompletion"
Params received: paymentType, estimatedFare

### Purpose
Post-ride summary screen. Shows fare, confirms payment, and allows the concierge
to rate the driver. Final step in the ride booking flow.

### Features

1. Success Animation
   - Gold circle with black checkmark icon
   - Spring animation (scale 0 → 1) on mount

2. Title: "Ride Complete"

3. Fare Breakdown Box
   - "Total Fare" label + fare amount
   - Fare sourced from: activeRide.fare → estimatedFare → calculateFare(paymentType)
   - Card payment: $45.00, Cash payment: $54.00

4. Journey Confirmed Badge
   - Gold-bordered box
   - "JOURNEY CONFIRMED" title
   - "Driver payment processed successfully" subtitle

5. Driver Rating
   - "Rate Driver" label
   - 5 interactive star buttons
   - Tap a star to set rating (1–5)
   - Stars fill gold up to selected rating
   - Rating stored in local state (not persisted in this version)

6. Done Button (gold, full width)
   - Navigates to Home

### Navigation
- Done → Home

---

## Screen 15 — Profile Screen

File: src/screens/ProfileScreen.tsx
Route: "Profile"

### Purpose
Displays the logged-in user's profile information and membership status.
Provides logout functionality.

### Features

1. Back Button → returns to Home

2. Avatar Section (animated slide-down)
   - Gold-bordered circle with user icon
   - User's full name (large, white)
   - Role label (gold, e.g., "Concierge")
   - "Gold Member" badge (shown only if isMember = true)

3. Profile Fields List (animated staggered slide-in)
   Six fields displayed as key-value rows:
   - Hotel: hotel name
   - Email: user email
   - Phone: user phone
   - Device: device name
   - KYC Status: 'approved' / 'pending' / 'rejected'
   - Membership: 'Gold Member' or 'Standard'

4. Ride Credit Balance Box (shown only for Gold Members)
   - Gold-bordered box
   - "Ride Credit Balance" label
   - Credit amount in large gold text (e.g., "$100.00")

5. Logout Button (secondary/outline style)
   - Clears user from context (setUser(null))
   - Navigates to Login using navigation.replace

### Navigation
- Back → Home
- Logout → Login (replace)

---

## Screen 16 — Commission Wallet Screen

File: src/screens/CommissionWalletScreen.tsx
Route: "CommissionWallet"

### Purpose
Financial dashboard showing the concierge's commission earnings across different
time periods, with a chart area and recent transaction history.

### Features

1. Back Button → returns to Home

2. Earnings Stats Row (3 cards, animated staggered)
   - Today: $142.50
   - Week: $856
   - Month: $3,420
   (All mock/static data)

3. Earnings Chart Placeholder
   - Dark box with animated TrendingUp icon (floats up/down)
   - "Earnings Chart" label
   - Placeholder for future chart integration

4. Recent Transactions Section
   Four transaction rows (animated staggered slide-in from left):
   - Ride #1042 — Today, 3:15 PM — +$6.75
   - Ride #1041 — Today, 1:30 PM — +$8.10
   - Ride #1040 — Yesterday — +$5.40
   - Ride #1039 — Yesterday — +$9.00
   Each row shows: ride ID, date/time, and amount (green)

### Navigation
- Back → Home

---

## Screen 17 — Ride History Screen

File: src/screens/RideHistoryScreen.tsx
Route: "RideHistory"

### Purpose
Chronological list of all past rides managed by the concierge. Shows fare, driver,
date, and star rating for each ride.

### Features

1. Back Button → returns to Home

2. Ride History List (5 mock rides, animated staggered slide-in)
   Each ride card shows:
   - Ride ID (e.g., "#1042") — left
   - Fare amount (gold) — right
   - Date and time — left
   - Driver name — right
   - Star rating (1–5 filled gold stars) — left
   - Status badge "Completed" (green) — right

   Mock rides:
   - #1042 — Today, 3:15 PM — Michael T. — $45.00 — ★★★★★
   - #1041 — Today, 1:30 PM — Sarah M. — $54.00 — ★★★★
   - #1040 — Yesterday — James A. — $45.00 — ★★★★★
   - #1039 — Dec 18, 2025 — David C. — $45.00 — ★★★★
   - #1038 — Dec 17, 2025 — Emily R. — $54.00 — ★★★★★

### Navigation
- Back → Home

---

---

## Screen 18 — Membership Screen

File: src/screens/MembershipScreens.tsx
Route: "Membership"
Params received: fromTrackRide (boolean), paymentMethod (string or null)

### Purpose
Upsell screen for the Tuxedo Gold membership. Presents the membership benefits,
pricing, and ride credit offer. Accessible from multiple points in the app.

### Features

1. Back Button → returns to previous screen

2. Crown Icon (animated spring scale-in)

3. Membership Title: "TUXEDO GOLD"

4. Price Box
   - "Membership Price" label
   - "$100/yr" in large white text
   - Green badge: "Get $100 Instant Ride Credit" (lightning bolt icon)

5. Benefits List (5 items, animated staggered slide-in)
   - Manual Chauffeur Selection
   - View Full Driver Amenities
   - Advanced Search Filters
   - Priority Dispatching
   - Exclusive Luxury Fleet Access

6. Buy Membership Button (gold, full width)
   - Navigates to MembershipPayment
   - Passes fromTrackRide and paymentMethod params

7. "Continue Without Membership" Link (shown only when fromTrackRide = true)
   - Navigates back to TrackRide with fromMembershipSkip: true and paymentMethod

### Navigation
- Buy Membership → MembershipPayment
- Continue Without Membership → TrackRide (passenger flow only)

---

## Screen 19 — Membership Payment Screen

File: src/screens/MembershipScreens.tsx
Route: "MembershipPayment"
Params received: fromTrackRide (boolean), paymentMethod (string or null)

### Purpose
Payment screen for completing the Gold membership purchase. Simulates payment
processing and unlocks membership features.

### Features

1. Back Button → returns to Membership screen

2. Shield Check Icon (animated spring scale-in)

3. Header
   - "COMPLETE PAYMENT" title
   - "Annual Gold Membership" subtitle

4. Total Due Box
   - "Total Due" label
   - "$100.00" in large white text
   - Green badge: "Includes $100 Ride Credit"

5. Payment Methods (2 options)
   - Apple Pay (Apple icon)
   - Credit Card (CreditCard icon)
   - Each is a tappable row — both trigger the same handlePayment function

6. On Payment Completion
   - Updates user context: isMember = true, rideCredit = 100
   - Persists membership state to AsyncStorage via persistMembershipState(true, 100)
   - If fromTrackRide: navigates to DriverList (with fromTrackRide: true, paymentMethod)
   - Otherwise: navigates to DriverList

7. Footer Note
   - "Secure payment processed by Tuxedo Financial. Membership unlocks full driver
     profiles and amenities."

### Navigation
- Payment (Apple Pay or Credit Card) → DriverList

---

## Screen 20 — Track Ride Screen (Passenger Flow)

File: src/screens/TrackRideScreen.tsx
Route: "TrackRide"
Params received: fromMembershipPurchase, fromMembershipSkip, paymentMethod, selectedDriver

### Purpose
This is the passenger-facing ride tracking experience. It is accessible from the
concierge home ("Passenger Track Ride" button) and via deep link sent to the guest.
It has three internal steps: config → payment → tracking.

### Features

#### Header (all steps)
- Back button (step-aware: goes back within steps or to previous screen)
- App title: "Tuxedo Concierge" (italic, uppercase)
- Status badge: "CHAUFFEUR EN ROUTE" or "RIDE CONFIGURATION" (animated pulse)

#### Step 1 — Config (Finalize Your Journey)
- Pickup Location Box (read-only)
  - Shows hotel name set by concierge
  - "Set by Concierge" note
- Drop-off Location Input
  - MapPin icon + text input
  - "Enter Drop-off Location" placeholder
- "Request Chauffeur" Button
  - Disabled until drop-off is entered
  - Updates activeRide in context
  - Advances to payment step

#### Step 2 — Payment Method Selection
- "Select Payment Method" title
- "Secure Payment Processing" subtitle
- Four payment options (tappable rows):
  - Apple Pay (Apple icon)
  - PayPal (Wallet icon)
  - Credit Card (CreditCard icon)
  - Cash Payment (DollarSign icon)
- Selected method highlighted with gold border
- On selection: navigates to Membership screen (with fromTrackRide: true, paymentMethod)
- "Proceed to Tracking" button → skips membership, goes directly to tracking step
- "You can also pay inside the vehicle" note

#### Step 3 — Live Tracking
Shown after returning from Membership/DriverList or after skipping membership.

- Green checkmark success icon
- Driver avatar circle + car icon box side by side
- Driver name (uppercase, italic)
- 5 sparkle icons + "X.X Rating" label
- Live progress bar (animated, 10%→85% cycling)
- ETA text: "Live: Driver is X mins away in a [vehicle]"
  (ETA is random 2–3 minutes)

- Premium Amenities Box:
  - For members: shows amenity tags (WiFi, Refreshments, Premium Audio, Interior)
  - For non-members: "Premium amenities locked" + "Buy Membership" button
    → navigates to Membership

- Promo Box (shown after membership purchase):
  - "20% Off Your Next Journey!" (gold, dashed border)

#### Membership Status Footer Card (all steps)
- For non-members:
  - Crown icon (gray)
  - "Tuxedo Basic Status"
  - "Join for $100 & Get $100 Credit"
  - Gold arrow button → navigates to Membership
- For Gold Members:
  - Crown icon (gold background)
  - "Tuxedo Gold Member"
  - "$XX.XX Ride Credit"
  - "Active" badge (green checkmark)

#### App Download Popup (auto-shown after 5 seconds)
- Modal overlay
- Sparkles icon
- Message: "Download our app and get $100 coupon free on your next ride."
- "Download App" button:
  - Stores pending coupon in AsyncStorage (storePendingAppDownloadCoupon)
  - Opens App Store URL (https://apps.apple.com)
  - Closes popup
- "Skip for Now" button → closes popup

Coupon data stored:
```
code:            TUX100-XXXXXX (random)
amount:          100
campaign:        'track-ride-download-popup'
linkedIdentity:  { phone, email } from user context
status:          'pending_app_login'
issuedAt:        ISO timestamp
```

### Navigation
- Payment method selection → Membership (fromTrackRide: true)
- Proceed to Tracking → tracking step (skip membership)
- Buy Membership (from amenities) → Membership
- Membership footer → Membership (non-members only)
- Returns from Membership/DriverList → tracking step (via route.params)

---

---

# COMPLETE USER FLOWS

---

## Flow A — Instant Ride Booking (Concierge)

This is the primary flow for booking an immediate ride for a hotel guest.

```
1. LOGIN SCREEN
   - Select role: Concierge
   - Enter phone number (or tap demo account)
   - Tap "Send OTP"
   - Enter 6-digit OTP (or tap demo code 123456)
   - Tap "Verify & Login"
   ↓
2. HOME SCREEN
   - View dashboard stats
   - Tap "Call a Car" button
   ↓
3. GUEST DETAILS SCREEN
   - Enter guest phone number (or switch to email)
   - Optionally tap "Preview Passenger Link" to see/copy/share the tracking URL
   - Tap "Send Chauffeur Request"
   ↓
4. WAITING FOR PAYMENT SCREEN
   - System shows "Request Sent" with spinning loader
   - Tracking link has been sent to guest
   - Concierge can tap "Return to Dashboard" or wait
   ↓
   [Guest receives link, enters destination, selects payment on web app]
   ↓
5. HOME SCREEN (concierge returns here)
   - Concierge can now proceed to assign a driver
   - Tap "Call a Car" again or navigate to DriverAssignmentMode
   ↓
6. DRIVER ASSIGNMENT MODE SCREEN
   - Choose: Auto Match / Manual Selection / Swipe Match
   ↓
   [Path A: Auto Match]
   ↓
7a. DRIVER MATCHING SCREEN
    - Animated search for 4 seconds
    - Auto-advances to Driver ETA
    ↓
   [Path B: Manual Selection]
   ↓
7b. DRIVER LIST SCREEN
    - Browse available chauffeurs
    - Apply filters (members only)
    - Tap "View Profile" to see details
    - Tap "Select Chauffeur"
    ↓
    DRIVER PROFILE SCREEN (optional)
    - View vehicle details, amenities (members), bio
    - Tap "Assign This Chauffeur"
    ↓
    DRIVER CONFIRMATION SCREEN
    - Review driver summary, trust badges, ETA
    - Tap "Confirm Assignment"
    ↓
   [Path C: Swipe Match]
   ↓
7c. DRIVER SWIPE SCREEN
    - Swipe through drivers one at a time
    - X to pass, checkmark to select, info to view profile
    - Tap checkmark → Driver Confirmation Screen
    ↓
8. DRIVER ETA SCREEN
   - View chauffeur name, rating, plate, ETA
   - Tap "Track Ride"
   ↓
9. ACTIVE RIDE SCREEN
   - Monitor ride timeline: Assigned → Arriving → Onboard → En Route → Completed
   - Tap "Complete Ride"
   ↓
10. RIDE COMPLETION SCREEN
    - View total fare
    - Rate the driver (1–5 stars)
    - Tap "Done"
    ↓
11. HOME SCREEN
    - Back to dashboard
```

---

## Flow B — Scheduled Ride Booking (Concierge)

For booking a future ride with a specific date and time.

```
1. LOGIN SCREEN → HOME SCREEN (same as Flow A steps 1–2)
   ↓
2. HOME SCREEN
   - Tap "Reserve a Ride" button
   ↓
3. SCHEDULE BOOKING SCREEN — Step 1 (Guest Info)
   - Enter guest phone or email
   - Tap "Send Ride Request"
   ↓
4. SCHEDULE BOOKING SCREEN — Step 2 (Date & Time)
   - Tap date field → Calendar Modal opens
   - Select a future date
   - Enter time in HH:MM format
   - Summary box appears with selected date/time
   - Tap "Continue"
   ↓
5. SCHEDULE BOOKING SCREEN — Step 3 (Chauffeur)
   - Choose "Yes, Choose a Chauffeur" → goes to DriverList
     OR
   - Choose "Auto-Assign" → advances to step 4
   ↓
6. SCHEDULE BOOKING SCREEN — Step 4 (Confirm)
   - Review scheduled date/time
   - Tap "Confirm Booking"
   ↓
7. WAITING FOR PAYMENT SCREEN
   - Same as Flow A step 4
   ↓
8. Continue with driver assignment and ride tracking (same as Flow A steps 6–11)
```

---

## Flow C — Passenger Track Ride Flow

The passenger receives a deep link from the concierge and tracks their ride.
This flow is also accessible from the concierge home via "Passenger Track Ride".

```
1. TRACK RIDE SCREEN — Step 1 (Config)
   - Pickup location shown (set by concierge, read-only)
   - Enter drop-off destination
   - Tap "Request Chauffeur"
   ↓
2. TRACK RIDE SCREEN — Step 2 (Payment)
   - Select payment method: Apple Pay / PayPal / Credit Card / Cash
   - On selection → navigates to MEMBERSHIP SCREEN
   ↓
3. MEMBERSHIP SCREEN
   - View Gold membership benefits ($100/yr, get $100 credit)
   - Option A: Tap "Buy Membership" → MEMBERSHIP PAYMENT SCREEN
   - Option B: Tap "Continue Without Membership" → back to TrackRide (tracking step)
   ↓
   [If buying membership:]
4. MEMBERSHIP PAYMENT SCREEN
   - Total: $100.00
   - Select Apple Pay or Credit Card
   - On payment: user becomes Gold Member, gets $100 ride credit
   - Navigates to DRIVER LIST SCREEN
   ↓
5. DRIVER LIST SCREEN (passenger selects chauffeur)
   - Browse available chauffeurs
   - Gold member badge + credit balance shown
   - Filters available (member benefit)
   - Select a chauffeur → returns to TrackRide (tracking step)
   ↓
6. TRACK RIDE SCREEN — Step 3 (Live Tracking)
   - Driver avatar + car displayed
   - Driver name, rating
   - Animated progress bar
   - ETA: "Driver is X mins away in [vehicle]"
   - Premium amenities shown (if member) or locked (if not)
   - "20% Off Your Next Journey!" promo (if just purchased membership)
   - Membership status footer card
   ↓
7. APP DOWNLOAD POPUP (auto-shown after 5 seconds)
   - Offer: $100 coupon for downloading the app
   - "Download App" → stores coupon, opens App Store
   - "Skip for Now" → dismisses popup
```

---

## Flow D — Membership Upgrade (from Driver List / Profile)

Non-member concierge tries to access member-only features.

```
1. DRIVER LIST SCREEN
   - Non-member taps "Unlock Filters" button
   ↓
   OR
   DRIVER PROFILE SCREEN
   - Non-member sees locked amenities box
   - Taps "Join Membership to View"
   ↓
2. MEMBERSHIP SCREEN
   - View benefits and pricing
   - Tap "Buy Membership"
   ↓
3. MEMBERSHIP PAYMENT SCREEN
   - Complete payment (Apple Pay or Credit Card)
   - User context updated: isMember = true, rideCredit = $100
   - Membership persisted to AsyncStorage
   ↓
4. DRIVER LIST SCREEN
   - Now shows member features: filters, credit badge
   - Can view full driver amenities
```

---

## Flow E — Profile & Logout

```
1. HOME SCREEN
   - Tap profile icon (top right)
   ↓
2. PROFILE SCREEN
   - View all profile fields
   - View ride credit balance (if Gold Member)
   - Tap "Logout"
   ↓
3. LOGIN SCREEN
   - User context cleared
   - Fresh login required
```

---

---

# CROSS-CUTTING FEATURES

---

## Authentication & Security

- OTP-based login (phone or email)
- Device binding: user object carries deviceBound: true and deviceName
- KYC status tracked per user (pending / approved / rejected)
- Role-based access: concierge vs manager (role stored in user context)
- Logout clears user from context and redirects to Login

## Membership System (Tuxedo Gold)

- Price: $100/year
- Benefit: $100 instant ride credit
- Unlocks:
  - Manual chauffeur selection with filters
  - Full driver amenity details in profiles
  - Advanced search filters (Hotel Preferred, Verified)
  - Priority dispatching
  - Exclusive luxury fleet access
- Membership state persisted to AsyncStorage (survives app restarts)
- Credit balance displayed in Driver List header and Profile screen

## Passenger Deep Link System

- Concierge generates a unique tracking URL per ride
- Format: https://conciergeapptuxedo.vercel.app/track-ride?token=XXXXXXXX&pickup=<hotel>
- Token: random 8-character alphanumeric string
- Link can be copied to clipboard or shared via native share sheet
- Link opens the passenger track-ride flow (web or deep link)

## App Download Coupon System

- Triggered automatically 5 seconds after entering the tracking step
- Coupon stored in AsyncStorage with:
  - Unique code: TUX100-XXXXXX
  - Amount: $100
  - Campaign: 'track-ride-download-popup'
  - Linked identity: user phone/email
  - Status: 'pending_app_login'
  - Issued timestamp
- On "Download App": coupon stored, App Store opened

## Pricing & Commission

- Base fare: $45.00 (card payment)
- Cash surcharge: 20% → $54.00
- Commission rate: 15% of fare
  - Card ride commission: $6.75
  - Cash ride commission: $8.10
- Commission displayed in wallet and transaction history

## Animations

All screens use Moti (React Native animation library) for:
- Fade-in + slide-up on screen mount
- Staggered list item animations (delay increments per item)
- Spinning loaders (DriverMatching, WaitingForPayment)
- Floating car icon (Home CTA, DriverETA)
- Pulsing glow (DriverMatching)
- Spring scale animations (RideCompletion success, Membership crown)
- Progress bar animation (TrackRide tracking step)

## UI Components

### GlassCard
- Semi-transparent black background (rgba(0,0,0,0.6))
- Gold-tinted border (rgba(212,175,55,0.2))
- 16px border radius
- Fade-in + slide-up animation on mount (can be disabled)

### GoldButton (3 variants)
- primary: gold background (#D4AF37), black text
- secondary: transparent background, gold border, gold text
- ghost: transparent background, dim gold border, gold text
- Disabled state: 50% opacity
- All variants support custom style overrides

### ScreenShell
- Full-screen SafeAreaView with black background
- ScrollView with responsive horizontal padding
- Optional KeyboardAvoidingView (for forms)
- Optional vertical centering (for login/completion screens)
- Responsive max content width for large devices

---

# SCREEN INVENTORY SUMMARY

| # | Screen Name              | Route                  | File                          |
|---|--------------------------|------------------------|-------------------------------|
| 1 | Login                    | Login                  | LoginScreen.tsx               |
| 2 | Concierge Home           | Home                   | ConciergeHomeScreen.tsx       |
| 3 | Guest Details            | GuestDetails           | GuestDetailsScreen.tsx        |
| 4 | Schedule Booking         | ScheduleBooking        | ScheduleBookingScreen.tsx     |
| 5 | Waiting For Payment      | WaitingForPayment      | WaitingForPaymentScreen.tsx   |
| 6 | Driver Assignment Mode   | DriverAssignmentMode   | DriverSelectionScreens.tsx    |
| 7 | Driver Matching (Auto)   | DriverMatching         | DriverMatchingScreen.tsx      |
| 8 | Driver List              | DriverList             | DriverSelectionScreens.tsx    |
| 9 | Driver Profile           | DriverProfile          | DriverSelectionScreens.tsx    |
|10 | Driver Swipe             | DriverSwipe            | DriverSelectionScreens.tsx    |
|11 | Driver Confirmation      | DriverConfirmation     | DriverConfirmationScreen.tsx  |
|12 | Driver ETA               | DriverETA              | DriverETAScreen.tsx           |
|13 | Active Ride              | ActiveRide             | ActiveRideScreen.tsx          |
|14 | Ride Completion          | RideCompletion         | RideCompletionScreen.tsx      |
|15 | Profile                  | Profile                | ProfileScreen.tsx             |
|16 | Commission Wallet        | CommissionWallet       | CommissionWalletScreen.tsx    |
|17 | Ride History             | RideHistory            | RideHistoryScreen.tsx         |
|18 | Membership               | Membership             | MembershipScreens.tsx         |
|19 | Membership Payment       | MembershipPayment      | MembershipScreens.tsx         |
|20 | Track Ride (Passenger)   | TrackRide              | TrackRideScreen.tsx           |

Total: 20 screens across 17 files

---

# KNOWN LIMITATIONS (Frontend-Only)

- All driver data is mock (mockDrivers.ts) — no real backend
- OTP verification is simulated — any 6-digit code works (demo: 123456)
- Commission and ride history data are static mock values
- Earnings chart is a placeholder (no real chart library integrated)
- "Resend Tracking SMS" button has no wired action
- Driver matching auto-timer (4s) simulates backend matching
- Payment processing is simulated — no real payment gateway
- Ride status timeline is static (not driven by real-time events)
- App Store link opens https://apps.apple.com (placeholder)
- No real-time map or GPS tracking integrated

---
