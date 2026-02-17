/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://fastqrgenerator.vercel.app",
  generateRobotsTxt: true,
  sitemapSize: 5000,
  outDir: "./public",
  exclude: ["/404"],
  changefreq: "daily",
  priority: 0.7,
  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/" }],
  },
};
