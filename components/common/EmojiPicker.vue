<template>
  <v-menu transition="slide-y-transition" bottom offset-y>
    <template #activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on">
        <v-icon>mdi-emoticon-happy-outline</v-icon>
      </v-btn>
    </template>
    <v-card class="pa-2" light>
      <v-text-field
        v-model="keyWord"
        class="emoji__search"
        placeholder="Search"
        filled
        rounded
        dense
        hide-details
        prepend-inner-icon="mdi-magnify"
        @click="(event) => event.stopPropagation()"
      ></v-text-field>
      <div class="emoji__container customized-scrollbar">
        <div v-for="(emojis, index) in keyWord ? SEARCHED_EMOJI : EMOJI.ALL" :key="index" class="emoji__catagories">
          <div class="emoji__catagories-title">{{ emojis.catagories }}</div>
          <div class="emoji__catagories-wrapper">
            <div
              v-for="(emoji, emojiIndex) in emojis.el"
              :key="emojiIndex"
              class="emoji__catagories-icon"
              @click="selectEmoji(emoji)"
            >
              {{ emoji.icon }}
            </div>
          </div>
        </div>
      </div>
    </v-card>
  </v-menu>
</template>

<script>
import { EMOJI } from '~/constants/emoji.js'

export default {
  name: 'EmojiPicker',
  data() {
    return {
      keyWord: ''
    }
  },
  computed: {
    EMOJI() {
      return EMOJI
    },
    SEARCHED_EMOJI() {
      const result = [
        {
          catagories: 'Search result',
          el: []
        }
      ]
      if (!this.keyWord) return result
      this.EMOJI.ALL.forEach((emojis) => {
        if (emojis.catagories === 'Frequently used') return
        emojis.el.forEach((emoji) => {
          if (emoji.name.some((item) => item.includes(this.keyWord))) {
            result[0].el.push(emoji)
          }
        })
      })

      return result
    }
  },
  methods: {
    selectEmoji(emoji) {
      this.$emit('select', emoji)
    }
  }
}
</script>

<style lang="scss" scoped>
.emoji__search ::v-deep {
  margin-bottom: 8px;
  border-radius: 8px !important;
  & .v-input__slot {
    padding: 0 8px;
  }
}
.emoji__container {
  width: 280px;
  height: 300px;
  overflow-y: auto;
}
.emoji__catagories {
  margin-top: 10px;
  &:first-child {
    margin-top: 0;
  }
}
.emoji__catagories-title {
  font-size: 14px;
  font-weight: bold;
  color: var(--color-text);
  margin-left: 8px;
}
.emoji__catagories-wrapper {
  display: flex;
  flex-wrap: wrap;
}
.emoji__catagories-icon {
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  border-radius: 4px;
  &:hover {
    cursor: pointer;
    background-color: var(--color-hover);
  }
}
</style>
