import { Ref, shallowRef } from 'vue';
import { useGlobalState } from '../../utils/store';

type PolylineProps = {
  'polyline-coordinates': number[][];
  'polyline-style': mapkit.StyleConstructorOptions;
};

export const PolylineOverlay = (props: PolylineProps): void => {
  const state = useGlobalState();
  const mapkit: Ref<typeof window.mapkit> = shallowRef(state.mapkit.value);

  if (state.mapLoad && state.map.value) {
    const coords = props['polyline-coordinates'].map((point) => {
      return new mapkit.value.Coordinate(point[0], point[1]);
    });
    const style = new mapkit.value.Style(props['polyline-style']);
    const polyline = new mapkit.value.PolylineOverlay(coords, { style });
    state.map.value.addOverlay(polyline);
  }
};
