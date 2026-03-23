# TUXEDO CONCIERGE
## Luxury Ride-Management Application

A premium tablet-first ride management application for hotel concierges, valet staff, and managers.

### Design System
- **Colors**: Black & White base with Gold (#D4AF37) accents
- **Visual Style**: Premium glassmorphism with subtle blur and soft shadows
- **Typography**: Modern sans-serif (Inter font) for high readability
- **UX**: Fast actions, low cognitive load, real-time feedback, executive-grade polish

### Screen Categories (16 Total)

#### 1. LOGIN & DEVICE BINDING
- `/login` - Role-Based Login (Concierge / Valet / Manager)
- `/device-binding` - Device Binding Security (fraud prevention)

#### 2. KYC UPLOAD & WAIT STATE
- `/kyc-required` - KYC Document Upload (Hotel ID, Employee ID, Authorization)
- `/kyc-pending` - KYC Approval Waiting Screen

#### 3. HOME DASHBOARD
- `/home` - Concierge Home (Create Ride, Active Ride, Commission Wallet, Today's Stats)

#### 4. RIDE CREATION – GUEST DETAILS
- `/guest-details` - Guest Information Input (Phone, Email, Present/Remote)

#### 5. RIDE CREATION – RIDE DETAILS
- `/ride-config` - Ride Configuration (Pickup, Destination, Vehicle Type, Payment Type)

#### 6. RIDE CONFIRMATION & DISPATCH
- `/confirm-dispatch` - Confirm & Dispatch (Fare estimate, Commission preview)

#### 7. QR CODE SELF-BOOKING
- `/qr-booking` - Guest QR Booking Screen

#### 8. DRIVER MATCHING & ETA
- `/driver-matching` - Chauffeur Matching (Live searching)
- `/driver-eta` - Driver ETA View (Live map, Driver card, Countdown)

#### 9. ACTIVE RIDE TRACKING
- `/active-ride` - Active Ride Timeline (Status: Assigned → Arriving → Onboard → En Route → Completed)

#### 10. CASH CONFIRMATION
- `/cash-confirmation` - Cash Ride Confirmation Workflow

#### 11. RIDE COMPLETION & RATING
- `/ride-completion` - Post-Ride Summary (Fare, Commission, Driver Rating)

#### 12. COMMISSION WALLET
- `/wallet` - Commission Wallet Dashboard (Today, Weekly, Monthly earnings with charts)

#### 13. RIDE HISTORY & REPORTS
- `/history` - Ride History List (Filters, Per-ride breakdown)

#### 14. HOTEL MANAGER DASHBOARD
- `/manager` - Hotel Performance Dashboard (Total rides, Commission, Top drivers, Avg ETA)

#### 15. PROFILE & SETTINGS
- `/profile` - Profile & Security Settings (Role, Hotel, Bound devices)

#### 16. EMPTY & ERROR STATES
- `/no-drivers` - No Drivers Available (Retry or Schedule)

### Key Features
- **Glassmorphism UI**: Premium glass panels with backdrop blur
- **Gold Accents**: Luxury brand color for CTAs and highlights
- **Real-time Updates**: Live driver matching and ETA tracking
- **Commission Tracking**: 15% commission on all rides
- **Device Binding**: Security feature to prevent fraud
- **Multi-role Support**: Concierge, Valet, and Manager roles
- **Responsive Design**: Tablet-first, responsive to mobile

### Tech Stack
- React 18.3.1
- React Router DOM 7.10.1
- TypeScript
- Tailwind CSS 4.1.12
- Lucide React Icons
- Context API for state management

### Getting Started
Navigate to `/login` to begin. Use the role selector to choose your role (Concierge, Valet, or Manager), then proceed through the booking flow.

### Mock Data
The application uses mock data for demonstration. All rides, drivers, and commissions are simulated.
