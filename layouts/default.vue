<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
      light
      width="290"
    >
      <v-list>
        <v-list-item>
          <v-img src="/icono.png" max-height="40" max-width="30"></v-img>
          <span v-show="!miniVariant">&nbsp;Autoabastecimiento</span>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>

      <v-list-group no-action>
          <template v-slot:activator>
            <v-list-item-action>
              <v-icon>mdi-cogs</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Gestión</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="(item) in confs"
            :key="item.title"
            link
            :to="item.to"
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
      color="#0f7b4a"
      class="white--text"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" class="white--text" />
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-btn
        icon
        @click.stop="rightDrawer = !rightDrawer"
        class="white--text"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-navigation-drawer
      v-model="rightDrawer"
      :right="right"
      temporary
      fixed
    >
      <v-list>
        <v-list-item @click.native="$router.go(-1)">
          <v-list-item-action>
            <v-icon light>
              mdi-arrow-left
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>Ir atrás</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <!-- <v-footer
      :absolute="fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer> -->
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      clipped: true,
      drawer: true,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Inicio',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Captador',
          to: '/captador'
        },
        {
          icon: 'mdi-map',
          title: 'Mapa',
          to: '/mapa'
        },
        {
          icon: 'mdi-table',
          title: 'Consultas',
          to: '/querys'
        }
      ],
      confs:[
        {
          icon: 'mdi-table',
          title: 'Consejos Populares',
          to: '/config/consejos'
        },
        {
          icon: 'mdi-table',
          title: 'Unidades Productivas',
          to: '/config/unidades'
        },
        {
          icon: 'mdi-table',
          title: 'Comercializadoras',
          to: '/querys'
        },
        {
          icon: 'mdi-table',
          title: 'Productos',
          to: '/querys'
        }
        
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Autoabastecimiento'
    }
  }
}
</script>
