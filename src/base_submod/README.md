# Porter Base Submodule

## Overview

The Porter Base Submodule is a foundational library for Porter applications, providing a set of reusable components, utilities, and configurations. This submodule is designed to be integrated into larger Porter projects, ensuring consistency and reducing code duplication across different applications.

## Project Status

⚠️ **IMPORTANT**: This project is a work in progress. Many features are incomplete, and significant design decisions are still pending. The codebase is subject to major changes.

## Features

- **UI Components**: A collection of reusable React components built with accessibility and customization in mind.
- **Utility Functions**: Helper functions for common tasks such as API calls, JWT handling, and local storage management.
- **Styling**: Preset configurations for colors, typography, and spacing using UnoCSS.
- **API Handling**: Robust API call management with automatic token refresh and error handling.
- **Authentication**: Utilities for managing user authentication and authorization.

## Directory Structure

```
./
├── README.md
├── assets/
│   ├── images/
│   └── styles/
├── components/
│   ├── Buttons/
│   ├── Misc/
│   └── ui/
├── data/
├── lib/
│   └── uno/
├── utils/
│   └── api/
```

## Getting Started

To use this submodule in your Porter project:

1. Add this repository as a submodule to your main project.
2. Import the required components and utilities in your application.
3. Use the provided UnoCSS presets in your UnoCSS configuration.

## Contributing

We are not currently accepting external contributions as the project is in early development stages. This policy will be revised as the project matures.
