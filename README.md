
# ShiftWise - Smart Shift Scheduling & Management System

![ShiftWise Logo](https://i.imgur.com/REPLACE_WITH_REAL_LOGO_URL.png)

ShiftWise is a modern shift scheduling and workforce management platform designed for both employers (admins) and employees. This web application simplifies the process of scheduling, managing shifts, and handling employee availability in a seamless and user-friendly manner.

## Features

### For Employees
- **View Weekly Schedule**: Display upcoming shifts with site-specific requirements
- **Punch In/Out System**: Includes location tracking to validate check-ins
- **Availability Settings**: Submit weekly availability for scheduling
- **Pay Stub & Earnings View**: View pay stubs, total hours worked, and earnings summary
- **Shift Details**: Display site-specific info (location, required equipment, notes, etc.)
- **Shift Management**:
  - Cancel shifts (24-hour advance notice required)
  - Claim cover-up shifts from other employees
  - Request shift swaps with coworkers

### For Admins
- **Employee Management**: View, add, remove, and edit employee information
- **Schedule Management**: Assign and modify shifts per employee
- **Leave Request Handling**: Approve or deny leave requests and manage coverage
- **Shift Swap Approval**: Review and approve/deny shift swap requests
- **Time Tracking**: Monitor employee punch-in/out times with location verification
- **Payroll Management**: Generate and manage employee payroll information
- **Announcements**: Send targeted announcements to employees

## Tech Stack

- **Frontend**: React with Vite.js, Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Query (Tanstack Query)
- **Routing**: React Router
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/shiftwise.git
cd shiftwise
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open the application in your browser
```
http://localhost:5173
```

## Demo Credentials

### Admin Account
- **Email**: admin@example.com
- **Password**: password

### Employee Account
- **Email**: employee@example.com
- **Password**: password

## Project Structure

- `/src/components` - Reusable UI components
- `/src/pages` - Page components for different routes
- `/src/services` - API service functions
- `/src/hooks` - Custom React hooks
- `/src/types` - TypeScript type definitions
- `/src/components/ui` - shadcn/ui components

## Deployment

To build the project for production:

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory, ready to be deployed to your hosting service.

## Future Enhancements

- Integration with third-party calendar apps (Google Calendar, Outlook)
- Mobile app versions (iOS, Android)
- Advanced analytics for workforce management
- AI-powered scheduling recommendations
- Multi-language support

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Query](https://tanstack.com/query/latest)
- [Lucide Icons](https://lucide.dev/)
- [Framer Motion](https://www.framer.com/motion/)
