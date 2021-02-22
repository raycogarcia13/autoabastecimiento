<template>
<v-responsive>
  <v-row>
    <v-col cols="" class="text-center">
     <p>Captador de ventas en físico diarias</p>
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
  <v-row>
    <v-col md="4">
      <v-combobox
          v-model="unidad"
          :items="items"
          item-text="nombre"
          item-value="_id"
          label="Unidad de Venta"
          dense
          :disabled="cargando"
          @change="change"
        ></v-combobox>
    </v-col>
    <v-col md="4" v-if="res">
      <v-input
          v-model="base"
          :label="base"
          dense
        ></v-input>
    </v-col>
    <v-col md="4" v-if="res">
      <v-input
          v-model="consejo"
          :label="consejo"
          dense
        ></v-input>
    </v-col>
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
    <v-row v-if="res">
     <TableProd :items="table('Viandas')" :fecha="fecha" :unidad="unidad" title="Viandas" />
     <TableProd :items="table('Hortalizas')" :fecha="fecha" :unidad="unidad" title="Hortalizas" />
     <TableProd :items="table('Granos')" :fecha="fecha" :unidad="unidad" title="Granos" />
     <TableProd :items="table('Frutales')" :fecha="fecha" :unidad="unidad" title="Frutales" />
     <TableProd :items="table('Proteinas')" :fecha="fecha" :unidad="unidad" title="Proteínas" />
    </v-row>
</v-responsive>
</template>

<script>
import moment from 'moment'
export default {
  data() {
    return {
       unidad: null,
       base:'',
       consejo:'',
       items: [],
       res:null,
       cargando:false,
       activo:{},
       menu:false,
       fecha: moment().toISOString().substr(0,10),
       maxDate: moment().toISOString().substr(0,10),
    }
  },
  computed: {
  },
  methods: {
    loadPuntosv()
    {
      this.cargando = true;
      let uri = '/api/puntos';
      this.$axios.get(uri).then(res=>{
         this.items = res.data.data
         this.cargando = false
       })
    },
    loadData()
    {
      this.$refs.menu.save(this.fecha);
      if(!this.unidad)
        return;
      this.cargando = true;
      let uri = '/api/captador';
      this.$axios.post(uri,{fecha:this.fecha,punto:this.unidad}).then(res=>{
        if(res.data.status=='success')
        {
         this.res = res.data.data
         this.cargando = false
        }
        else{
          alert(res.data.msg)
        }
       })
    },
    table(name)
    {
      let products = [];
      this.res.forEach(item => {
        if(item.tipo.nombre == name)
          products = item.productos
      });
      return products;
    },
    async change(){
      this.res = null;
      for(let i =0;i<this.items.length;i++)
        {
          let tmp = this.items[i];
          if(tmp._id == this.unidad._id){
            this.activo = tmp;
            break;
          }
        }

      this.base = this.activo.basep_id.nombre;
      this.consejo = this.activo.consejo_id.nombre;
      this.loadData();
    }
  },
  mounted() {
    this.loadPuntosv();
  },
}
</script>

