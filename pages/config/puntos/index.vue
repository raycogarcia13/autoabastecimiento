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
            <v-toolbar-title>Unidades Comercializadoras</v-toolbar-title>
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
                          label="Nombre"
                        ></v-text-field>

                        <v-autocomplete
                            v-model="editedItem.basep_id"
                            :items="unidades"
                            item-text="nombre"
                            item-value="_id"
                            chips
                            small-chips
                            label="Unidad Productiva"
                          ></v-autocomplete>

                      </v-col>
                      <v-col
                        cols="12"
                      >
                        <v-autocomplete
                            v-model="editedItem.consejo_id"
                            :items="consejos"
                            item-text="nombre"
                            item-value="_id"
                            chips
                            small-chips
                            label="Consejo Popular"
                          ></v-autocomplete>
                      </v-col>
                      <v-col
                        cols="12"
                      >
                        <!-- <client-only> -->
                          <l-map ref="map" :zoom="13"
                                  :bounds="bounds" 
                                  :minZoom="7"
                                  :maxZoom="17"
                                  @click="addMarker"
                                  style="height: 50vh; width: 100%; z-index:1"
                          >
                            <l-tile-layer
                                        :url="url"
                                        :attribution="attribution"
                                        layer-type="base"
                                        name="Ráster" />
                            <l-marker :lat-lng="marker"></l-marker>
                          </l-map>
                        <!-- </client-only> -->
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
            <v-tooltip left>
               <template v-slot:activator="{ on, attrs }">
                  <v-btn color="secundary" @click="newItem()" v-bind="attrs" v-on="on" fab small><v-icon>mdi-plus</v-icon></v-btn>
               </template>
               <span>Agregar Producto</span>
            </v-tooltip>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
           <v-icon
            small
            color="primary"
            @click="editMap(item)"
          >
            mdi-map
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
      unidades:[],
      consejos:[],
      snack:{
        active: false,
        text: '',
        timeout: 2000,
      },
      search: '',
      dialogDelete: false,
      headers: [
        {
          text: 'Nombre',
          align: 'start',
          value: 'nombre',
        },
        { text: 'Base Productiva', value: 'basep_id.nombre' },
        { text: 'Consejo P', value: 'consejo_id.nombre' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        nombre: '',
        basep_id: {
          _id:'',
          nombre:''
        },
        consejo_id: {
          nombre:'',
          _id:''
        },
        geometry:[]
      },
      defaultItem: {
        nombre: '',
        basep_id: {
          _id:'',
          nombre:''
        },
        consejo_id: {
          nombre:'',
          _id:''
        },
        geometry:[]
      },
      marker:[0,0],
      bounds: [
               [21.8932641596, -82.8244219401],
               [21.9016376414, -82.8096053901]
         ],
      center:[],
          url: 'http://raster.enpa.iju.minag.cu/osm/{z}/{x}/{y}.jpg',
          // url: 'http://localhost/raster/{z}/{x}/{y}.jpg',
         attribution:
         '&copy; <a mailto="geomatica@enpa.iju.minag.cu">Enpa IJ</a>',
      
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nuevo punto de venta' : 'Editar punto de venta'
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
      async initialize () {
       
       let uri = '/api/puntos';
       this.$axios.get(uri).then(res=>{
         this.desserts = res.data.data
       });

        uri = '/api/consejos';
        await this.$axios.get(uri).then(res=>{
          this.consejos = res.data.data
        })

        uri = '/api/unidades';
        await this.$axios.get(uri).then(res=>{
          this.unidades = res.data.data
        })

      },

      newItem () {
        this.editedIndex = -1
        this.editedItem = Object.assign({}, this.defaultItem)
        this.dialog = true


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
            this.snack.text = "Punto de venta editado correctamente";
            this.snack.active = true;
            this.close();
          })
        }  else {
          let data = this.editedItem;
          data.geometry = [ 
            this.marker.lng,
            this.marker.lat,
            0.0 
          ];
          let uri = '/api/puntos/';
          this.$axios.post(uri,data).then(res=>{
            this.snack.text = "Punto de venta creado correctamente";
            this.snack.active = true;
            this.desserts.push(res.data.item);
            this.close()
          })
          console.log(data);
        }
      },
      editMap(item){
        this.$router.push('/config/puntos/editMap/'+item._id)
      },
      addMarker(e){
        this.marker = e.latlng;
      }
    },
}
</script>
