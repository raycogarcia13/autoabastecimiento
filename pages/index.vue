<template>
  <v-app>
    <v-responsive>
      <v-row>
        <v-col cols="12" md="6">
          <v-row>
            <v-col>
              <v-card>
                <v-card-title>Cumplimiento del día</v-card-title>
                <v-card-text class="text-center">
                    <v-progress-circular
                      :size="100"
                      :width="15"
                      :value="36"
                      color="teal"
                    >
                     36
                    </v-progress-circular>
                </v-card-text>
                <v-card-actions>
                  <b>Plan:&nbsp;</b> 58
                  <v-spacer></v-spacer>
                  <b>Real:&nbsp;</b> 58
                </v-card-actions>
              </v-card>
            </v-col>
            <v-col>
              <v-card>
                <v-card-title>Cumplimiento del mes</v-card-title>
                <v-card-text class="text-center">
                    <v-progress-circular
                      :size="100"
                      :width="15"
                      :value="valueMes.percent"
                      color="red"
                    >
                     {{valueMes.percent}}
                    </v-progress-circular>
                </v-card-text>
                <v-card-actions>
                  <b>Plan:&nbsp;</b> {{valueMes.plan}} t
                  <v-spacer></v-spacer>
                  <b>Real:&nbsp;</b> {{valueMes.real}} t
              </v-card-actions>
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
        </v-col>
        <v-col cols="12" md="6">
            <v-row>
              <v-col>
                <Cuadro title="Hoy" icon="mdi-calendar" color="success" descr="Comercializado hoy" value="78 kg"/>
              </v-col>
              <v-col>
                <Cuadro title="Mes" icon="mdi-calendar-month" color="primary" descr="Comercializado hoy" value="78 kg"/>
              </v-col>
              <v-col>
                <Cuadro title="Hoy" icon="mdi-cogs" color="red" descr="Comercializado hoy" value="78 kg"/>
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
      fecha: moment().toISOString().substr(0,10),
      headers:[
        { text: 'Punto', align: 'start', value: 'nombre'},
        { text: 'Consejo', align: 'start', value: 'consejo_id.nombre'},
        { text: 'Base', align: 'start', value: 'basep_id.nombre'},
      ]
    }
  },
  computed: {
    labels(){
      let labl=[];
      if(!this.anno)
      {
        for(let i=1;i<cantDaysMonth(8,2021)+1;i++)
          labl.push(i);
      }

      return labl;
    },

    value(){
       let val=[];
      if(!this.anno)
      {
        for(let i=1;i<Math.ceil(Math.random() * (31 - 1) + 1);i++)
          val.push( Math.ceil(Math.random() * (1000 - 1) + 1));
      }

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
    
    loadPlanReal()
    {
      let uri = '/api/home/plan_real';
      this.$axios.post(uri,{limit:'mes'}).then(res=>{
        this.plan_real_mes = res.data;
        console.log(this.plan_real_mes);
      })
    },
    loadNoComer(){
      let uri = '/api/nocaptan';
      this.$axios.post(uri,{fecha:this.fecha}).then(res=>{
        this.items = res.data.all;
        console.log(this.items);
      })
    },
    loadData()
    {
      this.loadPlanReal();
      this.loadNoComer();
    }
  },
  mounted() {
    this.loadData();
  },
}
</script>
