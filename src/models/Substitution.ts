class Substitution<T> {
	public current?: T;
	public subst?: T;

	constructor(current?: T, subst?: T) {
		this.current = current;
		this.subst = subst;
	}
}

export {
	Substitution
}