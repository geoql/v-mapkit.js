import { Ref, shallowRef } from 'vue';
import { PolylineOverlayProps } from '~/types';
import { useGlobalState } from '../../utils/store';

export const PolylineOverlay = (props: PolylineOverlayProps): void => {
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
