/**
 * Call a function when a click is detected outside of the
 * current DOM node ( AND its children )
 *
 * Example :
 *
 * <template>
 *   <div v-click-outside="onClickOutside">Hello</div>
 * </template>
 *
 * <script>
 * import clickOutside from '../../../../directives/clickOutside'
 * export default {
 *   directives: {
 *     clickOutside
 *   },
 *   data () {
 *     return {
         showDatePicker: false
 *     }
 *   },
 *   methods: {
 *     onClickOutside (event) {
 *       this.showDatePicker = false
 *     }
 *   }
 * }
 * </script>
 */
export default {
  bind: (el, binding, vNode) => {
    el.__vueClickOutside__ = (event) => {
      if (!el.contains(event.target)) {
        // call method provided in v-click-outside value
        vNode.context[binding.expression](event)
        event.stopPropagation()
      }
    }
    document.body.addEventListener('click', el.__vueClickOutside__)
  },
  unbind: (el, binding, vNode) => {
    // Remove Event Listeners
    document.body.removeEventListener('click', el.__vueClickOutside__)
    el.__vueClickOutside__ = null
  }
}
