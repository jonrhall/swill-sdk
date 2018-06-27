const httpClient = require('../core/http-client');

const messagesInterface = {
  getMessages: async () => (await httpClient.getSystemDump()).messages,
  deleteMessage: async id => httpClient.delete(`/notification/${id}`)
};

module.exports = messagesInterface;