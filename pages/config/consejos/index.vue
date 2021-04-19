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
            <v-toolbar-title>Consejos Populares</v-toolbar-title>
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
            <v-spacer></v-spacer>
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
                          label="Consejo Popular"
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                      >
                        <v-text-field
                          v-model="editedItem.habitantes"
                          label="Habitantes"
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
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon
            small
            class="mr-2"
            color="#0f7b4a"
            @click="editItem(item)"
          >
            mdi-pencil
          </v-icon>
           <v-icon
            small
            color="primary"
            @click="editMap(item)"
          >
            mdi-map
          </v-icon>
          <!-- <v-icon
            color="red"
            small
            @click="deleteItem(item)"
            disabled
          >
            mdi-delete
          </v-icon> -->
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
          text: 'Consejo Popular',
          align: 'start',
          value: 'nombre',
        },
        { text: 'Habitantes', value: 'habitantes' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        nombre: '',
        habitantes: 0
      },
      defaultItem: {
        nombre: '',
        habitantes: 0
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nuevo consejo' : 'Editar Consejo'
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
       
       let uri = '/api/consejos';
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
          let uri = '/api/consejos/'+this.editedItem._id;
          this.$axios.put(uri,this.editedItem).then(res=>{
            this.snack.text = "Consejo popular editado correctamente";
            this.snack.active = true;
          })
        } else {
          this.desserts.push(this.editedItem)
        }
        this.close()
      },
      editMap(item){
        this.$router.push('/config/consejos/editMap/'+item._id)
      }
    },
}
</script>
