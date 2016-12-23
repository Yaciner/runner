import webfontLoader from 'webfontloader';
import Game from './classes/Game';

const init = () => {
  webfontLoader.load({
    custom: {
      families: [`oil_can`],
      urls: [`assets/fonts/oil_can.css`]
    },
    active: () => {
      new Game();
    }
  });
};

init();
