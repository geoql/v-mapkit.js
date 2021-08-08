import { Ref, ref, shallowRef } from 'vue';
import { useGlobalState } from '../../utils/store';

type TileProps = {
  url: mapkit.URLTemplateCallback | string;
  options?: mapkit.TileOverlayConstructorOptions;
};

export const TileOverlay = (props: TileProps): void => {
  const state = useGlobalState();
  const mapkit: Ref<typeof window.mapkit> = shallowRef(state.mapkit.value);

  if (state.mapLoad && state.map.value) {
    const options: Ref<mapkit.TileOverlayConstructorOptions> = ref(
      props.options || {},
    );
    const url: Ref<mapkit.URLTemplateCallback | string> = ref(props.url);
    const tileOverlay = new mapkit.value.TileOverlay(url.value, options.value);
    state.map.value.addTileOverlay(tileOverlay);
  }
};
