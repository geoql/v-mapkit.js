import { Ref, ref, shallowRef } from 'vue';
import { TileOverlayProps } from '~/types';
import { useGlobalState } from '../../utils/store';

export const TileOverlay = (props: TileOverlayProps): void => {
  const state = useGlobalState();
  const mapkit: Ref<typeof window.mapkit> = shallowRef(state.mapkit.value);

  if (state.ui.init && state.ui.load && state.map.value) {
    const options: Ref<mapkit.TileOverlayConstructorOptions> = ref(
      props.options || {},
    );
    const url: Ref<mapkit.URLTemplateCallback | string> = ref(props.url);
    const tileOverlay = new mapkit.value.TileOverlay(url.value, options.value);
    state.map.value.addTileOverlay(tileOverlay);
  }
};
