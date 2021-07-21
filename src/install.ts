import { App as Application, Plugin } from 'vue';
import VMap from './components/VMap.vue';
import { setVueInstance } from './utils/config/index';

let installed: boolean = false;

const install: Exclude<Plugin['install'], undefined> = (
  instance: Application,
) => {
  if (!installed) {
    setVueInstance(instance);
    instance.component('VMap', VMap);
    installed = true;
  }
};

export default install;
