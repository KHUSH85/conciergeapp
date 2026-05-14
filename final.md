# TUXEDO CONCIERGE — Screen Documentation

**Application:** Tuxedo Concierge — Luxury Ride Management Mobile App
**Platform:** React Native (Expo) — iOS & Android
**Total Screens:** 20
**Design:** Glassmorphism, black background, gold (#D4AF37) accents

---

## Screen 1 — Login Screen

**File:** `tuxedo-mobile/src/screens/LoginScreen.tsx`
**Route:** `Login`

&nbsp;

Entry point of the app. Authenticates hotel staff via phone number or email using OTP (One-Time Password) verification. Supports two roles: Concierge and Manager.

&nbsp;

**Key Features:**
- Role selector toggle (Concierge / Manager) — active role highlighted in gold
- Phone or email input with keyboard-aware validation
- Demo accounts: `+1 (555) 100-0001` (Concierge), `+1 (555) 200-0002` (Manager) — tap to auto-fill
- Send OTP button — enabled only when contact field is non-empty
- 6-digit OTP entry with auto-advance and auto-submit
- 30-second countdown timer + Resend OTP after expiry
- Demo OTP `123456` — tap to auto-fill and verify instantly
- On success: loads AsyncStorage membership state, creates user object, navigates to Home
- "Secure Device-Bound Authentication" footer label

**Navigation:** Successful OTP → `Home` (replace, no back stack)

&nbsp;

**[INSERT SCREEN IMAGE HERE]**

---

## Screen 2 — Concierge Home Screen

**File:** `tuxedo-mobile/src/screens/ConciergeHomeScreen.tsx`
**Route:** `Home`

&nbsp;

Main dashboard for the concierge. Central hub for all actions: booking rides, viewing stats, accessing history, wallet, and passenger tracking.

&nbsp;

**Key Features:**
- Header: logged-in user name + hotel name + profile icon (top right)
- Primary CTA card with animated floating car icon
  - "Call a Car" (gold) → GuestDetails (instant mode)
  - "Reserve a Ride" (outline) → ScheduleBooking
  - Italic note: "Tracking link will be sent automatically to the guest"
- Stats grid (2×2): Today's Earnings $142.50 · Rides Today 12 · Weekly Growth +15% · Recent Payout $856
- Secondary ghost buttons: Ride History · Commission Wallet · Passenger Track Ride

**Navigation:** Profile icon → `Profile` · Call a Car → `GuestDetails` · Reserve a Ride → `ScheduleBooking` · Ride History → `RideHistory` · Commission Wallet → `CommissionWallet` · Passenger Track Ride → `TrackRide`

&nbsp;

**[INSERT SCREEN IMAGE HERE]**

---

## Screen 3 — Guest Details Screen

**File:** `tuxedo-mobile/src/screens/GuestDetailsScreen.tsx`
**Route:** `GuestDetails`
**Params:** `bookingMode: 'instant'`, `pickupLocation` (hotel name)

&nbsp;

Collects guest contact information before dispatching a chauffeur. Also allows the concierge to preview and share the passenger tracking deep link.

&nbsp;

**Key Features:**
- Contact method toggle: Phone Number ↔ Email (animated transition)
- Phone input (keyboard-aware, enabled when length > 5)
- Email input with real-time format validation and inline error message
- "Preview Passenger Link" button (dashed border) — generates unique tracking URL
  - Format: `https://conciergeapptuxedo.vercel.app/track-ride?token=XXXXXXXX&pickup=<hotel>`
- Generated link box: Copy (2s "Copied!" confirmation) + Share (native share sheet)
- "Send Chauffeur Request" button — disabled until valid contact entered

**Navigation:** Back → `Home` · Send Chauffeur Request → `WaitingForPayment`

&nbsp;

**[INSERT SCREEN IMAGE HERE]**

---

## Screen 4 — Schedule Booking Screen

**File:** `tuxedo-mobile/src/screens/ScheduleBookingScreen.tsx`
**Route:** `ScheduleBooking`

&nbsp;

Multi-step wizard for scheduling a future ride. Collects guest contact, date/time, and chauffeur preference before confirming the booking.

&nbsp;

**Key Features:**
- 4-step progress indicator (dots + lines, active steps in gold): Guest → Schedule → Chauffeur → Confirm
- Step 1 — Guest Info: phone/email toggle + validation + "Send Ride Request"
- Step 2 — Date & Time: custom Calendar Modal (month navigation, past dates disabled, gold selection) + time input (HH:MM) + summary box
- Step 3 — Chauffeur: "Yes, Choose a Chauffeur" → DriverList · "Auto-Assign" → step 4
- Step 4 — Confirm: scheduled date/time summary + "Confirm Booking" → WaitingForPayment

**Navigation:** Back (step 1) → `Home` · Back (steps 2–4) → previous step · Choose Chauffeur → `DriverList` · Confirm Booking → `WaitingForPayment`

&nbsp;

**[INSERT SCREEN IMAGE HERE]**

---

## Screen 5 — Waiting For Payment Screen

**File:** `tuxedo-mobile/src/screens/WaitingForPaymentScreen.tsx`
**Route:** `WaitingForPayment`
**Params:** `guestPhone`, `guestEmail`, `bookingMode`, `pickupLocation`, `passengerLink`, `scheduledDate`, `scheduledTime`, `chooseChauffeur`

&nbsp;

Confirmation screen shown after a ride request is sent. Indicates the system is waiting for the guest to enter their destination and complete payment on the passenger-facing web app.

&nbsp;

**Key Features:**
- Animated spinning gold ring with pulsing car icon in center
- Status: "REQUEST SENT" title + subtitle explaining tracking link was sent
- "Status: Chauffeur Radar Active" gold badge
- "Return to Dashboard" button (gold) → Home
- "Resend Tracking SMS" ghost button (UI placeholder, no action wired)
- Back arrow link → previous screen
- Footer: "Concierge will be notified once the passenger completes the secure payment flow."

**Navigation:** Return to Dashboard → `Home` · Back → `GuestDetails` or `ScheduleBooking`

&nbsp;

**[INSERT SCREEN IMAGE HERE]**

---

## Screen 6 — Driver Assignment Mode Screen

**File:** `tuxedo-mobile/src/screens/DriverSelectionScreens.tsx`
**Route:** `DriverAssignmentMode`

&nbsp;

Lets the concierge choose how to assign a chauffeur to the ride. Three assignment modes available with animated staggered card entry.

&nbsp;

**Key Features:**
- Auto Match (Zap icon) — "System selects best available driver" → DriverMatching
- Manual Selection (List icon) — "Browse and choose from available drivers" → DriverList
- Swipe Match (Heart icon) — "Luxury experience - swipe to find perfect match" → DriverSwipe
- All three cards animate in with staggered entry on mount

**Navigation:** Auto Match → `DriverMatching` · Manual Selection → `DriverList` · Swipe Match → `DriverSwipe`

&nbsp;

**[INSERT SCREEN IMAGE HERE]**

---

## Screen 7 — Driver Matching Screen

**File:** `tuxedo-mobile/src/screens/DriverMatchingScreen.tsx`
**Route:** `DriverMatching`

&nbsp;

Animated loading screen shown while the system automatically finds the best available driver. Auto-advances to DriverETA after 4 seconds.

&nbsp;

**Key Features:**
- Pulsing gold glow ring (scale 0.8→1.4 loop) behind car icon
- Car icon gently scales up/down (1.0→1.05 loop)
- Status: "FINDING YOUR CHAUFFEUR" + subtitle
- Gold ring spinner (1.2s rotation loop)
- Auto-navigates to DriverETA after 4000ms
- "Cancel Request" text button → Home

**Navigation:** Auto (4s timer) → `DriverETA` · Cancel Request → `Home`

&nbsp;

**[INSERT SCREEN IMAGE HERE]**

---

## Screen 8 — Driver List Screen

**File:** `tuxedo-mobile/src/screens/DriverSelectionScreens.tsx`
**Route:** `DriverList`
**Params:** `fromTrackRide` (boolean), `paymentMethod` (string or null)

&nbsp;

Displays all available chauffeurs in a scrollable list. Supports member-only filtering. Used in both the concierge booking flow and the passenger track-ride flow.

&nbsp;

**Key Features:**
- Header: back button + Ride Credit badge (Gold Members only) + Filters button
  - Members: collapsible filter panel (Hotel Preferred / Verified Only)
  - Non-members: lock icon + "Unlock Filters" → Membership
- Driver count label: "X driver(s) found for your schedule"
- Track Ride hint (when `fromTrackRide = true`): gold text prompt
- Driver cards (animated staggered entry): avatar + verified badge · name · rating · vehicle · distance · ETA · "View Profile" + "Select Chauffeur" buttons
- Default filters: verified true, minRating 4.5, maxDistance 5 miles

**Navigation:** View Profile → `DriverProfile` · Select Chauffeur (concierge) → `DriverConfirmation` · Select Chauffeur (passenger) → `TrackRide` · Unlock Filters → `Membership`

&nbsp;

**[INSERT SCREEN IMAGE HERE]**

---

## Screen 9 — Driver Profile Screen

**File:** `tuxedo-mobile/src/screens/DriverSelectionScreens.tsx`
**Route:** `DriverProfile`
**Params:** `driver` object, `fromTrackRide` (boolean), `paymentMethod`

&nbsp;

Detailed profile view for a specific chauffeur. Shows credentials, vehicle details, and amenities (amenities locked behind membership).

&nbsp;

**Key Features:**
- Header: back button + Ride Credit badge (members only)
- Large avatar circle with driver's first initial (gold) + verified shield badge
- Stats row: rating · years of experience
- Vehicle details box: make/model · license plate (partially masked e.g. `***LUX24`) · year · interior
- Premium Amenities: Gold Members see amenity chips (WiFi, Audio, Child Seat) · non-members see locked dashed box → "Join Membership to View"
- Static professional bio quote
- "Assign This Chauffeur" button (gold, full width)

**Navigation:** Assign (concierge) → `DriverConfirmation` · Assign (passenger) → `TrackRide` · Join Membership → `Membership`

&nbsp;

**[INSERT SCREEN IMAGE HERE]**

---

## Screen 10 — Driver Swipe Screen

**File:** `tuxedo-mobile/src/screens/DriverSelectionScreens.tsx`
**Route:** `DriverSwipe`

&nbsp;

Tinder-style swipe interface for selecting a chauffeur. Presents one driver at a time with pass / info / select actions.

&nbsp;

**Key Features:**
- Driver card (one at a time): avatar · name · rating · vehicle · distance · ETA
- Three action buttons: Pass (red X) · Info (gold info) → DriverProfile · Select (gold checkmark) → DriverConfirmation
- Queue empty state: car icon (gray) + "Queue Empty" + "Back to Menu" → DriverAssignmentMode

**Navigation:** Info → `DriverProfile` · Select → `DriverConfirmation` · Queue empty → `DriverAssignmentMode`

&nbsp;

**[INSERT SCREEN IMAGE HERE]**

---

## Screen 11 — Driver Confirmation Screen

**File:** `tuxedo-mobile/src/screens/DriverConfirmationScreen.tsx`
**Route:** `DriverConfirmation`
**Params:** `driver` object, `paymentType`

&nbsp;

Final confirmation step before dispatching the selected chauffeur. Shows driver summary, trust badges, and ETA. Concierge confirms or changes driver.

&nbsp;

**Key Features:**
- "Change Driver" back button → returns to driver selection
- Driver summary card (animated scale-in): avatar + verified badge · full name + Hotel Preferred icon · rating + experience · vehicle · distance + ETA (gold)
- Trust badges row (animated slide-up): "Limo Verified" (green) · "Background Check" (blue) · "Hotel Preferred" (gold) — shown based on driver flags
- "Confirm Assignment" button (gold) — calculates fare via `calculateFare(paymentType)` → DriverETA
- "Choose Different Driver" outline button → back

**Navigation:** Confirm Assignment → `DriverETA` · Choose Different Driver → `DriverList` or `DriverSwipe`

&nbsp;

**[INSERT SCREEN IMAGE HERE]**

---

## Screen 12 — Driver ETA Screen

**File:** `tuxedo-mobile/src/screens/DriverETAScreen.tsx`
**Route:** `DriverETA`
**Params:** `driver` object, `paymentType`, `estimatedFare`

&nbsp;

Shows the concierge that the chauffeur is on the way. Displays driver details, vehicle info, and ETA countdown. Entry point to active ride tracking.

&nbsp;

**Key Features:**
- "Cancel Ride" button (top left) → Home
- Car icon in gold-bordered circle with floating animation (translateY 0→−8 loop)
- Status: "CHAUFFEUR ARRIVING" · large ETA value in gold (56px) · vehicle name below
- Driver details list (animated staggered): Chauffeur name · Rating ★ X.X · License Plate
- "Track Ride" button (gold, full width) → ActiveRide

**Navigation:** Cancel Ride → `Home` · Track Ride → `ActiveRide`

&nbsp;

**[INSERT SCREEN IMAGE HERE]**

---

## Screen 13 — Active Ride Screen

**File:** `tuxedo-mobile/src/screens/ActiveRideScreen.tsx`
**Route:** `ActiveRide`
**Params:** `driver` object, `paymentType`, `estimatedFare`

&nbsp;

Live ride status timeline showing the progression of the ride from assignment to completion. Concierge can monitor the ride status and mark it complete.

&nbsp;

**Key Features:**
- Back button → DriverETA
- Vertical ride timeline with 5 stages (animated staggered slide-in from left):
  - Assigned (2:15 PM) — completed (gold dot + checkmark)
  - Arriving (2:18 PM) — completed
  - Onboard (2:20 PM) — completed
  - En Route (Now) — in progress (gray dot)
  - Completed (Pending) — not yet
- Completed stages: gold filled circle with black checkmark + gold glow shadow
- Connecting lines: gold for completed, gray for pending
- "Complete Ride" button (gold, full width) → RideCompletion

**Navigation:** Back → `DriverETA` · Complete Ride → `RideCompletion`

&nbsp;

**[INSERT SCREEN IMAGE HERE]**

---

## Screen 14 — Ride Completion Screen

**File:** `tuxedo-mobile/src/screens/RideCompletionScreen.tsx`
**Route:** `RideCompletion`
**Params:** `paymentType`, `estimatedFare`

&nbsp;

Post-ride summary screen. Shows fare, confirms payment, and allows the concierge to rate the driver. Final step in the ride booking flow.

&nbsp;

**Key Features:**
- Gold circle with black checkmark — spring animation (scale 0→1) on mount
- "Ride Complete" title
- Fare breakdown box: "Total Fare" + amount (card: $45.00 · cash: $54.00)
- "JOURNEY CONFIRMED" gold-bordered badge + "Driver payment processed successfully"
- 5 interactive star rating buttons — tap to set rating (1–5), stars fill gold
- "Done" button (gold, full width) → Home

**Navigation:** Done → `Home`

&nbsp;

**[INSERT SCREEN IMAGE HERE]**

---

## Screen 15 — Profile Screen

**File:** `tuxedo-mobile/src/screens/ProfileScreen.tsx`
**Route:** `Profile`

&nbsp;

Displays the logged-in user's profile information and membership status. Provides logout functionality.

&nbsp;

**Key Features:**
- Back button → Home
- Avatar section (animated slide-down): gold-bordered circle + user icon · full name · role label (gold) · "Gold Member" badge (if isMember)
- Profile fields (animated staggered slide-in): Hotel · Email · Phone · Device · KYC Status · Membership
- Ride Credit Balance box (Gold Members only): gold-bordered · "Ride Credit Balance" label · credit amount in large gold text
- "Logout" button (outline): clears user context → Login (replace)

**Navigation:** Back → `Home` · Logout → `Login` (replace)

&nbsp;

**[INSERT SCREEN IMAGE HERE]**

---

## Screen 16 — Commission Wallet Screen

**File:** `tuxedo-mobile/src/screens/CommissionWalletScreen.tsx`
**Route:** `CommissionWallet`

&nbsp;

Financial dashboard showing the concierge's commission earnings across different time periods, with a chart area and recent transaction history.

&nbsp;

**Key Features:**
- Back button → Home
- Earnings stats row (3 cards, animated staggered): Today $142.50 · Week $856 · Month $3,420
- Earnings chart placeholder: dark box with animated TrendingUp icon (floats up/down) — placeholder for future chart integration
- Recent transactions (4 rows, animated staggered slide-in from left):
  - Ride #1042 — Today 3:15 PM — +$6.75
  - Ride #1041 — Today 1:30 PM — +$8.10
  - Ride #1040 — Yesterday — +$5.40
  - Ride #1039 — Yesterday — +$9.00

**Navigation:** Back → `Home`

&nbsp;

**[INSERT SCREEN IMAGE HERE]**

---

## Screen 17 — Ride History Screen

**File:** `tuxedo-mobile/src/screens/RideHistoryScreen.tsx`
**Route:** `RideHistory`

&nbsp;

Chronological list of all past rides managed by the concierge. Shows fare, driver, date, and star rating for each ride.

&nbsp;

**Key Features:**
- Back button → Home
- 5 ride cards (animated staggered slide-in), each showing:
  - Ride ID · Fare (gold) · Date & time · Driver name · Star rating (filled gold) · "Completed" badge (green)
- Mock rides:
  - #1042 — Today 3:15 PM — Michael T. — $45.00 — ★★★★★
  - #1041 — Today 1:30 PM — Sarah M. — $54.00 — ★★★★
  - #1040 — Yesterday — James A. — $45.00 — ★★★★★
  - #1039 — Dec 18, 2025 — David C. — $45.00 — ★★★★
  - #1038 — Dec 17, 2025 — Emily R. — $54.00 — ★★★★★

**Navigation:** Back → `Home`

&nbsp;

**[INSERT SCREEN IMAGE HERE]**

---

## Screen 18 — Membership Screen

**File:** `tuxedo-mobile/src/screens/MembershipScreens.tsx`
**Route:** `Membership`
**Params:** `fromTrackRide` (boolean), `paymentMethod` (string or null)

&nbsp;

Upsell screen for the Tuxedo Gold membership. Presents membership benefits, pricing, and ride credit offer. Accessible from multiple points in the app.

&nbsp;

**Key Features:**
- Back button → previous screen
- Crown icon (animated spring scale-in)
- "TUXEDO GOLD" title
- Price box: "Membership Price" · "$100/yr" · green badge "Get $100 Instant Ride Credit" (lightning bolt icon)
- Benefits list (5 items, animated staggered slide-in):
  - Manual Chauffeur Selection · View Full Driver Amenities · Advanced Search Filters · Priority Dispatching · Exclusive Luxury Fleet Access
- "Buy Membership" button (gold, full width) → MembershipPayment
- "Continue Without Membership" link (shown only when `fromTrackRide = true`) → TrackRide (with `fromMembershipSkip: true`)

**Navigation:** Buy Membership → `MembershipPayment` · Continue Without Membership → `TrackRide`

&nbsp;

**[INSERT SCREEN IMAGE HERE]**

---

## Screen 19 — Membership Payment Screen

**File:** `tuxedo-mobile/src/screens/MembershipScreens.tsx`
**Route:** `MembershipPayment`
**Params:** `fromTrackRide` (boolean), `paymentMethod` (string or null)

&nbsp;

Payment screen for completing the Gold membership purchase. Simulates payment processing and unlocks membership features.

&nbsp;

**Key Features:**
- Back button → Membership screen
- Shield Check icon (animated spring scale-in)
- "COMPLETE PAYMENT" title · "Annual Gold Membership" subtitle
- Total Due box: "$100.00" · green badge "Includes $100 Ride Credit"
- Payment methods (2 tappable rows): Apple Pay · Credit Card — both trigger `handlePayment`
- On payment completion:
  - Updates user context: `isMember = true`, `rideCredit = 100`
  - Persists to AsyncStorage via `persistMembershipState(true, 100)`
  - If `fromTrackRide`: → DriverList (with `fromTrackRide: true`, `paymentMethod`)
  - Otherwise: → DriverList
- Footer: "Secure payment processed by Tuxedo Financial. Membership unlocks full driver profiles and amenities."

**Navigation:** Apple Pay or Credit Card → `DriverList`

&nbsp;

**[INSERT SCREEN IMAGE HERE]**

---

## Screen 20 — Track Ride Screen (Passenger Flow)

**File:** `tuxedo-mobile/src/screens/TrackRideScreen.tsx`
**Route:** `TrackRide`
**Params:** `fromMembershipPurchase`, `fromMembershipSkip`, `paymentMethod`, `selectedDriver`

&nbsp;

Passenger-facing ride tracking experience. Accessible from the concierge home ("Passenger Track Ride") and via deep link sent to the guest. Contains three internal steps: Config → Payment → Tracking.

&nbsp;

**Key Features:**

Step 1 — Config (Finalize Your Journey):
- Pickup location box (read-only, set by concierge) + "Set by Concierge" note
- Drop-off location input (MapPin icon)
- "Request Chauffeur" button — disabled until drop-off entered → advances to payment step

Step 2 — Payment Method Selection:
- Four payment options (tappable rows): Apple Pay · PayPal · Credit Card · Cash Payment
- Selected method highlighted with gold border
- On selection → Membership screen (with `fromTrackRide: true`)
- "Proceed to Tracking" button → skips membership, goes to tracking step

Step 3 — Live Tracking:
- Green checkmark icon · driver avatar + car icon side by side
- Driver name (uppercase, italic) · 5 sparkle icons + rating
- Animated progress bar (10%→85% cycling)
- ETA: "Live: Driver is X mins away in a [vehicle]"
- Premium Amenities box: members see amenity tags · non-members see locked box + "Buy Membership" → Membership
- "20% Off Your Next Journey!" promo box (shown after membership purchase)

Membership Status Footer Card (all steps):
- Non-members: "Tuxedo Basic Status" · "Join for $100 & Get $100 Credit" · gold arrow → Membership
- Gold Members: "Tuxedo Gold Member" · "$XX.XX Ride Credit" · "Active" badge (green)

App Download Popup (auto-shown after 5 seconds):
- "Download our app and get $100 coupon free on your next ride."
- "Download App" → stores coupon in AsyncStorage (`TUX100-XXXXXX`, $100, campaign: `track-ride-download-popup`) + opens App Store
- "Skip for Now" → closes popup

**Navigation:** Payment selection → `Membership` · Proceed to Tracking → tracking step · Buy Membership → `Membership` · Returns from Membership/DriverList → tracking step

&nbsp;

**[INSERT SCREEN IMAGE HERE]**

---

## Screen Inventory

| # | Screen Name | Route | File |
|---|-------------|-------|------|
| 1 | Login | `Login` | `src/screens/LoginScreen.tsx` |
| 2 | Concierge Home | `Home` | `src/screens/ConciergeHomeScreen.tsx` |
| 3 | Guest Details | `GuestDetails` | `src/screens/GuestDetailsScreen.tsx` |
| 4 | Schedule Booking | `ScheduleBooking` | `src/screens/ScheduleBookingScreen.tsx` |
| 5 | Waiting For Payment | `WaitingForPayment` | `src/screens/WaitingForPaymentScreen.tsx` |
| 6 | Driver Assignment Mode | `DriverAssignmentMode` | `src/screens/DriverSelectionScreens.tsx` |
| 7 | Driver Matching (Auto) | `DriverMatching` | `src/screens/DriverMatchingScreen.tsx` |
| 8 | Driver List | `DriverList` | `src/screens/DriverSelectionScreens.tsx` |
| 9 | Driver Profile | `DriverProfile` | `src/screens/DriverSelectionScreens.tsx` |
| 10 | Driver Swipe | `DriverSwipe` | `src/screens/DriverSelectionScreens.tsx` |
| 11 | Driver Confirmation | `DriverConfirmation` | `src/screens/DriverConfirmationScreen.tsx` |
| 12 | Driver ETA | `DriverETA` | `src/screens/DriverETAScreen.tsx` |
| 13 | Active Ride | `ActiveRide` | `src/screens/ActiveRideScreen.tsx` |
| 14 | Ride Completion | `RideCompletion` | `src/screens/RideCompletionScreen.tsx` |
| 15 | Profile | `Profile` | `src/screens/ProfileScreen.tsx` |
| 16 | Commission Wallet | `CommissionWallet` | `src/screens/CommissionWalletScreen.tsx` |
| 17 | Ride History | `RideHistory` | `src/screens/RideHistoryScreen.tsx` |
| 18 | Membership | `Membership` | `src/screens/MembershipScreens.tsx` |
| 19 | Membership Payment | `MembershipPayment` | `src/screens/MembershipScreens.tsx` |
| 20 | Track Ride (Passenger) | `TrackRide` | `src/screens/TrackRideScreen.tsx` |

---

*All 20 screens documented. Convert to Word, then insert screenshots at each `[INSERT SCREEN IMAGE HERE]` placeholder.*
