const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');
const withSass = require('@zeit/next-sass');
module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
  }

  return withSass();
};
