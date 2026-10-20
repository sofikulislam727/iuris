# IURIS

<p align="center">
  <img src="apps/web/public/logo.png" alt="IURIS Logo" width="180" />
</p>

<h3 align="center">Islamic University Real-Time Intelligence for Surveillance</h3>

<p align="center">
  An AI-assisted campus security and intelligent video surveillance platform.
</p>

<p align="center">
  <strong>🚧 Actively Under Development</strong>
</p>

---

## Overview

**IURIS** stands for **Islamic University Real-Time Intelligence for Surveillance**. It is an open-source project focused on exploring how artificial intelligence and computer vision can support campus security, real-time situational awareness, and incident management.

Initially designed with the Islamic University campus in Kushtia, Bangladesh, in mind, IURIS aims to provide a centralized platform where authorized security personnel can monitor camera status, manage alerts, review incidents, and access AI-assisted insights.

The project is under active development, with the web application being built first and additional vision-processing and video-streaming capabilities planned for future integration.

## Vision

To explore a smarter, more responsive, and responsible approach to campus security by combining real-time video intelligence with human-supervised decision-making.

## Planned Features

- **Security Dashboard** — Centralized overview of camera status, alerts, and incidents.
- **Camera Management** — Register cameras and monitor their availability and connection status.
- **Intelligent Event Detection** — Use computer vision to identify potentially relevant events in video streams.
- **Real-Time Alerts** — Surface detected events for timely review by authorized personnel.
- **Incident Management** — Record, categorize, investigate, and track incidents.
- **Evidence Management** — Organize incident-related snapshots, video clips, and supporting records securely.
- **AI-Assisted Analysis** — Generate event summaries and contextual insights to assist human reviewers.
- **Analytics and Reporting** — Explore incident patterns and prepare operational reports.
- **Authentication and Access Control** — Protect the platform with authenticated access and role-based permissions.

*These features describe the project's intended direction; availability will depend on implementation progress.*

## Technology Stack

| Component | Technology |
|---|---|
| Web application | Next.js, React, TypeScript |
| Styling | Tailwind CSS |
| Package management | npm |
| Authentication | Better Auth — planned |
| Database | PostgreSQL — planned |
| ORM | Prisma — planned |
| Vision API | Python, FastAPI — planned |
| AI orchestration | LangGraph.js — planned |
| Video streaming | MediaMTX — planned |

The technology stack may evolve as development progresses.

## Project Structure

```text
iuris/
├── apps/
│   └── web/                 # Main Next.js web application
├── packages/                # Shared packages, as needed
├── docs/                    # Project documentation
├── scripts/                 # Development utilities
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

The repository currently prioritizes the web application. Additional services and packages will be introduced as the architecture develops.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) — use a supported LTS release.
- npm — included with Node.js.
- [Git](https://git-scm.com/).

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/sofikulislam727/iuris.git
   cd iuris
   ```

   Replace `YOUR_USERNAME` with the repository owner's GitHub username.

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:7000](http://localhost:7000) in your browser.

These commands assume the root `package.json` is configured with npm workspaces and a development script that runs the `@iuris/web` workspace. If running the application independently, use:

```bash
cd apps/web
npm install
npm run dev
```

## Development Status

**IURIS is actively under development.**

Development begins with the web application's core interface and workflows, followed by the gradual integration of authentication, persistent data storage, camera management, video processing, and AI-assisted event analysis.

Interfaces, APIs, and architecture may change as the project evolves. Not all planned features are implemented or production-ready.

## Security, Privacy, and Responsible Use

Campus surveillance systems handle sensitive information and must be developed and deployed responsibly.

IURIS aims to follow these principles:

- **Authorized access:** Restrict monitoring and evidence access to approved personnel.
- **Data protection:** Secure credentials, camera stream URLs, recordings, and incident records.
- **Privacy by design:** Apply appropriate collection limits, retention periods, and deletion policies.
- **Auditability:** Maintain audit records for sensitive actions and evidence access.
- **Human oversight:** Treat AI-generated detections and summaries as advisory; require appropriate human review before consequential decisions.
- **Responsible deployment:** Obtain the necessary institutional authorization and follow applicable laws and privacy requirements.

**Never commit API keys, passwords, production credentials, private CCTV footage, or sensitive camera configuration to the repository.**

## Contributing

Contributions, bug reports, documentation improvements, and feature suggestions are welcome.

As the project develops, contribution guidelines and development documentation will be expanded. Before contributing, please check existing issues and discussions, test your changes, and describe the purpose and impact of your proposed changes.

## License

A project license has not yet been selected. A suitable open-source license will be added when the licensing decision is finalized.

---

<p align="center">
  <strong>IURIS</strong><br />
  Building toward more intelligent and responsible campus security.
</p>
