import { Ref, ref, shallowRef } from 'vue';
import { useGlobalState } from '../../utils/store';

type CircleProps = {
  'circle-coordinates': number[];
  'circle-radius': number;
  'circle-style': mapkit.StyleConstructorOptions;
};

export const CircleOverlay = (props: CircleProps): void => {
  const state = useGlobalState();
  const mapkit: Ref<typeof window.mapkit> = shallowRef(state.mapkit.value);
  if (state.mapLoad && state.map.value) {
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
