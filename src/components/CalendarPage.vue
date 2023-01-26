<template>
    <v-row class="fill-height calendar">
        <v-col class="calendar-body">
            <v-sheet height="64" class="bg-grey calendar-hd">
                <v-toolbar flat>
                    <v-btn outlined color="grey darken-2" class="mr-4" @click="dialog=true">
                        New
                    </v-btn>
                    <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
                        Today
                    </v-btn>
                    <v-btn fab text small color="grey darken-2" @click="prev">
                        <v-icon small>
                            mdi-chevron-left
                        </v-icon>
                    </v-btn>
                    <v-btn fab text small color="grey darken-2" @click="next" class="mr-4">
                        <v-icon small>
                            mdi-chevron-right
                        </v-icon>
                    </v-btn>
                    <v-toolbar-title v-if="$refs.calendar">
                        {{ $refs.calendar.title }}
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-menu bottom right>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                                <span>{{ typeToLabel[type] }}</span>
                                <v-icon right>
                                    mdi-menu-down
                                </v-icon>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item @click="type = 'day'">
                                <v-list-item-title>Day</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="type = 'week'">
                                <v-list-item-title>Week</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="type = 'month'">
                                <v-list-item-title>Month</v-list-item-title>
                            </v-list-item>
                            <!-- <v-list-item @click="type = '4day'">
                                <v-list-item-title>4 days</v-list-item-title>
                            </v-list-item> -->
                        </v-list>
                    </v-menu>
                </v-toolbar>
            </v-sheet>

            <!-- Add event dialog -->
            <v-dialog v-model="dialog" max-width="500">
                <v-card>
                    <v-container>
                        <v-form @submit.prevent="addEvent">
                            <v-text-field v-model="name" type="text" label="Event Name(required)"></v-text-field>
                            <v-select v-model="selectedEventType" :items="eventType" label="Select Event Type(required)"></v-select>
                            <v-checkbox v-model="timed" label="All Day"></v-checkbox>
                            <v-text-field v-model="start" type="date" label="Start(required)"
                                v-if="timed==true"></v-text-field>
                            <v-text-field v-model="end" type="date" label="End"
                                v-if="timed==true"></v-text-field>
                            
                            <v-text-field v-model="start" type="datetime-local" label="Start(required)"
                                v-if="timed==false"></v-text-field>
                            <v-text-field v-model="end" type="datetime-local" label="End"
                                v-if="timed==false"></v-text-field>
                            <v-text-field v-model="location" type="text" label="Location"></v-text-field>
                            <v-text-field v-model="details" type="text" label="Details"></v-text-field>
                            <v-text-field v-model="color" type="color" label="Color(click to open color menu)"></v-text-field>
                            <v-btn type="submit" color="grey darken-2" class="mr-4" @click.stop="dialog=false">SUBMIT</v-btn>
                        </v-form>
                    </v-container>
                </v-card>

            </v-dialog>

            <v-sheet class="calendar-content">
                <v-calendar ref="calendar" v-model="focus" color="primary" :events="events" :event-color="getEventColor"
                    :type="type" @click:event="showEvent" @click:more="viewDay" @click:date="viewDay"
                    @change="updateRange">
                    <template v-slot:day-body="{ date, week }">
                        <div class="v-current-time" :class="{ first: date === week[0].date }" :style="{ top: nowY }"  v-if="type=='week'||type=='day'"></div>
                    </template>
                </v-calendar>
                <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x >
                    <v-card color="grey lighten-4" min-width="350px" flat  class="edit-mode">
                        <v-toolbar :color="selectedEvent.color" dark>
                            <v-btn icon v-if="selectedEvent.selectedEventType == 'Todo' && currentlyEditing !== selectedEvent.id && selectedEvent.checked==false " @click="toggleTodo(selectedEvent)">
                                <v-icon >mdi-radiobox-blank</v-icon>
                                
                            </v-btn>
                            <v-btn icon  v-if="selectedEvent.selectedEventType == 'Todo' && currentlyEditing !== selectedEvent.id && selectedEvent.checked == true" @click="toggleTodo(selectedEvent)">
                                <v-icon>mdi-radiobox-marked</v-icon>
                            </v-btn>
                            <form v-if="currentlyEditing!==selectedEvent.id">
                                <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                                
                            </form>
                            <form v-else>
                                <v-text-field v-model="selectedEvent.name"></v-text-field>
                            </form>
                            <v-spacer></v-spacer>
                            <v-btn icon v-if="currentlyEditing !== selectedEvent.id" @click.prevent="editEvent(selectedEvent)">
                                <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                        </v-toolbar>
                        
                        <v-card-text class="input-area">
                            <form v-if="currentlyEditing !== selectedEvent.id">
                                <h4 class="details">Location: {{selectedEvent.location}}</h4>
                                <h4 class="details" v-if="selectedEvent.selectedEventType == 'Calendar'">From: {{ selectedEvent.start }} to {{ selectedEvent.end }}</h4>
                                <h4 class="details" v-if="selectedEvent.selectedEventType == 'Todo'">Due: {{selectedEvent.start}}</h4>
                                <h4 class="details">Details: {{selectedEvent.details}}</h4> 
                                <h4 class="details">Type: {{selectedEvent.selectedEventType}}</h4> 

                            </form>

                            <form v-else>
                                
                                <v-text-field v-model="selectedEvent.location" label="Location"></v-text-field>

                                <v-checkbox v-model="selectedEvent.timed" label="All Day"></v-checkbox>
                                <!-- Calendar date setting -->
                                <v-text-field v-model="selectedEvent.start" type="date" label="Start(required)" v-if="selectedEvent.timed==true && selectedEvent.selectedEventType=='Calendar'"></v-text-field>
                                <v-text-field v-model="selectedEvent.end" type="date" label="End(required)" v-if="selectedEvent.timed == true && selectedEvent.selectedEventType == 'Calendar'"></v-text-field>
                                <v-text-field v-model="selectedEvent.start" type="datetime-local" label="Start(required)" v-if="selectedEvent.timed==false && selectedEvent.selectedEventType=='Calendar'"></v-text-field>
                                <v-text-field v-model="selectedEvent.end" type="datetime-local" label="End(required)" v-if="selectedEvent.timed==false && selectedEvent.selectedEventType=='Calendar'"></v-text-field>
                                <!-- Todo date setting -->
                                <v-text-field v-model="selectedEvent.start" type="date" label="Due(required)"
                                    v-if="selectedEvent.timed==true && selectedEvent.selectedEventType=='Todo'"></v-text-field>
                                <v-text-field v-model="selectedEvent.start" type="datetime-local" label="Due(required)"
                                    v-if="selectedEvent.timed==false && selectedEvent.selectedEventType=='Todo'"></v-text-field>
                                
                                <v-text-field v-model="selectedEvent.details" type="text" label="Details"></v-text-field>
                                <v-select v-model="selectedEvent.selectedEventType" :items="eventType" label="Select Event Type(required)"></v-select>
                                <v-text-field v-model="selectedEvent.color" type="color" label="Color(click to open color menu)"></v-text-field>

                            </form>
                        </v-card-text>

                        <v-card-actions class="input-area">
                            <v-btn text @click="deleteEvent(selectedEvent.id)" plain class="ma-1" color="error">
                                Delete
                            </v-btn>
                            <v-btn text @click.prevent="updateEvent(selectedEvent)" v-show="currentlyEditing == selectedEvent.id">
                                Save
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-menu>
            </v-sheet>
        </v-col>
    </v-row>
    
