import Vue from "vue";
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        alert_sound: '../assets/sounds/pinwheel.mp3',
        alert_type: 'Both',
        alert_message: 'Play Both'
    },
    mutations: {
        change_sound(state, alert_sound) {
            state.alert_sound = alert_sound
        },
        change_message(state, alert_message) {
            state.alert_message = alert_message
        },
        change_type(state, alert_type) {
            state.alert_type = alert_type
        }
    },
    actions:{
        set_sound({commit},alert_sound){
            commit('change_sound', alert_sound)
        },
        set_type({commit},alert_type){
            commit('change_type', alert_type)
        },
        set_message({commit},alert_message){
            commit('change_message', alert_message)
        },
    },
    getters:{
        getAlertMessage(state){
            return state.alert_message
        },
        getAlertType(state){
            return state.alert_type
        },
        getAlertSound(state){
            return state.alert_sound
        }
    }
})