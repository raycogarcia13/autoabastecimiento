<template>
<v-responsive>
  <v-row>
    <v-col cols="" class="text-center">
     <p>Captador de producciones mensuales</p>
    </v-col>

     <v-col cols="3" class="text-right">
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="fecha"
          transition="scale-transition"
          offset-y
          left
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="fecha"
              prepend-icon="mdi-calendar"
              readonly
              dense
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="fecha"
            no-title
            scrollable
            type="month"
            :max="maxDate"
          >
            <v-spacer></v-spacer>
            <v-btn
              text
              color="primary"
              @click="menu = false"
            >
              Cancelar
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="loadData()"
            >
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
     </v-col>
        <!-- &#8220;{{new Date().toLocaleString() }}&#8221; -->
  </v-row>
  
<v-expand-transition>
 <v-row v-if="cargando"
      style="height:50vh"
      align="center"
      justify="center"
    >
      <v-progress-circular
        indeterminate
        color="green"
        :size="100"
      ></v-progress-circular>
    </v-row>
</v-expand-transition>
    <v-row v-if="!cargando">
      <v-col cols="12">
        <v-data-table
            :headers="headers"
            :items="datas"
            :search="search"
            :disable-pagination="true"
        >
         <template v-slot:top>
            <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Buscar"
                single-line
                hide-details
            ></v-text-field>
        </template>
        <template v-slot:item.producto="{ item }">
          <span v-if="item.id">
            {{ item.producto }}
          </span>
          <span v-else>
            <b>{{ item.producto }}</b>
          </span>
        </template>
        <template v-slot:item.siembra="props">
            <v-edit-dialog v-if="props.item.id"
            :return-value.sync="props.item.siembra"
            large
            persistent
            @save="save(props.item)"
            @close="close"
            >
            <div>{{ props.item.siembra }}</div>
            <template v-slot:input>
               <v-form
                  ref="form"
                  v-model="valid"
                  lazy-validation
                  @submit.prevent=""
                >
                  <div class="mt-4 title">
                  Editar producción de {{props.item.producto}}
                  </div>
                  <v-text-field
                  v-model="props.item.siembra"
                  :rules="[max25chars]"
                  label="Cantidad Vendida"
                  single-line
                  counter
                  autofocus
                  v-on:keyup.enter="save(props.item)"
                  ></v-text-field>
               </v-form>
            </template>
            </v-edit-dialog>
            <span v-else><b>{{props.item.siembra}}</b></span>
        </template>
        <template v-slot:item.ratificado="props">
            <v-edit-dialog v-if="props.item.id"
            :return-value.sync="props.item.ratificado"
            large
            persistent
            @save="save(props.item)"
            @close="close"
            >
            <div>{{ props.item.ratificado }}</div>
            <template v-slot:input>
               <v-form
                  ref="form"
                  v-model="valid"
                  lazy-validation
                  @submit.prevent=""
                >
                  <div class="mt-4 title">
                  Editar ratificado de {{props.item.producto}}
                  </div>
                  <v-text-field
                  v-model="props.item.ratificado"
                  :rules="[max25chars]"
                  label="Cantidad Vendida"
                  single-line
                  counter
                  autofocus
                  v-on:keyup.enter="save(props.item)"
                  ></v-text-field>
               </v-form>
            </template>
            </v-edit-dialog>
            <span v-else><b>{{props.item.ratificado}}</b></span>
        </template>
        </v-data-table>
      </v-col>
    </v-row>

     <v-snackbar
        v-model="snack"
        :timeout="3000"
        :color="snackColor"
        shaped
        >
        {{ snackText }}

        <template v-slot:action="{ attrs }">
            <v-btn
            v-bind="attrs"
            text
            @click="snack = false"
            >
            Cerrar
            </v-btn>
        </template>
        </v-snackbar>
</v-responsive>
</template>

<script>
import moment from 'moment'
export default {
  data() {
    return {
       items: [],
       cargando:false,
       menu:false,
       fecha: moment().toISOString().substr(0,7),
       maxDate: moment().toISOString().substr(0,7),
      snack: false,
      valid:true,
      search:'',
      snackColor: '',
      snackText: '',
      max25chars: v => !isNaN(v) || 'Debe ser un valor númerico!',
      headers: [
        {
          text: 'Cultivo',
          align: 'start',
          value: 'producto',
        },
        { text: 'Según siembra', value: 'siembra' },
        { text: 'Según ratificado', value: 'ratificado' },
        { text: 'Producción', value: 'estimado' },
      ],

    }
  },
  computed: {
    datas(){
      let data =[];
      this.items.forEach((item)=>{
          data.push({
            producto:'Total '+item.nombre,
            siembra:item.producciones.reduce((ac,curr)=>ac+=parseFloat(curr.siembra),0),
            ratificado:item.producciones.reduce((ac,curr)=>ac+=parseFloat(curr.ratificado),0),
            estimado:0,
          });
          item.producciones.forEach(async(prod)=>{
              prod['estimado'] = 0;
              data.push(prod);
          })
      })
      return data;
    }
  },
  methods: {
    loadData()
    {
      let f = this.fecha.split('-');
      this.$refs.menu.save(this.fecha);
      this.cargando = true;
      this.items = [];
      let uri = '/api/produccion/'+f[0]+'/'+f[1];
      this.$axios.get(uri).then(res=>{
        if(res.data.status=='success')
        {
         this.items = res.data.data
         this.cargando = false
        }
        else{
           this.snack = true
            this.snackColor = 'danger'
            this.snackText = res.data.msg;
        }
       })
    },
    async change(){
      this.loadData();
    },
     save (item) {
        if(this.$refs.form.validate())
        {
          console.log(item);
          let f = this.fecha.split('-');
          item['mes'] = f[1];
          item['anno'] = f[0];
          let uri = '/api/produccion';
          this.$axios.put(uri,item).then(res=>{
            this.snack = true
            this.snackColor = 'success'
            this.snackText = 'Información guardada correctamente';
          })
        }
        else
        {
            this.$refs.form.reset()
            this.$refs.form.resetValidation()
            this.snack = true
            this.snackColor = 'danger'
            this.snackText = 'Tiene errores en le formulario';
        }

      },
      cancel () {
        this.snack = true
        this.snackColor = 'error'
        this.snackText = 'Canceled'
      },
      open () {
        this.snack = true
        this.snackColor = 'info'
        this.snackText = 'Dialog opened'
      },
      close () {
        console.log('Dialog closed')
      },
  },
  mounted() {
    this.loadData();
  },
}
</script>

