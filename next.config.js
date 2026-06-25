/** @type {import('next').NextConfig} */
const nextConfig = {
    // A stray package-lock.json in a parent dir makes Next 16 infer the wrong
    // workspace root for Turbopack. Pin it to this project.
    turbopack: {
        root: __dirname,
    },
    images: {
        // Next 16: `images.domains` is removed in favour of `remotePatterns`.
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
        ],
    },
    // Next 15+: `experimental.serverComponentsExternalPackages` moved to the
    // top level and was renamed to `serverExternalPackages`.
    serverExternalPackages: ['mongoose', 'mongodb'],
}

module.exports = nextConfig
