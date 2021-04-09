<template>
  <v-row >
    
    <v-col cols="12" >
      <v-data-table
        :headers="headers"
        :items="desserts"
        sort-by="nombre"
        :search="search"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar
            flat
          >
            <v-toolbar-title>Productos</v-toolbar-title>
            <v-divider
              class="mx-4"
              inset
              vertical
            ></v-divider>
            <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Buscar"
                single-line
                hide-details
            ></v-text-field>
            <v-dialog
              v-model="dialog"
              max-width="500px"
            >
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col
                        cols="12"
                      >
                        <v-text-field
                          v-model="editedItem.nombre"
                          label="Producto"
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                      >
                        <v-text-field
                          v-model="editedItem.sipa_id"
                          label="ID SIPA"
                        ></v-text-field>
                        <v-text-field
                          v-model="editedItem.rendimiento"
                          label="Rendimiento"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="green darken-1"
                    text
                    @click="close"
                  >
                    Cancelar
                  </v-btn>
                  <v-btn
                    color="green darken-1"
                    text
                    @click="save"
                  >
                    Guardar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-spacer></v-spacer>
            <v-tooltip left>
               <template v-slot:activator="{ on, attrs }">
                  <v-btn color="primary" disabled  v-bind="attrs" v-on="on" fab small><v-icon>mdi-plus</v-icon></v-btn>
               </template>
               <span>Agregar Producto</span>
            </v-tooltip>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
           <v-icon
            small
            color="primary"
            @click="editItem(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            color="red"
            small
            @click="deleteItem(item)"
            disabled
          >
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn
            color="#0f7b4a"
            class="white--text"
            @click="initialize"
          >
            <v-icon>mdi-refresh</v-icon> Recargar
          </v-btn>
        </template>
      </v-data-table>

       <v-snackbar
          v-model="snack.active"
          :timeout="snack.timeout"
          shaped
          color="rgba(15,123,74,0.5)"
          top
          right
        >
          {{ snack.text }}
        </v-snackbar>
    </v-col>
  </v-row>
</template>

<script>

export default {
  data: () => ({
      dialog: false,
      snack:{
        active: false,
        text: '',
        timeout: 2000,
      },
      search: '',
      dialogDelete: false,
      headers: [
        {
          text: 'Producto',
          align: 'start',
          value: 'nombre',
        },
        { text: 'Tipo', value: 'tipo_id.nombre' },
        { text: 'SIPA', value: 'sipa_id' },
        { text: 'Rend', value: 'rendimiento' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        nombre: '',
        habitantes: 0,
        tipo_id:{
          nombre:''
        }
      },
      defaultItem: {
        nombre: '',
        habitantes: 0,
        tipo_id:{
          nombre:''
        }
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nuevo Producto' : 'Editar Producto'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    created () {
      this.initialize()
    },

    methods: {
      initialize () {
       
       let uri = '/api/productos';
       this.$axios.get(uri).then(res=>{
         this.desserts = res.data.data
       })


      },

      editItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        this.desserts.splice(this.editedIndex, 1)
        this.closeDelete()
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.desserts[this.editedIndex], this.editedItem)
          let uri = '/api/productos/';
          this.$axios.put(uri,this.editedItem).then(res=>{
            this.snack.text = "Punto de venta editado correctamente";
            this.snack.active = true;
          })
        } else {
          console.log('a insertar');
        }
        this.close()
      },
    },
}
</script>
