import { Ref, ref, shallowRef } from 'vue';
import { useGlobalState } from '../../utils/store';

type ImageProps = {
  coordinates: [number, number]; // [lat, lng]
  annotation: mapkit.ImageAnnotationConstructorOptions;
};

export const ImageAnnotation = (props: ImageProps): void => {
  const state = useGlobalState();
  const mapkit: Ref<typeof window.mapkit> = shallowRef(state.mapkit.value);

  if (state.mapLoad && state.map.value) {
    const coords = new mapkit.value.Coordinate(
      props.coordinates[0],
      props.coordinates[1],
    );
    const annotation: Ref<mapkit.ImageAnnotationConstructorOptions> = ref(
      props.annotation,
    );

    const imageAnnotation = new mapkit.value.ImageAnnotation(
      coords,
      annotation.value,
    );
    state.map.value.addAnnotation(imageAnnotation);
  }
};
