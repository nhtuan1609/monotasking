<template>
  <v-navigation-drawer v-bind="$attrs" class="primary" fixed app temporary @input="toggleDrawer">
    <v-list-item style="height: 60px">
      <v-list-item-content>
        <v-list-item-title>
          <div class="app-name">Monotasking</div>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider />

    <div v-for="(item, itemIndex) in menus" :key="itemIndex">
      <v-list-item v-if="!item.subMenus" :to="item.to" router exact active-class="white--text">
        <v-list-item-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title v-text="item.title" />
        </v-list-item-content>
      </v-list-item>

      <v-list-group v-else :prepend-icon="item.icon" active-class="white--text">
        <template #activator>
          <v-list-item-title v-text="item.title" />
        </template>
        <v-list-item
          v-for="(subItem, subItemIndex) in item.subMenus"
          :key="subItemIndex"
          :to="subItem.to"
          router
          exact
          class="pl-8"
          active-class="white--text"
        >
          <v-list-item-action>
            <v-icon>{{ subItem.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="subItem.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </div>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'NavigationDrawer',
  props: {
    menus: {
      type: Array,
      required: true
    }
  },
  methods: {
    toggleDrawer(isOpenDrawer) {
      if (!isOpenDrawer) {
        this.$emit('toggleDrawer')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-name {
  font-size: 30px;
  font-weight: bold;
  text-align: center;
}
</style>
