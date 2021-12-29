<template>
  <div class="card__wrap">
    <div class="card__clock">
      <div class="card__clock-item">
        <div class="card__clock-value">
          {{
            days.toLocaleString('en-US', {
              minimumIntegerDigits: 2
            })
          }}
        </div>
        <div class="card__clock-title">days</div>
      </div>

      <div class="card__clock-item">
        <div class="card__clock-value">
          {{
            hours.toLocaleString('en-US', {
              minimumIntegerDigits: 2
            })
          }}
        </div>
        <div class="card__clock-title">hours</div>
      </div>

      <div class="card__clock-item">
        <div class="card__clock-value">
          {{
            minutes.toLocaleString('en-US', {
              minimumIntegerDigits: 2
            })
          }}
        </div>
        <div class="card__clock-title">minutes</div>
      </div>

      <div class="card__clock-item">
        <div class="card__clock-value">
          {{
            seconds.toLocaleString('en-US', {
              minimumIntegerDigits: 2
            })
          }}
        </div>
        <div class="card__clock-title">seconds</div>
      </div>
    </div>

    <div class="card__title">COMING SOON</div>
    <div class="card__description">We're currently working on creating something fantastic.</div>
    <div class="card__description">We'll be here soon, subscribe to be notified.</div>
    <v-btn class="mt-8" width="160" height="48" elevation="0" @click="subscribeNotification">Notify me</v-btn>
  </div>
</template>

<script>
export default {
  name: 'ComingSoon',
  beforeRouteLeave(to, from, next) {
    clearInterval(this.timer)
  },
  data() {
    return {
      distance: 0,
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00',
      timer: null
    }
  },
  beforeMount() {
    this.setDefaultDistance()
    this.calculateTimeLeft()
  },
  created() {
    this.timer = setInterval(this.calculateTimeLeft, 1000)
  },
  methods: {
    /**
     * set default distance days
     * @return {void}
     */
    setDefaultDistance() {
      // set 10 days left in milliseconds
      this.distance = 10 * 24 * 60 * 60 * 1000
    },
    /**
     * update distance every 1s
     * @return {void}
     */
    calculateTimeLeft() {
      // calculate distance
      this.distance -= 1000

      // Time calculations for days, hours, minutes and seconds
      this.days = Math.floor(this.distance / (1000 * 60 * 60 * 24))
      this.hours = Math.floor((this.distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      this.minutes = Math.floor((this.distance % (1000 * 60 * 60)) / (1000 * 60))
      this.seconds = Math.floor((this.distance % (1000 * 60)) / 1000)

      // If the count down is finished, reset count down date
      if (this.distance < 0) {
        this.setDefaultDistance()
      }
    },
    subscribeNotification() {
      this.$showSuccessNotification('Subscribed')
    }
  }
}
</script>

<style lang="scss" scoped>
.card__wrap {
  width: 100%;
  height: calc(100% - var(--height-page-title));
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  padding: 32px;

  .card__clock {
    display: flex;
    gap: 32px;

    .card__clock-item {
      background-color: rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(4px);
      padding: 4px;
      border-radius: 8px;
    }

    .card__clock-value {
      line-height: 80px;
      font-size: 80px;
      font-weight: 200;
    }

    .card__clock-title {
      font-size: 18px;
      font-weight: bold;
      color: var(--color-primary);
      text-align: center;
    }
  }

  .card__title {
    font-size: 100px;
    font-weight: 300;
    margin: 24px 0;
    text-align: center;
  }

  .card__description {
    font-size: 18px;
    text-align: center;
  }
}
</style>
