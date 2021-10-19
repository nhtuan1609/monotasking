<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" fixed app>
      <v-list-item style="height: 60px">
        <v-list-item-content>
          <v-list-item-title>
            <v-img src="/images/logo.png" height="60" alt="Monotasking" />
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider />
      <v-list>
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar fixed app height="60">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
    </v-app-bar>

    <v-main>
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'My Tasks',
          to: '/mytasks'
        }
      ],
      title: 'Frontend Developer'
    }
  }
}
</script>

<style lang="scss" scoped>
.v-application {
  font-family: Roboto, Arial, sans-serif;
  font-style: normal;
  font-size: 16px;
}
</style>
