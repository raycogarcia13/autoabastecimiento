<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="users"
      sort-by="calories"
      class="elevation-1"
      :loading="loading"
    >
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-toolbar-title>Usuarios</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <v-dialog
            v-model="dialog"
            max-width="500px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >
              <v-icon>mdi-plus</v-icon>
                Nuevo
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-form v-model="valid" ref="form">
                <v-container>
                  <v-row>
                      <v-col
                        cols="12"
                      >
                        <v-text-field
                          v-model="editedItem.username"
                          label="Usuario"
                          dense
                          :rules="[emptyRule]"
                          :disabled="edit"
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                      >
                        <v-text-field
                          v-model="editedItem.name"
                          label="Nombre"
                          dense
                          :rules="[emptyRule]"
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                      >
                        <v-text-field
                          v-model="editedItem.email"
                          label="Correo"
                          dense
                          :rules="[emptyRule]"
                        ></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                      >
                        <v-combobox
                          v-model="editedItem.rol_id"
                          :items="roles"
                          item-text="rolename"
                          item-value="_id"
                          label="Rol"
                          dense
                          :rules="[emptyRule]"
                        ></v-combobox>
                      </v-col>
                      <v-col
                        cols="12"
                      >
                        <v-text-field
                          v-model="editedItem.passwordNew"
                          label="Contraseña"
                          dense
                          :type="show?'text':'password'" 
                          :append-icon="show?'mdi-eye-off':'mdi-eye'"
                          @click:append="toggle()"
                          :rules="(!edit)?[emptyRule]:[]"
                        ></v-text-field>
                      </v-col>
                  </v-row>
                </v-container>
                </v-form>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="close"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="save"
                >
                  Save
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
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn
          color="primary"
          @click="initialize"
        >
          Reset
        </v-btn>
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
  </div>
</template>

<script>
  export default {
    middleware: ['admin'],

    data: () => ({
      valid: false,
      loading: false,
      snack: false,
      snackColor: '',
      snackText: '',
      dialog: false,
      emptyRule: v => !!v || 'El campo es obligatorio',
      dialogDelete: false,
      show:false,
      headers: [
        {
          text: 'Usuario',
          align: 'start',
          value: 'username',
        },
        { text: 'Nombre', value: 'name' },
        { text: 'correo', value: 'email' },
        { text: 'Rol', value: 'rol_id.rolename' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      desserts: [],
      editedIndex: -1,
      edit:false,
      editedItem: {
        username: '',
        email: '',
        name: '',
        passwordNew:'',
        rol_id: null
      },
      defaultItem: {
        username: '',
        email: '',
        passwordNew:'',
        name: '',
        rol_id: null
      },
      users:[],
      roles:[]
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nuevo' : 'Editar'
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
        let uri = '/api/users';
        this.loading = true;

        this.$axios.get(uri).then(res=>{
          this.users = res.data
          this.loading = false;
        })

        this.$axios.get('/api/roles').then(res=>{
          this.roles = res.data
        })
      },

      editItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.edit =true;
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
        this.edit =false
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        let valid = this.$refs.form.validate();
        if(valid && this.editedItem.rol_id._id)
        {
          let data = {
            username:this.editedItem.username,
            name:this.editedItem.name,
            email:this.editedItem.email,
            rol:this.editedItem.rol_id._id,
            password:this.editedItem.passwordNew
          }

          let uri = '/api/users'
          if (this.edit) {
            data['id'] = this.editedItem._id;
            this.$axios.put(uri,data).then(res=>{
              console.log(res.data);
              this.snack = true
              this.snackColor = 'success'
              this.snackText = 'Usuario editado correctamente';
              this.initialize();
              this.close();
            }).catch((e)=>{
              this.snack = true
              this.snackColor = 'danger'
              this.snackText = 'El correo no es válido';
            })
          } else {
            this.$axios.post(uri,data).then(res=>{
              console.log(res.data);
              this.snack = true
              this.snackColor = 'success'
              this.snackText = 'Usuario guardado correctamente';
              this.initialize();
              this.close();
            }).catch((e)=>{
              this.snack = true
              this.snackColor = 'danger'
              this.snackText = 'El correo no es válido';
            })
          }
        }
        else
        {
          this.snack = true
          this.snackColor = 'danger'
          this.snackText = 'Tiene errores en el formulario';
        }
      },
      toggle()
      {
        this.show = !this.show
      }
    },
  }
</script>