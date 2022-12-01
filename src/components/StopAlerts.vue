<template>
 <v-card height="100%" width="100%" outlined color="transparent"> 
  <v-img contain
          :src="goodImgUrl"
          max-height="100%"
          max-width="100%"
  ></v-img>
  </v-card>
</template>
<script>

//import VueSocketIO from 'vue-socket.io';
import SocketioService from '../services/socketio.service.js';
export default {
    name: 'StopAlerts',
    data () {
      return {
         goodImgUrl:'https://st4.depositphotos.com/1008010/23468/i/450/depositphotos_234684752-stock-photo-empty-road-yellow-traffic-sign.jpg',
      }
    },
    methods: {
    },
    updated() {
      
    },
   
  mounted(){
     this.imgUrl = this.goodImgUrl
     SocketioService.setupSocketConnection();
     SocketioService.socket.emit('stop-monitoring', {});
     SocketioService.socket.on('message', (message) => {
              console.log("message recieved", message)
     });
  },
  beforeUnmount() {
       SocketioService.disconnect();
    }

  }
  
</script>
