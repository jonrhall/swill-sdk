const httpClient = require('../core/http-client');

const messagesInterface = {
  getMessages: async () => {
    return (await httpClient.getSystemDump()).messages;
  }
};

module.exports = messagesInterface;