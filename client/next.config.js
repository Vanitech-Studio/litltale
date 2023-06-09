const nextConfig = {
  reactStrictMode: false,
  styledComponents: true,
  generateEtags: false,
  images: {
    domains: [
      "cdn.discordapp.com",
      "media.discordapp.net"
    ]
  },
  // Enable server-side rendering
  ssr: true,
}

module.exports = nextConfig
