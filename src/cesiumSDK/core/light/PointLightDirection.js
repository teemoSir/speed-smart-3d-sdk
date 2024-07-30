import Speed from "../speed";

/**
 * 光源方向
 *
 * @see PointLight#direction
 */
export default class PointLightDirection extends Speed {
	/**
	 * 从上到下
	 *
	 * @type {String}
	 * @constant
	 */
	static UP_TO_DOWN = "UP_TO_DOWN";

	/**
	 * 从下到上
	 *
	 * @type {String}
	 * @constant
	 */
	static DOWN_TO_UP = "DOWN_TO_UP";

	/**
	 * 从西到东
	 *
	 * @type {String}
	 * @constant
	 */
	static WEST_TO_EAST = "WEST_TO_EAST";

	/**
	 * 从东到西
	 *
	 * @type {String}
	 * @constant
	 */
	static EAST_TO_WEST = "EAST_TO_WEST";

	/**
	 * 从南到北
	 *
	 * @type {String}
	 * @constant
	 */
	static SOUTH_TO_NORTH = "SOUTH_TO_NORTH";

	/**
	 * 从北到南
	 *
	 * @type {String}
	 * @constant
	 */
	static NORTH_TO_SOUTH = "NORTH_TO_SOUTH";
}
