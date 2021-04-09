<template>
  <div>
    <v-row justify="center" align="center">
      <v-col>
                <v-card-title>
                <h1 class="flex">
                  {{ error.statusCode }}
                </h1>
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
                  <v-btn color="#0f7b4a"  class="white--text" @click="back()">
                    <v-icon>mdi-arrow-left</v-icon>
                    Regresar
                  </v-btn>
                </v-card-actions>
      </v-col>
      <v-col>
          <v-img src="/404.png" width="500"></v-img>
      </v-col>
    </v-row>
  </div>
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
  },
  methods: {
    back()
    {
      return this.$router.go(-1);
    }
  },
}
</script>
