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
              <v-card-text>
                <v-list three-line>
                    <template v-for="(item, index) in items">
                      <v-divider
                        v-if="item.divider"
                        :key="index"
                        :inset="item.inset"
                      ></v-divider>

                      <v-list-item
                        v-else
                        :key="item.title"
                      >
                        <v-list-item-content>
                          <v-list-item-title v-html="item.title"></v-list-item-title>
                          <v-list-item-subtitle v-html="item.subtitle"></v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                  </v-list>
              </v-card-text>
            </v-card>

        </v-col>
      </v-row>
    </v-responsive>
  </v-app>
</template>

<script>
import {cantDaysMonth} from "@/api/libs/dates"
export default {
  data() {
    return {
       anno:false,
       items: [
        {
          title: 'Brunch this weekend?',
          subtitle: `<span class="text--primary">Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?`,
        },
        { divider: true, inset: true },
        {
          title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>',
          subtitle: `<span class="text--primary">to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend.`,
        },
        { divider: true, inset: true },
        {
          title: 'Oui oui',
          subtitle: '<span class="text--primary">Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?',
        },
        { divider: true, inset: true },
        {
          title: 'Birthday gift',
          subtitle: '<span class="text--primary">Trevor Hansen</span> &mdash; Have any ideas about what we should get Heidi for her birthday?',
        },
        { divider: true, inset: true },
        {
          title: 'Recipe to try',
          subtitle: '<span class="text--primary">Britta Holt</span> &mdash; We should eat this: Grate, Squash, Corn, and tomatillo Tacos.',
        },
      ],
      plan_real_mes:null
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
    loadData()
    {
      this.loadPlanReal();
    }
  },
  mounted() {
    this.loadData();
  },
}
</script>
