<template>
   <v-card
    outlined
>
    <v-list-item three-line>
    <v-list-item-content>
        <div class="overline mb-4">
        {{title}}
        </div>
        <v-list-item-title class="headline mb-1">
        {{value}}
        </v-list-item-title>
        <v-list-item-subtitle>{{descr}}</v-list-item-subtitle>
    </v-list-item-content>

    <v-list-item-avatar
        tile
        size="80"
    >
    <v-icon size="80" :color="color">{{icon}}</v-icon>
    </v-list-item-avatar>
    </v-list-item>

</v-card>
</template>

<script>
export default {
    props:['title','value','icon','descr','color']
}
</script>