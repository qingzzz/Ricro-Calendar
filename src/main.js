import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueTextareaAutoSize from 'vue-textarea-autosize'
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'

Vue.use(VueTextareaAutoSize)

Vue.config.productionTip = false

firebase.initializeApp({
  apiKey: "AIzaSyD4dRwzrl4Kv5UBhKePWyvoiYLjfRc5EE4",
  authDomain: "ricro-homepage.firebaseapp.com",
  projectId: "ricro-homepage",
  storageBucket: "ricro-homepage.appspot.com",
  messagingSenderId: "938670282645",
  appId: "1:938670282645:web:ce866f8e26716680c1489c"
})

export const db = firebase.firestore()

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
