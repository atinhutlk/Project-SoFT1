const sp = document.getElementById("sprinner");
const spinner = {
	show: () => {
		sp.classList.remove("d-none");
	},

	hide: () => {
		sp.classList.add("d-none");
	},
};
export default spinner;
