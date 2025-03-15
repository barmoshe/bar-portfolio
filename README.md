# Bar Moshe Portfolio

A modern, responsive portfolio website built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- Responsive design that works on all devices
- Interactive UI with smooth animations using Framer Motion
- Dark/light theme support
- Modular component architecture
- Backend API playground
- Contact form

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Styling**: Tailwind CSS, Shadcn UI components
- **Animation**: Framer Motion
- **State Management**: React Context API
- **Form Handling**: React Hook Form
- **Deployment**: Ready for Vercel or similar platforms

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or pnpm

## 🔧 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/bar-portfolio.git
   cd bar-portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📦 Project Structure

```
bar-portfolio/
├── app/                  # Next.js app directory
│   ├── api/              # API routes
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── about-new/        # About section components
│   ├── contact-new/      # Contact section components
│   ├── education-new/    # Education section components
│   ├── experience-new/   # Experience section components
│   ├── hero-new/         # Hero section components
│   ├── projects-new/     # Projects section components
│   ├── skills/           # Skills section components
│   ├── ui/               # UI components
│   ├── backend.tsx       # Backend playground component
│   ├── footer.tsx        # Footer component
│   └── navbar-new.tsx    # Navigation component
├── contexts/             # React contexts
├── data/                 # Data storage
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── public/               # Static assets
└── styles/               # Additional styles
```

## 🚢 Deployment

This project is ready to be deployed on Vercel:

1. Push your code to a GitHub repository.
2. Sign up on [Vercel](https://vercel.com) and import your repository.
3. Vercel will automatically detect Next.js and set up the build configuration.
4. Click "Deploy" and your site will be live in minutes.

## 🔄 API Routes

- `GET /api/data`: Retrieves user and project data
- `POST /api/data`: Updates user and project data

## 🧩 Environment Variables

No environment variables are required for basic functionality.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

- Bar Moshe
- GitHub: [barmoshe](https://github.com/barmoshe)
- LinkedIn: [barmoshe](https://linkedin.com/in/barmoshe) 