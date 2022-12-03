<template>
  <section class="display" >
    <video
      ref="videoEl"
      autoplay="true"
      playsinline
      @loadedmetadata="runModel"
    />
    <canvas ref="canvasEl" width="100" height="100"/>
  </section>
</template>

<script>
import * as faceAPI from 'face-api.js'
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
export default {
  name: 'VideoCheck',
  setup () {
    const initParams = reactive({
      modelUri: '/models',
      option: new faceAPI.SsdMobilenetv1Options({ minConfidence: 0.8 })
    })
    const constraints = reactive({
      video: {
        width: {
          min: 200,
          ideal: 150,
          max: 200
        },
        height: {
          min: 200,
          ideal: 150,
          max: 200
        },
        frameRate: {
          min: 15,
          ideal: 30,
          max: 60
        },
        facingMode: 'environment'
      }
    })
    const videoEl = ref(null)
    const canvasEl = ref(null)

    /**
     * caculate fps for detection
     * @function
     * @param number
     */
    /**
       * @function
       * @description detect input video
       */
    const runModel = async () => {
      try{  
          const result = await faceAPI.detectSingleFace(videoEl.value, initParams.option).withFaceLandmarks()

          if (result) {
              const dims = faceAPI.matchDimensions(canvasEl.value, videoEl.value, true)
              const resizeResults = faceAPI.resizeResults(result, dims)
              faceAPI.draw.drawDetections(canvasEl.value, resizeResults , { withScore: true })
            }
        
        setTimeout(() => runModel())
      }
      catch(Error){
            console.log("error in matching dimensions")
      }

    }
    onBeforeUnmount(()=>{
      const stream = videoEl.value.srcObject;
        const tracks = stream.getTracks()

        tracks.forEach((track) => {
          track.stop();
        });

        videoEl.srcObject = null;
    })
    onMounted(() => {
      /**
       * @function
       * @description load the trained model
       */
      const initModel = async () => {
        await faceAPI.nets.ssdMobilenetv1.loadFromUri(initParams.modelUri)
        await faceAPI.nets.faceLandmark68Net.loadFromUri(initParams.modelUri)
        await faceAPI.nets.faceRecognitionNet.loadFromUri(initParams.modelUri)
      }
      /**
       * startup webcam
       * @function
       */
      const startStream = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia(constraints)
          videoEl.value.srcObject = stream
        } catch (error) {
          console.error(error.message)
        }
      }
        initModel()
        startStream()
    })
    return {
      videoEl,
      canvasEl,
      runModel
    }
  }
}
</script>

<style lang="scss" scoped>
.display{
  width: 100%;
  height: 100vh;
  position: relative;
  video {
    position: absolute;
    object-fit: cover;
    width: 100%;
    height: 50vh;
  }
  canvas {
    position: absolute;
    z-index: 10;
    width: 100%;
    height: 50%;
  }
  .board{
    font-size: 30px;
    list-style: none;
    background-color: rgba(255, 255, 255, 0.65);
    border-radius: 10px;
    left: 10px;
    padding: 15px;
    position: absolute;
    top: 10px;
    z-index: 20;
  }
}
</style>