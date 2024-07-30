
import baseMapSelector from './baseMapSelector'
import toolbar from './toolbar'
import speeddialog from './speed-dialog'


export default function (Vue) {

	Vue.use(baseMapSelector);
	Vue.use(toolbar);
	Vue.use(speeddialog);
}
