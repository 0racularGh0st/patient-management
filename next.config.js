/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['lh3.googleusercontent.com'],
    },
    experimental: {
        serverComponentsExternalPackages: ['mongoose', 'mongodb'],
    },
}

module.exports = nextConfig
