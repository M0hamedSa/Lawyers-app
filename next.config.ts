import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  typedRoutes: true,
  outputFileTracingIncludes: {
    '/api/export-transactions': ['./fonts/**/*'],
  },
};

export default withNextIntl(nextConfig);
