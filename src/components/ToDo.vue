<template>
    <v-card max-width="400" class="mx-auto todo-body" color="grey lighten-5">

        <v-app-bar dark color="grey">
            <v-toolbar-title>SomeDay Todo</v-toolbar-title>
        </v-app-bar>

        <v-container>
            <v-row dense>
                <v-col cols="12">
                    <v-card color="white" class=" rounded-lg">
                        <v-card-title class="text-subtitle-2">
                            Buy Groceries
                        </v-card-title>
                    </v-card>
                </v-col>

                <v-col v-for="(item, i) in items" :key="i" cols="12">
                    <v-card :color="item.color" dark>
                        <div class="d-flex flex-no-wrap justify-space-between">
                            <div>
                                <v-card-title class="text-h5" v-text="item.title"></v-card-title>

                                <v-card-subtitle v-text="item.artist"></v-card-subtitle>

                                <v-card-actions>
                                    <v-btn v-if="item.artist === 'Ellie Goulding'" class="ml-2 mt-3" fab icon
                                        height="40px" right width="40px">
                                        <v-icon>mdi-play</v-icon>
                                    </v-btn>

                                    <v-btn v-else class="ml-2 mt-5" outlined rounded small>
                                        START RADIO
                                    </v-btn>
                                </v-card-actions>
                            </div>

                            <v-avatar class="ma-3" size="125" tile>
                                <v-img :src="item.src"></v-img>
                            </v-avatar>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script>
    // import { db } from '@/main';
    export default {
            data: () => ({
                
            })
        }
</script>

<style scoped>
.todo-body {
        margin-right: 0 !important;
        margin-left: 0 !important;
    }
</style>