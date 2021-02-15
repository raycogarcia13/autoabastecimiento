<template>
  <div>
        <v-app-bar color="white" elevation="0" class="text-h4 mb-5">
          <v-row>
            <v-col cols="8">
                Cumplimiento: {{tipo}}
            </v-col>
            <v-col cols="4">
              <v-combobox
                  v-model="tipo"
                  :items="items"
                  item-text="nombre"
                  item-value="_id"
                  label="Tipos de productos"
                  dense
                  :disabled="loading"
                  @change="loadData"
                ></v-combobox>
            </v-col>
          </v-row>
        </v-app-bar>
        <v-data-table v-if="data.length"
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
            <td class="text-xs-right">{{sumHabitantes}}</td>
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
        tipo:'',
        loading:false,
        data: [],
        filtered:[],
        items:[],
        headers:[
            {
                text: 'Consejos Populares',
                align: 'start',
                sortable: false,
                value: 'consejo',
            },
            {
                text: 'Habitantes',
                value: 'habitantes',
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
        loadTipos(){
          let uri = '/api/get_tipos';
          this.$axios.get(uri).then(res=>{
            this.items = res.data.data;
          })
        },
        loadData(){
           let uri = '/api/query/cumplimiento/'+this.tipo;
           this.data = [];
           this.loading = true;
           this.$axios.get(uri).then(res=>{
               this.data = res.data.data;
               this.loading = false
           })     
        },
        getFiltered(e){
          this.filtered = e;
        }
    },
    mounted() {
      this.loadTipos();
    },
  }
</script>