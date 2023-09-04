import gulpWatch from 'gulp-watch';

import PATHS from '../paths';
import html from './html';
import styles from './styles';
import fonts from './fonts';
import images from './images';
import svg from './svg';
import robots from './robots';

export default function watch() {
	gulpWatch(PATHS.watch.nunj, html);
	gulpWatch([PATHS.watch.styles], styles);
	gulpWatch([PATHS.watch.fonts], fonts);
	gulpWatch([PATHS.watch.images], images);
	gulpWatch([PATHS.watch.svg], svg);
	gulpWatch([PATHS.watch.robots], robots);
}
