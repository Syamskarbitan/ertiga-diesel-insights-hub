# GADIES - Ertiga Diesel Insights Hub

A comprehensive OBD-II diagnostic application specifically designed for Suzuki Ertiga Diesel vehicles.

## Features

- **Real-time OBD-II Data Monitoring**: Monitor engine parameters, fuel system, electrical system, and more
- **ELM327 Device Support**: Compatible with both Bluetooth and WiFi ELM327 adapters
- **Modern UI/UX**: Clean, responsive interface with dark/light theme support
- **Historical Data Charts**: Track parameter trends over time
- **Alert System**: Get notified of critical parameter values
- **Suzuki Ertiga Diesel Specific**: Optimized for Ertiga Diesel's OBD-II implementation

## Supported Parameters

### Engine Parameters
- Engine RPM
- Engine Load
- Engine Temperature
- Intake Air Temperature (IAT)
- Mass Air Flow (MAF)
- Throttle Position
- Fuel Pump Status
- Oil Pressure
- EGR Status
- Glow Plug Status

### Fuel System
- Fuel Level
- Fuel Trim (Short & Long Term)
- Fuel Rail Pressure
- Fuel Flow Rate
- Fuel Injection Timing
- Barometric Pressure

### Electrical System
- Battery Voltage
- Battery Temperature
- Battery Current

### Turbo/Boost
- Boost Pressure
- Boost Solenoid
- A/C System Status

### Diagnostic
- DTC Count
- Readiness Status
- OBD Standards Detection

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **UI Framework**: Tailwind CSS + Radix UI
- **Mobile**: Capacitor for Android native features
- **Bluetooth**: @capgo/bluetooth-serial for classic Bluetooth
- **Charts**: Recharts for data visualization
- **Build Tool**: Vite

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Sync with Android:
   ```bash
   npx cap sync android
   ```
4. Open in Android Studio:
   ```bash
   npx cap open android
   ```
5. Build and install APK

## Usage

### Bluetooth ELM327 Connection
1. Pair your ELM327 device with Android via Settings
2. Open GADIES app
3. Select "Bluetooth" connection type
4. Tap "Scan Devices" to find paired ELM327
5. Connect to your device

### WiFi ELM327 Connection
1. Connect your phone to ELM327 WiFi network
2. Open GADIES app
3. Select "WiFi" connection type
4. Enter ELM327 IP address (default: 192.168.0.10)
5. Enter port (default: 35000)
6. Tap "Connect WiFi"

### Monitoring Data
- Once connected, real-time OBD data will be displayed
- Switch between Dashboard, Charts, Connection, and Settings tabs
- Monitor critical parameters and receive alerts
- View historical trends in Charts tab

## Permissions

The app requires the following Android permissions:
- `BLUETOOTH` - For Bluetooth communication
- `BLUETOOTH_ADMIN` - For Bluetooth management
- `BLUETOOTH_SCAN` - For scanning Bluetooth devices (Android 12+)
- `BLUETOOTH_CONNECT` - For connecting to Bluetooth devices (Android 12+)
- `ACCESS_FINE_LOCATION` - Required for Bluetooth scanning
- `INTERNET` - For WiFi ELM327 communication

## Supported Vehicles

Primarily designed and tested for:
- Suzuki Ertiga Diesel (2018+)
- ISO 15765-4 (CAN) protocol
- ELM327 v1.5+ adapters

## Troubleshooting

### Bluetooth Connection Issues
- Ensure ELM327 is paired in Android Settings first
- Check if ELM327 is already connected to another app
- Try restarting Bluetooth on your device
- Ensure location permission is granted

### WiFi Connection Issues
- Verify you're connected to ELM327 WiFi network
- Check IP address and port settings
- Ensure ELM327 WiFi is in AP mode
- Try default settings: 192.168.0.10:35000

### No OBD Data
- Ensure vehicle ignition is ON
- Check OBD-II port connection
- Verify ELM327 compatibility with your vehicle
- Try different OBD protocols in ELM327 settings

## Development

### Project Structure
```bash
src/
├── components/          # React components
│   ├── ModernDashboard.tsx
│   └── WelcomeScreen.tsx
├── hooks/              # Custom React hooks
│   ├── useClassicBluetooth.ts
│   ├── useWiFiELM327.ts
│   ├── useOBDData.ts
│   └── useConnectionManager.ts
├── types/              # TypeScript declarations
└── lib/                # Utility functions
```

### Key Hooks
- `useClassicBluetooth`: Manages Bluetooth ELM327 connections
- `useWiFiELM327`: Manages WiFi ELM327 connections
- `useOBDData`: Handles OBD-II data polling and parsing
- `useConnectionManager`: Manages connection state across both types

## Contributing

Contributions are welcome! Please ensure:
1. Code follows TypeScript best practices
2. UI changes maintain accessibility
3. Test on real ELM327 devices
4. Update documentation as needed

## License

MIT License - see LICENSE file for details

## Author

GADIES (ertiGA-DiESel Jatim by Samsul) - Specialized OBD-II diagnostic tool for Suzuki Ertiga Diesel vehicles.
