import { Ref, ref, shallowRef } from 'vue';
import { useGlobalState } from '../../utils/store';

type MarkerProps = {
  coordinates: [number, number]; // [lat, lng]
  annotation?: mapkit.MarkerAnnotationConstructorOptions;
};

export const MarkerAnnotation = (props: MarkerProps): void => {
  const state = useGlobalState();
  const mapkit: Ref<typeof window.mapkit> = shallowRef(state.mapkit.value);

  if (state.mapLoad && state.map.value) {
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
