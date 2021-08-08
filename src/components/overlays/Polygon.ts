import { Ref, shallowRef } from 'vue';
import { useGlobalState } from '../../utils/store';

type PolygonProps = {
  'polygon-coordinates': number[][]; // [lat, lng]
  'polygon-style': mapkit.StyleConstructorOptions;
};

export const PolygonOverlay = (props: PolygonProps): void => {
  const state = useGlobalState();
  const mapkit: Ref<typeof window.mapkit> = shallowRef(state.mapkit.value);

  if (state.mapLoad && state.map.value) {
    const points = props['polygon-coordinates'].map((point) => {
      return new mapkit.value.Coordinate(point[0], point[1]);
    });
    // Map the raw coordinates to Coordinates:
    const style = new mapkit.value.Style(props['polygon-style']);
    const rect = new mapkit.value.PolygonOverlay(points, { style });
    state.map.value.addOverlay(rect);
  }
};
