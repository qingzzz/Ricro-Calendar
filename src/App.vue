<template>
  <v-app>
    <v-main>
      <CalendarPage />
      <ToDo/>
    </v-main>
  </v-app>
</template>

<script>
import CalendarPage from './components/CalendarPage'
import ToDo from './components/ToDo'


export default {
  name: 'App',

  components: {
    CalendarPage,
    ToDo,
  },

  data: () => ({
    //
  }),
}
</script>
