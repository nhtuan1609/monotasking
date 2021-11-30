<template>
  <v-card light tile elevation="0">
    <v-card-title>Progress summary</v-card-title>
    <v-card-text>
      <div class="progress__value my-2">{{ progress }}%</div>
      <v-slider
        :value="progress"
        class="progress__slider"
        readonly
        hide-details
        track-color="var(--v-_base-darken1)"
        step="5"
      ></v-slider>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'ProgressSummary',
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  computed: {
    progress() {
      if (!this.task.checklist?.length) return 0
      const totalPoints = this.task.checklist.reduce((sum, checkItem) => sum + checkItem.point, 0)
      const checkedPoints = this.task.checklist.reduce(
        (sum, checkItem) => (checkItem.isChecked ? sum + checkItem.point : sum),
        0
      )
      return Math.floor((100 * checkedPoints) / totalPoints)
    }
  }
}
</script>

<style lang="scss" scoped>
.progress__value {
  color: var(--color-primary);
  font-size: 40px;
  font-weight: bold;
  text-align: center;
}

.progress__slider ::v-deep {
  .v-slider__track-container {
    height: 24px;
    border-radius: 24px;
  }
  .v-slider__track-background {
    border-top-right-radius: 24px;
    border-bottom-right-radius: 24px;
  }
  .v-slider__track-fill {
    border-top-left-radius: 24px;
    border-bottom-left-radius: 24px;
  }
  .v-slider__thumb {
    width: 24px;
    height: 24px;
    left: -12px;
    &::before {
      width: 20px;
      height: 20px;
      left: 2px;
      top: 2px;
      opacity: 1;
      transform: scale(1) !important;
      background-color: var(--color-background) !important;
    }
  }
  .v-slider__thumb-container:hover .v-slider__thumb:before {
    transform: scale(1) !important;
  }
  .v-slider__thumb-container:focus .v-slider__thumb:before {
    transform: scale(1) !important;
  }
}
</style>
