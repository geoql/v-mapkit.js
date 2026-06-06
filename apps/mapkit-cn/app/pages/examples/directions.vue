<script setup lang="ts">
import { useDirections, VMap, VMarkerAnnotation, VPolylineOverlay } from "v-mapkit.js";
import { Button } from "@/components/ui/button";
import { centerMap } from "~/composables/useMapDemo";

definePageMeta({ layout: "example" });
useHead({ title: "Directions · mapkit-cn" });

const { token } = useMapkitToken();
const { route, isRouting, error } = useDirections();

const origin: [number, number] = [37.7749, -122.4194]; // San Francisco
const destination: [number, number] = [37.3349, -122.009]; // Apple Park

const path = shallowRef<[number, number][]>([]);
const summary = ref<{ distance: string; time: string } | null>(null);

async function findRoute(): Promise<void> {
  const response = await route(
    { latitude: origin[0], longitude: origin[1] } as never,
    { latitude: destination[0], longitude: destination[1] } as never,
  );

  const best = response?.routes?.[0];
  if (!best) return;

  // Pull coordinate geometry out of the route polyline overlay.
  const points = (
    best.polyline as unknown as {
      points?: Array<{ latitude: number; longitude: number }>;
    }
  ).points;

  if (points?.length) {
    path.value = points.map((p) => [p.latitude, p.longitude]);
  }

  summary.value = {
    distance: `${(best.distance / 1000).toFixed(1)} km`,
    time: `${Math.round(best.expectedTravelTime / 60)} min`,
  };
}

function onMap(map: unknown): void {
  centerMap(map as never, [37.55, -122.21], 0.6);
  void findRoute();
}

const code = `<script setup lang="ts">
  import {
    VMap,
    VPolylineOverlay,
    useDirections,
  } from 'v-mapkit.js';

  const { route } = useDirections();

  const { routes } = await route(
    new mapkit.Coordinate(37.7749, -122.4194),
    new mapkit.Coordinate(37.3349, -122.009),
  );

  const path = routes[0].polyline.points.map(
    (p) => [p.latitude, p.longitude],
  );
<\x2Fscript>

<template>
  <VMap :access-token="token">
    <VPolylineOverlay :coordinates="path" :style="{ strokeColor: '#0a84ff', lineWidth: 5 }" />
  </VMap>
</template>`;
</script>

<template>
  <ExampleCard
    title="Directions"
    description="useDirections wraps MapKit routing. Pass an origin and destination to get routes with distance and travel time, then draw the route geometry with a polyline overlay."
  >
    <ExampleMapContainer>
      <VMap :access-token="token" color-scheme="light" @map="onMap">
        <VPolylineOverlay
          v-if="path.length"
          :coordinates="path"
          :style="{ strokeColor: '#0a84ff', lineWidth: 5, lineCap: 'round' }"
        />
        <VMarkerAnnotation
          :coordinates="origin"
          :annotation="{ title: 'San Francisco', color: '#30d158', glyphText: 'A' }"
        />
        <VMarkerAnnotation
          :coordinates="destination"
          :annotation="{ title: 'Apple Park', color: '#ff375f', glyphText: 'B' }"
        />
      </VMap>
    </ExampleMapContainer>

    <template #controls>
      <div class="flex flex-wrap items-center gap-3">
        <Button size="sm" :disabled="isRouting" @click="findRoute">
          {{ isRouting ? "Routing…" : "Recalculate route" }}
        </Button>
        <div v-if="summary" class="flex items-center gap-4 font-mono text-xs text-muted-foreground">
          <span class="tabular-nums">{{ summary.distance }}</span>
          <span class="text-border">·</span>
          <span class="tabular-nums">{{ summary.time }}</span>
        </div>
        <p v-if="error" class="text-xs text-destructive">
          {{ error.message }}
        </p>
      </div>
    </template>

    <template #code>
      <ExampleCodeBlock :code="code" filename="Directions.vue" />
    </template>
  </ExampleCard>
</template>
