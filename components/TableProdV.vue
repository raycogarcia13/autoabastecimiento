<template>
      <v-col>
        {{title}}
        <v-data-table
            :headers="headers"
            :items="items"
            :search="search"
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
        
        </v-data-table>

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

      </v-col>
</template>
<script>
  export default {
    props:['items','title','fecha','unidad'],
    data () {
      return {
        snack: false,
        valid:true,
        search:'',
        snackColor: '',
        snackText: '',
        max25chars: v => !isNaN(v) || 'Debe ser un valor númerico!',
        headers: [
          {
            text: 'Producto',
            align: 'start',
            value: 'nombre',
          },
          { text: 'kg', value: 'cant' },
        ],
      }
    },
    methods: {
      save (item) {
        if(this.$refs.form.validate())
        {
          let uri = '/api/captador';
          item['date'] =this.fecha;
          item['unidad'] =this.unidad._id;
          item.cant = Number.parseFloat(item.cant);
          this.$axios.put(uri,item).then(res=>{
            this.snack = true
            this.snackColor = 'success'
            this.snackText = 'Información guardada correctamente';
          })
        }else
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
  }
</script>