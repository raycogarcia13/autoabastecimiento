<template>
   <v-card
    outlined
    >
    <v-list-item three-line>
    <v-list-item-content>
        <v-list-item-subtitle class="text-center black--text">
            {{descr}}
        <v-list-item-avatar tile size="20">
    <v-icon size="20" :color="color">{{icon}}</v-icon>
    </v-list-item-avatar>
        </v-list-item-subtitle> 
        <v-simple-table dense>
            <template v-slot:default>
            <thead>
                <tr>
                <th class="text-left">
                    Tipo
                </th>
                <th class="text-left">
                    Cant
                </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in values" :key="item.id">
                    <td v-text="item.tipo"></td>
                    <td v-text="data(item)"></td>
                </tr>
            </tbody>
            </template>
        </v-simple-table>
    </v-list-item-content>
    </v-list-item>

</v-card>
</template>

<script>
export default {
    props:['descr','values','icon','color'],
    methods: {
        data(item)
        {
            let value = (item.total)?Math.round(item.total/2.1739):0;
            return value+' kg';
        }
    },
}
</script>