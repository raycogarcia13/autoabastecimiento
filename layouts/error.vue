<template>
  <v-app dark>
      <v-main>
          <v-container fluid>
            <v-card>
              <v-card-title>
                <h1>{{ error.statusCode }}</h1>
              </v-card-title>
              <v-card-subtitle>
                <p v-if="error.statusCode === 404">
                  {{ pageNotFound }}
                </p>
                <p v-else>
                  {{ otherError }}
                </p>
              </v-card-subtitle>
              <v-card-actions>
                <v-btn color="#0f7b4a"  class="white--text" to="/">
                  Ir al inicio
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-container>
      </v-main>
  </v-app>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pageNotFound: 'Upss, ha aocurrido un error, la página solicitada no existe',
      otherError: 'An error occurred'
    }
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>
