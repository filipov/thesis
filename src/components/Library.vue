<template>
  <div class="library">
    <icon-add />
    <icon-minus />
    <icon-screen />

    <icon-education />
    <icon-finance />
    <icon-management />
    <icon-project />
    <icon-science />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from '@vue/composition-api'

  import IconAdd from '@/components/library/IconAdd.vue'
  import IconMinus from '@/components/library/IconMinus.vue'
  import IconScreen from '@/components/library/IconScreen.vue'

  import IconEducation from '@/components/library/IconEducation.vue'
  import IconFinance from '@/components/library/IconFinance.vue'
  import IconManagement from '@/components/library/IconManagement.vue'
  import IconProject from '@/components/library/IconProject.vue'
  import IconScience from '@/components/library/IconScience.vue'

  export default defineComponent({
    name: 'Library',
    components: {
      IconAdd,
      IconMinus,
      IconScreen,

      IconEducation,
      IconFinance,
      IconManagement,
      IconProject,
      IconScience,
    },
  })
</script>

<style scoped lang="scss">
  .library {
    display: none;
  }
</style>
