<template>
  <div>
        <v-app-bar color="white" elevation="0" class="text-h4 mb-5">
          <v-row>
            <v-col cols="8">
                Cumplimiento: {{(tipo)?tipo.nombre:''}}
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
            <td class="text-xs-right">{{sumPlanAc}}</td>
            <td class="text-xs-right">{{sumRealAc}}</td>
            <td class="text-xs-right">{{sumPercAc}}</td>
            <td class="text-xs-right">{{sumPlanDia}}</td>
            <td class="text-xs-right">{{sumRealDia}}</td>
            <td class="text-xs-right">{{sumPercDia}}</td>
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
        tipo:null,
        loading:false,
        data: [],
        filtered:[],
        items:[],
        headers:[
            {
                text: 'Consejos Populares',
                align: 'start',
                value: 'consejo',
            },
            { text: 'Plan Acum (t)',value: 'plan_ac'},
            { text: 'Real Acum (t)',value: 'real_ac'},
            { text: '% Acom (%)',value: 'perc_ac'},
            { text: 'Plan dia (t)',value: 'plan_dia'},
            { text: 'Real dia (t)',value: 'real_dia'},
            { text: '% dia (%)',value: 'perc_dia'}
        ]
      }
    },
    computed: {
      sumPlanAc(){
        let suma = 0; this.data.forEach(it=>{suma+=parseFloat(it.plan_ac);})
        return suma;
      },
      sumRealAc(){
        let suma = 0; this.data.forEach(it=>{suma+=parseFloat(it.real_ac);})
        return suma.toFixed(2);
      },
      sumPercAc(){
        let suma =(this.sumRealAc/ this.sumPlanAc)*100;
        return suma.toFixed(2)+'%';
      },
      sumPlanDia(){
        let suma = 0; this.data.forEach(it=>{suma+=parseFloat(it.plan_dia);})
        return suma.toFixed(2);
      },
      sumRealDia(){
        let suma = 0; this.data.forEach(it=>{suma+=parseFloat(it.real_dia);})
        return suma.toFixed(2);
      },
      sumPercDia(){
        let suma =(this.sumRealDia/ this.sumPlanDia)*100;
        return suma.toFixed(2)+'%';
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
           let uri = '/api/query/cumplimiento/'+this.tipo._id;
           this.data = [];
           if(this.tipo)
           {
             this.loading = true;
             this.$axios.get(uri).then(res=>{
                 this.data = res.data.data;
                 this.loading = false
             })     
           }

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