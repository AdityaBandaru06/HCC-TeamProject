<template>
<v-card outlined color="transparent">
<v-row>
  <v-col cols="4">
    <template>
        <h2>Select your favourite <strong>alert</strong></h2>
      </template>
     <v-radio-group class="small-radio" v-model="radios"  v-for="item in alerts"
          :key="item.title"
          :to="item.to">
        <v-radio :value="item.title" active-class="active" @click="alertSelected(item.title)"> 
        <template v-slot:label>
          <div class="pa-4 secondary lighten-1 rounded-xl mb-2 pd-2"> 
            <v-icon size="70" class="align-center"
            :color="item.color">{{item.icon}}
            </v-icon>
            <v-icon size="68" class="align-center"
            :color="item.color2">{{item.icon2}}
            </v-icon>
            {{item.title}}</div>
        </template>
      </v-radio>
    </v-radio-group>
  </v-col>
  <v-divider
      class="mx-4"
      vertical
    ></v-divider>
  <v-col cols="6">
    <template>
        <h2>Choose your favourite <strong>alarm sound</strong></h2>
    </template>
    <v-row>
      <v-card-text>
     <v-select
          :items="sound"
          menu-props="auto"
          hide-details
          label="Select Alert Sound"
          single-line
          v-on:change="changeSound"
    ></v-select>
   
    </v-card-text>
    <v-card-text>
      <v-btn :disabled="soundBtnDisable" class="mx-6" dark color="secondary" @click="stopSound()" >
      <v-icon dark color="red">
        mdi-stop
      </v-icon>
      </v-btn>
      <v-btn
        :disabled="soundBtnDisable"
        class="mx-6"
        dark
        color="secondary"
        @click="setSound()"
      >
        <v-icon dark color="green">
          mdi-plus
        </v-icon>
      </v-btn>
    </v-card-text>
    </v-row>
    <v-divider/>

    <template>
      <v-card outlined color="transparent" >
        <div>Check your <strong>Camera</strong>  <v-btn class="mx-6" dark color="secondary " @click="onStop" >Stop Camera</v-btn></div>
        <!--v-btn class="mx-6" dark color="blue-grey " @click="onStart" >Start Camera</v-btn-->
       
        <div class="border">
          
                    <web-cam
                        ref="webcam"
                        :device-id="deviceId"
                        width="100%"
                        @started="onStarted"
                        @stopped="onStopped"
                        @error="onError"
                        @cameras="onCameras"
                        @camera-change="onCameraChange"
                    />
  
                </div>
        <div>
          <img :src="img" class="img-responsive" />
        </div>
      </v-card>      
    </template>
   <web-cam/>
  </v-col>
</v-row>

</v-card>
</template>
<script>

//import VueSocketIO from 'vue-socket.io';
import { WebCam } from "vue-web-cam";
import store from "../store";

  export default {
    name: 'SetAlerts',
    data () {
      return {
        store,
        img: "",
        alertType:"",
        camera: null,
        deviceId: null,
        divClicked:false,
        devices: [],
        audio: null,
        radios: '',
        sound: [],
        soundFile : 'http://www.noiseaddicts.com/samples_1w72b820/290.mp3',
        color: 'grey',
        soundBtnDisable: true,
        alerts: [
          { title: 'Alarm Sound', icon: 'mdi-bell-alert', color:'green'},
          { title: 'Alert Message', icon: 'mdi-message-flash', color:'light-blue darken-2'},
          { title: 'Both', icon: 'mdi-bell-alert', icon2:'mdi-message-flash', color:'green', color2:'light-blue darken-2'},
          { title: 'Seat Vibration', icon: 'mdi-seat', color:'dark-brown'},
        ],
      }
    },
    methods: {
        alertSelected(alert){
            console.log("selected alert",alert)
            this.alertType = alert
            store.dispatch("set_type", this.alertType)
            console.log("type to show",store.state.alert_type)
        },
        async changeSound(a) {
          this.soundBtnDisable = false
          this.soundFile = await require('../../assets/sounds/'+a)
          this.audio = new Audio(this.soundFile)
          this.audio.play()
        },
        setSound(){
            console.log("set sound called")
            //store.alert_sound = this.soundFile
            store.dispatch("set_sound",this.soundFile)
            console.log("Sound to show",store.state.alert_sound)
        },
        stopSound(){
          this.audio.pause()
        },
        setColor () {
          if (this.color) {
            this.color = null
            this.btnText = 'Set Color to "Success" (Green)'
          } else {
            this.color = 'success'
            this.btnText = 'Set Color to Default (Follow the Theme)'
          }
        },
        onStarted(stream) {
            console.log("On Started Event", stream)
        },
        onStopped(stream) {
            console.log("On Stopped Event", stream);
        },
        onStop() {
            this.$refs.webcam.stop();
        },
        onStart() {
            this.$refs.webcam.start();
        },
        onError(error) {
            console.log("On Error Event", error);
        },
        onCameras(cameras) {
            this.devices = cameras;
            console.log("On Cameras Event", cameras);
        },
        onCameraChange(deviceId) {
            this.deviceId = deviceId;
            this.camera = deviceId;
            console.log("On Camera Change Event", deviceId);
        }
    
    },
    watch: {
        camera: function(id) {
            this.deviceId = id;
        },
        devices: function() {
            // Once we have a list select the first one
            const [first, ...tail] = this.devices;
            console.log(tail)
            if (first) {
                this.camera = first.deviceId;
                this.deviceId = first.deviceId;
            }
        }
    },
    computed: {
      device: function() {
            return this.devices.find(n => n.deviceId === this.deviceId);
      },
      length () {
        return 10
      },
    },
  mounted(){
    this.radios = store.getters.getAlertType
    console.log("Previously stored type:", store.getters.getAlertType)
    const illustrations = require.context(
      '../../assets/sounds',
      true,
      /\.*$/
    )
    var sound = []
    illustrations.keys().map(function(value) {
      sound.push(value.replace(/\.\//g, ''))
    });
    this.sound = sound
  },
  components: {
    //VuetifyAudio: () => import('vuetify-audio'),
    WebCam
  }
  }
  
</script>
<style scoped>
.red {
  background-color: red;
}
.active .trucksicons {
  border: 2px solid green;
}
.small-radio i {
  font-size: 19px;
}
.small-radio label {
  font-size: 14px;
  padding-left: 0px;
  margin-left: -4px;
}
.small-radio .v-radio {
  padding: 0px;
}
.small-radio [class*="__ripple"] {
  left: 0;
}
</style>