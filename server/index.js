/**
 * Common node web server interface used for development and production.
 * This server is only used for development purposes, since this component is consumed by a page/feature
 *
 * @see https://code.devops.fds.com/polaris/core/server/blob/master/README.md
 */
const Server = require('@core/server');

const server = new Server();
server.start();
