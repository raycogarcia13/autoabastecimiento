<template>
  <v-app>
    <v-responsive>
      <v-row>
        <v-col cols="12" md="6">
          <v-row>
            <v-col>
                <v-card>
                  <v-card-subtitle class="black--text">Cumplimiento libras per cápita Día</v-card-subtitle>
                  <v-card-text>
                    <v-row class="justify-center">
                      <v-col class="text-center green--text" v-for="item in librasD" :key="item.id">
                          <v-progress-circular
                            :size="70"
                            :width="15"
                            :value="(item.total/item.demanda*100).toFixed(2)"
                            :color="item.color"
                          >
                          {{(item.total/item.demanda*100).toFixed(1)}}%
                          </v-progress-circular>
                          {{item.tipo}}
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-card>
                <v-card-title>
                  Tendencia
                  <v-spacer></v-spacer>
                    <v-switch
                      v-model="anno"
                      :label="`${(anno)?'Año':'Mes'}`"
                      @change="loadTendencia()"
                    ></v-switch>
                </v-card-title>
                <v-card-subtitle></v-card-subtitle>
                <v-card-text>
                  <v-sparkline
                      :labels="labels"
                      :value="value"
                      line-width="2"
                      padding="16"
                      :smooth="5"
                    ></v-sparkline>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

           <v-divider class="mt-5"></v-divider>

            <v-card>
              <v-card-title>Puntos que no han comercializado</v-card-title>
              <v-card-title>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
              </v-card-title>
              <v-data-table
                :headers="headers"
                :items="items"
                :search="search"
                :items-per-page="5"
              ></v-data-table>
            </v-card>
        </v-col>
        <v-col cols="12" md="6">
            <v-row>
              <v-col>
                <v-card>
                  <v-card-subtitle class="black--text">Cumplimiento libras per cápita Mes</v-card-subtitle>
                  <v-card-text>
                    <v-row class="justify-center">
                       <v-col class="text-center green--text" v-for="item in librasM" :key="item.id">
                          <v-progress-circular
                            :size="70"
                            :width="15"
                            :value="(item.total/item.demanda*100).toFixed(2)"
                            :color="item.color"
                          >
                          {{(item.total/item.demanda*100).toFixed(1)}}%
                          </v-progress-circular>
                          {{item.tipo}}
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <CuadroTable icon="mdi-calendar" color="success" descr="Comercializado hoy" :values="librasD"/>
              </v-col>
              <v-col cols="12" md="6">
                <CuadroTable icon="mdi-calendar-month" color="primary" descr="Comercializado mes" :values="librasM"/>
              </v-col>
            </v-row>

             <v-divider class="mt-5"></v-divider>

            <v-card>
              <v-card-title>Últimos accesos</v-card-title>
              <v-card-title>
                <v-text-field
                  v-model="search2"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
              </v-card-title>
              <v-data-table
                :headers="headersAcces"
                :items="accesos"
                :search="search2"
                :items-per-page="5"
              ></v-data-table>
            </v-card>
        </v-col>
      </v-row>
    </v-responsive>
  </v-app>
</template>

<script>
import {cantDaysMonth} from "@/api/libs/dates"
import moment from 'moment'
export default {
  data() {
    return {
       anno:false,
       items: [],
      plan_real_mes:null,
      search:"",
      search2:"",
      fecha: moment().toISOString().substr(0,10),
      headers:[
        { text: 'Punto', align: 'start', value: 'nombre'},
        { text: 'Consejo', align: 'start', value: 'consejo_id.nombre'},
        { text: 'Base', align: 'start', value: 'basep_id.nombre'},
      ],
      headersAcces:[
        { text: 'Usuario', align: 'start', value: '_id'},
        { text: 'Fecha', align: 'start', value: 'fecha[0]'},
      ],
      accesos:[],
      librasM:[],
      librasD:[],
      tendencia:[]
    }
  },
  computed: {
    labels(){
     let val=[];
        this.tendencia.forEach(item=>{
          val.push(item.label);
        })

      return val;
    },

    value(){
       let val=[];
        this.tendencia.forEach(item=>{
          val.push(item.value);
        })
      return val;
    },
    valueMes()
    {
      let plan= 0;
      let real = 0;
      let percent = 0;
      if(this.plan_real_mes)
      {
        let l =this.plan_real_mes.plan;
        plan+= parseFloat(l.Viandas)+parseFloat(l.Hortalizas)+parseFloat(l.Frutales)+parseFloat(l.Granos)+parseFloat(l.Proteinas);
        l =this.plan_real_mes.real;
        real+= parseFloat(l.Viandas)+parseFloat(l.Hortalizas)+parseFloat(l.Frutales)+parseFloat(l.Granos)+parseFloat(l.Proteinas);
        percent = real/plan*100
      }
      return {plan:parseFloat(plan).toFixed(2),real:parseFloat(real).toFixed(2),percent:parseFloat(percent).toFixed(1)};
    }
  },
  methods: {
    
    loadLibrasMes()
    {
      let uri = '/api/home/libras/mes';
      this.$axios.get(uri).then(res=>{
        this.librasM = res.data.data;
      })
    },
    loadLibrasDay()
    {
      let uri = '/api/home/libras/day';
      this.$axios.get(uri).then(res=>{
        this.librasD = res.data.data;
      })
    },
    loadNoComer(){
      let uri = '/api/nocaptan';
      this.$axios.post(uri,{fecha:this.fecha}).then(res=>{
        this.items = res.data.all;
      })
    },
    loadAudit(){
      let uri = '/api/home/audit';
      this.$axios.get(uri,).then(res=>{
        this.accesos = res.data;
      })
    },
    loadData()
    {
      this.loadLibrasMes();
      this.loadLibrasDay();
      this.loadNoComer();
      this.loadAudit();
      this.loadTendencia();
    },
    loadTendencia()
    {
      let limit = this.anno?'year':'mes';
      let uri = '/api/home/tendencia/'+limit;
        this.$axios.get(uri,).then(res=>{
        this.tendencia = res.data.data;
      })
    }
  },
  mounted() {
    this.loadData();
  },
}
</script>
