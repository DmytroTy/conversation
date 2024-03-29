const app = new Vue({
  el: '#app',
  data: {
    title: 'Nestjs Websockets Chat',
    name: '',
    text: '',
    messages: [],
    socket: null,
  },
  methods: {
    sendMessage() {
      if(this.validateInput()) {
        const message = {
          // name: this.name,
          text: this.text,
          userID: '6256b435a342be12b1e3cc16',
          conversationID: '6259421b51c80e9197cb028e',
        };
      this.socket.emit('createMessage', message);
      this.text = '';
      }
    },
    receivedMessage(message) {
      this.messages.push(message);
    },
    validateInput() {
      return this.name.length > 0 && this.text.length > 0;
    }
  },
  created() {
    this.socket = io('http://localhost:8080', {
      query: {
        conversationID: '6259421b51c80e9197cb028e',
      },
      auth: {
        token: 'abcd',
      },
      /* extraHeaders: {
        Authorization: 'Bearer 1234',
      }, */
    });
    this.socket.on('newMessage', (message) => {
      this.receivedMessage(message);
    });
  },
});
