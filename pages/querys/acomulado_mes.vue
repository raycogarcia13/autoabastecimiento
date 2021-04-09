<template>
  <div>
        <v-app-bar color="white" elevation="0" class="text-h4 mb-5">
            Acumulado del mes (lbs/per capita)
            <v-spacer></v-spacer>
            <b>Fecha:&nbsp;</b>{{fecha.getMonth()+1}}/{{fecha.getFullYear()}}
        </v-app-bar>
        <v-data-table
        :headers="headers"
        :items="data"
        class="elevation-1"
        :loading="loading"
        :search="search"
        @current-items="getFiltered"
        >
         <template v-slot:top>
        <v-text-field
          v-model="search"
          label="Buscar"
          class="mx-4"
        ></v-text-field>
        </template>

        <template slot="body.append">
            <tr class="font-weight-black">
            <td>Totales</td>
            <td class="text-xs-right">{{sumViandas}}</td>
            <td class="text-xs-right">{{sumHortalizas}}</td>
            <td class="text-xs-right">{{sumFrutales}}</td>
            <td class="text-xs-right">{{sumGranos}}</td>
            <td class="text-xs-right">{{sumProteinas}}</td>
            </tr>
        </template>

        </v-data-table>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        search: '',
        calories: '',
        loading:false,
        fecha:new Date(),
        data: [],
        filtered:[],
        headers:[
            {
                text: 'Consejos Populares',
                align: 'start',
                sortable: false,
                value: 'nombre',
            },
            { text: 'Viandas (15)', value: 'Viandas' },
            { text: 'Hortalizas (10)', value: 'Hortalizas' },
            { text: 'Granos (2)', value: 'Frutales' },
            { text: 'Frutales (3)', value: 'Granos' },
            { text: 'Proteína (5)', value: 'Proteinas' }
        ]
      }
    },
    computed: {
      sumHabitantes(){
        let suma = 0; this.data.forEach(it=>{suma+=parseFloat(it.habitantes);})
        return suma;
      },
      sumViandas(){
        let suma = 0; this.data.forEach(it=>{suma+=parseFloat(it.Viandas);})
        return suma.toFixed(2);
      },
      sumHortalizas(){
        let suma = 0; this.data.forEach(it=>{suma+=parseFloat(it.Hortalizas);})
        return suma.toFixed(2);
      },
      sumFrutales(){
        let suma = 0; this.data.forEach(it=>{suma+=parseFloat(it.Frutales);})
        return suma.toFixed(2);
      },
      sumGranos(){
        let suma = 0; this.data.forEach(it=>{suma+=parseFloat(it.Granos);})
        return suma.toFixed(2);
      },
      sumProteinas(){
        let suma = 0; this.data.forEach(it=>{suma+=parseFloat(it.Proteinas);})
        return suma.toFixed(2);
      }
    },
    methods: {
        loadData(){
           let uri = '/api/query/acomulado_mes';
           this.data = [];
           this.loading = true;
           this.$axios.get(uri).then(res=>{
               this.data = res.data.data;
               this.fecha = new Date(res.data.fecha)
               this.loading = false
           })     
        },
        getFiltered(e){
          this.filtered = e;
        }
    },
    mounted() {
        this.loadData();
    },
  }
</script>