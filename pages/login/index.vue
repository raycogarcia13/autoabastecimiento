<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="6" md="4">
      <v-card elevation="12" class="rounded-lg"> 
        <v-card-title class="headline text-center justify-center" :elevation="7">
           <v-img src="/icono.png" max-width="60"></v-img>
           &nbsp;Autoabastecimiento
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
           <v-text-field
              label="Usuario"
              placeholder="Inserte su nombre de usuario"
              v-model="username"
            ></v-text-field>

            <v-text-field
            label="Contraseña"
            placeholder="Inserte su contraseña"
            v-model="password"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="#0f7b4a" shaped class="white--text">
          Entrar
          </v-btn>
          <!-- <v-spacer /> -->
        </v-card-actions>
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
       password:""
     }
   },
}
</script>
