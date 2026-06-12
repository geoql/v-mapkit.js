# mapkit-cn

Beautiful Apple MapKit components for Vue. Documentation and examples for [v-mapkit](https://github.com/geoql/v-mapkit).

## Features

- 🗺️ **24 Example Pages** - Comprehensive examples for all v-mapkit components
- 🎨 **Apple-Inspired Design** - Clean, minimal UI matching Apple's design language
- 🌓 **Dark Mode** - Full dark mode support
- 📦 **shadcn-vue Registry** - Install components via CLI
- 🚀 **Nuxt 4** - Built with Nuxt 4 and Vue 3.5
- ☁️ **Cloudflare Pages** - Deployed on Cloudflare Pages

## Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## MapKit Token

To use the map examples, you need an Apple MapKit JWT token:

1. Join the [Apple Developer Program](https://developer.apple.com/programs/)
2. Create a MapKit key in the Apple Developer portal
3. Generate a JWT token
4. Enter the token in the app when prompted

## Deployment

The app automatically deploys to Cloudflare Pages on push to `main`.

Required secrets:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## License

MIT
