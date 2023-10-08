import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
    query: { token: localStorage.getItem("token") },
    withCredentials: true,  // Allow sending of credentials
    transportOptions: {
        polling: {
            extraHeaders: {
                'my-custom-header': 'abcd'
            }
        }
    }
});

export default socket;