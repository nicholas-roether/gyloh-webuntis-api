class Substitution<T> {
	public current?: T | null;
	public subst?: T | null;

	constructor(current?: T, subst?: T) {
		this.current = current;
		this.subst = subst;
	}
}

export {
	Substitution
}