<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="6" md="4">
      <v-card elevation="12" class="rounded-lg"> 
        <v-card-title class="headline text-center justify-center" :elevation="7">
           <v-img src="/icono.png" max-width="60"></v-img>
           &nbsp;Autoabastecimiento
        </v-card-title>
        <v-divider></v-divider>
          <v-form method="post" v-model="valid" ref="form" @submit.prevent="login">
        <v-card-text>
           <v-text-field
              label="Usuario"
              placeholder="Inserte su nombre de usuario"
              v-model="username"
               :rules="userRules"
            ></v-text-field>

            <v-text-field
            :type="show?'text':'password'" 
             autocomplete v-on:keyup.enter="login()"
            :append-icon="show?'mdi-eye-off':'mdi-eye'"
            @click:append="toggle()"
            label="Contraseña"
            placeholder="Inserte su contraseña"
            v-model="password"
            :rules="passRules"
            :error-messages="error?errorMsg:''"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="#0f7b4a" shaped class="white--text" @click="login()">
          Entrar
          </v-btn>
          <!-- <v-spacer /> -->
        </v-card-actions>
        </v-form>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>

export default {
   layout:'login',
   data() {
     return {
       username:"",
       password:"",
       show:false,
       valid:true,
        error:false,
        errorMsg:'',
        errorR:false,
       userRules: [
          v => !!v || 'El usuario es obligatorio',
      ],
      passRules: [
          v => !!v || 'La contraseña es obligatoria',
      ],
     }
   },
    middleware:[
    // function({store,redirect}){
    //     if (store.state.auth.loggedIn) {
    //         redirect('/')
    //     }
    // }
  ],
  methods: {
  async login() {
    let em = this;

    let valid = this.$refs.form.validate();

    if(valid){
        try {
          await this.$store.dispatch("login",{username:this.username,password:this.password});
        } catch (e) {
         em.SendmsgError(e)
        }
      }
      else{
        this.SendmsgError();
      }
    },
    SendmsgError(e=null)
    {
      if(e)
        this.errorR = e.response
      this.error = true;
      this.errorMsg = 'Error de autenticación'
      this.tmp = this.email;
      this.email = "."
    },
     toggle()
    {
      this.show = !this.show
    },
  }
}
</script>
