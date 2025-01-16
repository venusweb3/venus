# create-venus-app

A minimal CLI tool to scaffold venus applications with zero configuration. Get started building your own venus-style chatbot in seconds.

<!-- automd:badges color="yellow" license name="create-venus-app" codecov bundlephobia packagephobia -->

[![npm version](https://img.shields.io/npm/v/create-venus-app?color=yellow)](https://npmjs.com/package/create-venus-app)
[![npm downloads](https://img.shields.io/npm/dm/create-venus-app?color=yellow)](https://npm.chart.dev/create-venus-app)
[![bundle size](https://img.shields.io/bundlephobia/minzip/create-venus-app?color=yellow)](https://bundlephobia.com/package/create-venus-app)

<!-- /automd -->

## Usage

You can create a new venus app with your preferred package manager:

<!-- automd:pm-x version="latest" name="create-venus-app" args="path" <flags>" -->

```sh
# npm
npx create-venus-app@latest path

# pnpm
pnpm dlx create-venus-app@latest path

# bun
bunx create-venus-app@latest path

# deno
deno run -A npm:create-venus-app@latest path
```

<!-- /automd -->

## Command Line Arguments

- `--name`: Name of the template to use (default: "venus")
- `--dir`: Directory where the project will be created (default: current directory)
- `--registry`: Custom registry URL for templates

## Getting Started

Once your project is created:

1. Navigate to the project directory:

    ```bash
    cd your-project-name
    ```

2. Copy the example environment file:

    ```bash
    cp .env.example .env
    ```

3. Install dependencies:

    ```bash
    pnpm install
    ```

4. Start the development server:
    ```bash
    pnpm start
    ```

<!-- automd:with-automd -->

---

_🤖 auto updated with [automd](https://automd.unjs.io)_

<!-- /automd -->
