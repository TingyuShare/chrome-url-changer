# AWS Console URL Changer

A Chrome extension that automatically updates AWS Console URLs to your preferred region. This extension is particularly useful for users who frequently work with different AWS regions in China (cn-north-1, cn-northwest-1).

## Features

- Automatically detects AWS Console URLs (*.console.amazonaws.cn)
- Allows you to select your preferred AWS region
- Automatically redirects to the selected region when navigating AWS Console pages
- Maintains your region preference across browser sessions

## Installation

### From Source

1. Clone this repository:
```bash
git clone https://github.com/TingyuShare/chrome-url-changer.git
cd chrome-url-changer
```

2. Install dependencies:
```bash
npm install
```

3. Build the extension:
```bash
npm run build
```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right corner
   - Click "Load unpacked"
   - Select the `dist` directory from this project

### From Chrome Web Store
*(Coming soon)*

## Usage

1. Click the extension icon in your Chrome toolbar
2. Select your preferred AWS region from the dropdown menu
3. Browse the AWS Console as normal - URLs will automatically update to your selected region

## Development

This project uses:
- TypeScript for type-safe code
- Webpack for building the extension
- Chrome Extension Manifest V3

To start development:

1. Make changes to files in the `src` directory
2. Run `npm run build` to compile
3. Reload the extension in Chrome

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