</template>


<script>
    import { db } from '@/main';
    export default {
        data: () => ({
            today: new Date().toISOString().substring(0, 10),
            focus: new Date().toISOString().substring(0, 10),
            type: "month",
            typeToLabel: {
                month: "Month",
                week: "Week",
                day: "Day",
                // "4day":"4 Days"
            },
            name: null,
            location:null,
            details: null,
            selectedEventType: null,
            eventType:['Calendar','Todo'],
            start: null,
            end: null,
            color: "#1976D2",
            checked: false,
            timed: false,
            
            currentlyEditing: null,
            selectedEvent: {},
            selectedElement: null,
            selectedOpen: false,
            events: [],
            dialog: false,

        }),
        mounted() {
            this.getEvents()

        },
        methods: {
            async getEvents() {
                let snapshot = await db.collection('calEvent').get();
                let events = [];
                snapshot.forEach(doc => {
                    // console.log(doc)

                    let appData = doc.data()
                    appData.id = doc.id
                    events.push(appData)

                })
                this.events = events
            },
            async addEvent() {
                if (this.name && this.start && this.selectedEventType) {
                    await db.collection('calEvent').add({
                        name: this.name,
                        details: this.details,
                        start: this.start,
                        end: this.end,
                        color: this.color,
                        location: this.location,
                        selectedEventType: this.selectedEventType,
                        checked: this.checked,
                        timed:this.timed
                    })
                    this.getEvents()
                    this.name = ""
                    this.details = ""
                    this.start = ""
                    this.end = ""
                    this.color = ""
                    this.location = ""
                    this.selectedEventType = ""
                    this.checked = false
                    this.timed=false
                } else { 
                    alert('Name , start date and event type are required')
                }
            },
            async updateEvent(event) {
                await db.collection('calEvent').doc(this.currentlyEditing).update({
                    name: event.name,
                    details: event.details,
                    start: event.start,
                    end: event.end,
                    color: event.color,
                    location: event.location,
                    selectedEventType: event.selectedEventType,
                    timed:event.timed
                })
                this.selectedOpen = false;
                this.currentlyEditing = null;
            },
            async deleteEvent(event) {
                await db.collection('calEvent').doc(event).delete();

                this.selectedOpen = false;
                this.getEvents();
            },
            async toggleTodo(event) {
                event.checked = !event.checked
                await db.collection('calEvent').doc(event).update({
                    checked: event.checked
                })
                alert('!')
            },
            viewDay({ date }) {
                this.focus = date
                this.type = 'day'
            },
            getEventColor(event) {
                return event.color
            },
            setToday() {
                this.focus = ''
            },
            prev() {
                this.$refs.calendar.prev()
            },
            next() {
                this.$refs.calendar.next()
            },
            showEvent({ nativeEvent, event }) {
                const open = () => {
                    this.selectedEvent = event
                    this.selectedElement = nativeEvent.target
                    requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
                }

                if (this.selectedOpen) {
                    this.selectedOpen = false
                    requestAnimationFrame(() => requestAnimationFrame(() => open()))
                } else {
                    open()
                }

                nativeEvent.stopPropagation()
            },
            editEvent(event) {
                this.currentlyEditing=event.id
            },
            updateRange({ start, end }) {
                const events = []

                const min = new Date(`${start.date}T00:00:00`)
                const max = new Date(`${end.date}T23:59:59`)
                const days = (max.getTime() - min.getTime()) / 86400000
                const eventCount = this.rnd(days, days + 20)

                for (let i = 0; i < eventCount; i++) {
                    const allDay = this.rnd(0, 3) === 0
                    const firstTimestamp = this.rnd(min.getTime(), max.getTime())
                    const first = new Date(firstTimestamp - (firstTimestamp % 900000))
                    const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
                    const second = new Date(first.getTime() + secondTimestamp)

                    events.push({
                        name: this.names[this.rnd(0, this.names.length - 1)],
                        start: first,
                        end: second,
                        color: this.colors[this.rnd(0, this.colors.length - 1)],
                        timed: !allDay,
                    })
                }

                this.events = events
            },
            rnd(a, b) {
                return Math.floor((b - a + 1) * Math.random()) + a
            },
        }
    }
</script>

<style scoped>
    .fill-height{
        /* margin: 3%; */
        /* max-height: 100%; */
        height: auto;
    }
    .calendar-body{
        width: 69.271vw;
        min-width: 700px;
        /* height: 71.9444vh; */
    }
    .details {
        font-style: normal;
    }
    .calendar {
        flex: 0;
    }
    .calendar-content {
        height: 91.8%;
    }

    .edit-mode{
        max-height: 350px;
    }
    .input-area {
        background-color: #fff;
    }
    .bg-grey {
        background: #F6F6F6 !important;
    }

    .calendar-hd{
        height: 8.6%;
    }
</style>