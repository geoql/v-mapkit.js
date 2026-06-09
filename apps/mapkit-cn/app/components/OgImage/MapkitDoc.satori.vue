<script setup lang="ts">
  withDefaults(
    defineProps<{
      title?: string;
      description?: string;
      category?: string;
    }>(),
    {
      title: 'mapkit-cn',
      description: 'Beautiful Apple MapKit components for Vue.',
      category: '',
    },
  );
</script>

<template>
  <div
    :style="{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: '100%',
      height: '100%',
      backgroundColor: '#1d1d1f',
      padding: '60px',
      fontFamily: 'Geist, sans-serif',
    }"
  >
    <!-- Top: Category badge -->
    <div :style="{ display: 'flex', alignItems: 'center', gap: '12px' }">
      <div
        v-if="category"
        :style="{
          display: 'flex',
          alignItems: 'center',
          padding: '6px 16px',
          backgroundColor: '#0a2540',
          border: '1px solid #0071e3',
          borderRadius: '9999px',
          fontSize: '14px',
          fontWeight: 500,
          color: '#5ea9ff',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }"
      >
        {{ category }}
      </div>
    </div>

    <!-- Middle: Title + Description -->
    <div :style="{ display: 'flex', flexDirection: 'column', gap: '16px' }">
      <div
        :style="{
          fontSize: '64px',
          fontWeight: 700,
          color: '#f5f5f7',
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
        }"
      >
        {{ title }}
      </div>
      <div
        v-if="description"
        :style="{
          fontSize: '24px',
          color: '#a1a1a6',
          lineHeight: 1.4,
          maxWidth: '800px',
        }"
      >
        {{ description }}
      </div>
    </div>

    <!-- Bottom: Branding -->
    <div
      :style="{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }"
    >
      <div
        :style="{
          fontSize: '28px',
          fontWeight: 700,
          color: '#f5f5f7',
          letterSpacing: '-0.02em',
        }"
      >
        mapkit-cn
      </div>
      <div :style="{ fontSize: '18px', color: '#6e6e73' }">
        v-mapkit.js.geoql.in
      </div>
    </div>
  </div>
</template>
