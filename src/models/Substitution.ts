/**
 * Represents a substitution, such as of rooms or teachers
 */
class Substitution<T> {
	/**
	 * The current room/teacher/etc. which replaces the usual
	 */
	public current?: T | null;
	/**
	 * The usual room/teacher/etc. that is being substituted for
	 */
	public subst?: T | null;

	/**
	 * @param current The actual room/teacher/etc. which replaces the usual
	 * @param subst The usual room/teacher/etc. that is being substituted for
	 */
	constructor(current?: T, subst?: T) {
		this.current = current;
		this.subst = subst;
	}
}

export {
	Substitution
}