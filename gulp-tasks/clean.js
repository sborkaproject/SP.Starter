import del from 'del';

import PATHS from '../paths';

export default function clean() {
	return del(PATHS.clean);
}
