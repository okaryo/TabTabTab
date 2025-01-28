## Contributing to TabTabTab

Thank you for your interest in contributing to TabTabTab! Please follow the guidelines below to ensure a smooth contribution process.

### Setup

Follow these steps to set up your development environment.

#### 1. Install Dependencies
Install the necessary dependencies for the project.

```sh
npm install
```

#### 2. Start the Development Server
Start the development environment and verify that it works as expected.

```sh
npm run dev
```

#### 3. Load the Extension in the Browser
To run the development version of the Chrome extension in your browser:

1. Open Chrome and navigate to `chrome://extensions`.
2. Enable **Developer mode** (toggle in the upper right corner).
3. Click **Load unpacked** and select the `dist` directory where the extension files are located.
4. Verify that the extension is loaded and functioning as expected.
5. If the development server is running, changes to the code will be reflected by simply reloading the page. However, if changes are made to `manifest.json` or `background.js`, you will need to click the **Reload** button in `chrome://extensions` to update the extension.

![Load local extension](./docs/setup_local_extension.png)

### Contribution Workflow

1. **Report Issues or Share Ideas**\
   If you find a bug or have a feature suggestion, feel free to use [Issues](https://github.com/okaryo/TabTabTab/issues) or [Discussions](https://github.com/okaryo/TabTabTab/discussions). If your idea is not fully formed, posting in Discussions is recommended.\
   - Before starting work, please create an Issue and discuss your implementation plan. This helps reduce the burden during review and minimizes unnecessary misunderstandings.
   - For minor bug fixes or small changes like typos, creating an Issue is not necessary. However, if you are unsure, it is recommended to create an Issue.
   - Declare your intent to work on the Issue to avoid duplicate efforts.

2. **Submit a Pull Request**\
   When making changes, ensure you check out from the default `develop` branch and set the pull request's target branch to `develop`. Include the following in your pull request:

   - Background or context of the issue or feature
   - A brief description of the changes made

### Coding Guidelines

Follow the coding style and standards of this project.

- **Run Linting**: After making changes, run the linter to ensure there are no issues.

  ```sh
  npm run lint
  ```

- **Run Tests**: Add or update tests for any changes you make and ensure all tests pass.

  ```sh
  npm run test
  ```

---

## Additional Information

If you have any questions, feel free to reach out via [Discussions](https://github.com/okaryo/TabTabTab/discussions)!

We look forward to your contributions!
