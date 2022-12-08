<template>
<v-card outlined color="transparent">
<v-row class="fill-height" align="center" justify="center">
<button ref="audioBtn" @click="logClicked"/>
<v-img contain 
          :src="imgUrl"
          max-height="100%"
          max-width="100%"
></v-img>
<v-dialog
      v-model="dialog"
      width = "400"
    ><v-card>
        <v-card-title class="text-h5">
          Stop the alert
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          
          <v-btn
            color="success"
            x-large
            dark
            @click="stopAlerts()"
          >
            <v-icon size="40" class="align-center">mdi-timer-cancel</v-icon>
          </v-btn>
      </v-card-actions>
      </v-card>
    </v-dialog>
</v-row>

</v-card>
</template>
<script>

//import VueSocketIO from 'vue-socket.io';
import SocketioService from '../services/socketio.service.js';
import store from "../store";

  export default {
    name: 'ShowAlerts',
    data () {
      return {
        alertImgUrl:'https://media1.giphy.com/media/XHp1pFrJKQsJyp4ny0/giphy.gif?cid=6c09b952bx5w0whtr0gz641l5q28hm8i2676traf04ojkd6w&rid=giphy.gif&ct=s',
        monitoringOnUrl:'https://i.gifer.com/Cn52.gif',
        imgUrl :'',
        alertSound :'',
        dialog : false,
        audio: null,
      }
    },
    methods: {
        async logClicked(){
          /**
             * play alert sound
             * @function
          */
          this.audio = new Audio(store.state.alert_sound)
          this.audio.play()
        },
        stopAlerts(){
            /**
             * stop alert and route to home
             * @function
             */
            this.dialog = false,
            this.audio.pause()
            this.$router.push('/')
            SocketioService.disconnect();
        },
        async resetImgUrl(message){
           /**
           * resetting image url to alert type
           * @function
           */
          console.log("reset image url called",message.message)

          if(message.message=='Play Message'){
                  this.imgUrl = this.alertImgUrl
                  this.dialog = true
              }
              else if(message.message=='Play Sound'){
                  console.log("sound to play", store.state.alert_sound)
                  this.$refs.audioBtn.click()
                  this.dialog = true
              }
              else if(message.message=='Play Both'){
                  this.imgUrl = this.alertImgUrl 
                  console.log("sound to play", store.state.alert_sound)
                  this.$refs.audioBtn.click()
                  this.dialog = true
              }
        }  
    },
    updated() {
        /**
         * setting alert active
         * @function
         */
         if (store.state.alert_message=='monitoring'){
                  this.imgUrl = this.monitoringOnUrl
         }  
    },
   
  mounted(){
      /**
       * socket connection
       * @function
       */
     this.imgUrl = this.goodImgUrl
     store.dispatch("set_message", "monitoring")
     SocketioService.setupSocketConnection();
     SocketioService.socket.emit('start-monitoring', {alert:store.getters.getAlertType});
     SocketioService.socket.on('message', (message) => {
              console.log("message recieved", message)
              store.dispatch("set_message", message)
              this.resetImgUrl(message)
              });
  },
  beforeUnmount() {
       SocketioService.disconnect();
    }

  }
  
</script>
