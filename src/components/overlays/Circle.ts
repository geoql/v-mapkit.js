import { type Ref, ref, shallowRef } from 'vue';
import { type CircleOverlayProps } from '~/types';
import { useGlobalState } from '../../utils/store';

export const CircleOverlay = (props: CircleOverlayProps): void => {
  const state = useGlobalState();
  const mapkit: Ref<typeof window.mapkit> = shallowRef(state.mapkit.value);
  if (state.ui.init && state.ui.load && state.map.value) {
    const radius: Ref<number> = ref(props['circle-radius'] || 1);
    const coords = new mapkit.value.Coordinate(
      props['circle-coordinates'][0],
      props['circle-coordinates'][1],
    );
    const style = new mapkit.value.Style(props['circle-style'] || {});
    const circle = new mapkit.value.CircleOverlay(coords, radius.value, {
      style,
    });
    state.map.value.addOverlay(circle);
  }
};
