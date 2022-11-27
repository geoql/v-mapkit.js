import { type Ref, ref, shallowRef } from 'vue';
import { type MarkerProps } from '~/types';
import { useGlobalState } from '../../utils/store';

export const MarkerAnnotation = (props: MarkerProps): void => {
  const state = useGlobalState();
  const mapkit: Ref<typeof window.mapkit> = shallowRef(state.mapkit.value);

  if (state.ui.init && state.ui.load && state.map.value) {
    const coords = new mapkit.value.Coordinate(
      props.coordinates[0],
      props.coordinates[1],
    );
    const annotation: Ref<mapkit.MarkerAnnotationConstructorOptions> = ref(
      props.annotation || {},
    );
    const markerAnnotation = new mapkit.value.MarkerAnnotation(
      coords,
      annotation.value,
    );
    state.map.value.addAnnotation(markerAnnotation);
  }
};
