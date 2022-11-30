<template>
<v-card outlined color="transparent">
<v-row>
  <v-col cols="5">
    <template>
        <div>Select your favourite <strong>alert</strong></div>
      </template>
    <v-radio-group v-model="radios">
      
      <v-list>
        <v-list-item
          v-for="item in alerts"
          :key="item.title"
          :to="item.to"
        >
        <v-radio :value="item.title">
        <template v-slot:label>
          <div class="pa-4 blue-grey lighten-3 rounded-xl mb-5 pd-2"> 
            <v-icon size="70" class="align-center"
            :color="item.color">{{item.icon}}
            </v-icon>
            <v-icon size="70" class="align-center"
            :color="item.color2">{{item.icon2}}
            </v-icon>
            {{item.title}}</div>
        </template>
      </v-radio>
        </v-list-item>
      </v-list>
    </v-radio-group>
  
  <div class="pa-4 blue-grey lighten-3 rounded-lg mb-3 pd-2"> 
  <v-checkbox
              label="Seat Vibrate"
              color="warning"
              value="vibrate"
              hide-details
              append-icon="mdi-car-seat"
  >
  </v-checkbox>
  </div>
  </v-col>
  <v-divider
      class="mx-4"
      vertical
    ></v-divider>
  <v-col cols="6">
    <template>
        <div>Choose your favourite <strong>alarm sound</strong></div>
    </template>
    <v-row>
     <v-select
          v-model="e2"
          :items="sound"
          menu-props="auto"
          hide-details
          label="Select Alert Sound"
          single-line
          v-on:change="changeSound"
    ></v-select>
   
    <v-card-text>
      <v-btn class="mx-6" dark color="blue-grey " @click="playSound()" >
      <v-icon dark>
        mdi-play
      </v-icon>
      </v-btn>
      <v-btn class="mx-6" dark color="blue-grey " @click="stopSound()" >
      <v-icon dark>
        mdi-stop
      </v-icon>
      </v-btn>
      <v-btn
        :disabled="soundBtnDisable"
        class="mx-6"
        dark
        color="blue-grey"
        @click="setSound()"
      >
        <v-icon dark>
          mdi-plus
        </v-icon>
      </v-btn>
    </v-card-text>
    </v-row>
    <v-divider/>

    <template>
        <div>Check your <strong>Camera</strong></div>
        <v-btn class="mx-6" dark color="blue-grey " @click="onStart" >Start Camera</v-btn>
        <v-btn class="mx-6" dark color="blue-grey " @click="onStop" >Stop Camera</v-btn>
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
    </template>
   <web-cam/>
  </v-col>
</v-row>

</v-card>
</template>
<script>

//import VueSocketIO from 'vue-socket.io';
import { WebCam } from "vue-web-cam";
  export default {
    name: 'SetAlerts',
    data () {
      return {
        img: "",
        camera: null,
        deviceId: null,
        devices: [],
        audio: null,
        radios: 'Both',
        btnText: 'Set Color to "Success" (Green)',
        sound: [],
        soundFile : 'http://www.noiseaddicts.com/samples_1w72b820/290.mp3',
        color: 'grey',
        soundBtnDisable: true,
        e2: 'Texas',
        alerts: [
          { title: 'Alarm Sound', icon: 'mdi-bell-alert', color:'green'},
          { title: 'Alert Message', icon: 'mdi-message-flash', color:'light-blue darken-2'},
          { title: 'Both', icon: 'mdi-bell-alert', icon2:'mdi-message-flash', color:'green', color2:'light-blue darken-2'},
        ],
      }
    },
    methods: {
        async changeSound(a) {
          this.soundBtnDisable = false
          this.soundFile = await require('../../assets/sounds/'+a)
        },
        playSound(){
          this.audio = new Audio(this.soundFile)
          this.audio.play()
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
