import { o as __toESM } from "../_runtime.mjs";
import { T as require_jsx_runtime, et as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { M as submitContact, r as SiteShell } from "./site-shell-38quj5hE.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-BY2jeVsR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ContactPage() {
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)("");
	function onSubmit(event) {
		event.preventDefault();
		submitContact({ data: {
			name,
			email,
			message
		} }).then(() => {
			setMessage("");
			toast.success("وصلت الرسالة");
		}).catch((error) => toast.error(error instanceof Error ? error.message : "Error"));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "panel mx-auto max-w-xl space-y-3 p-6",
		onSubmit,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-extrabold",
				children: "تواصل"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "field",
				required: true,
				value: name,
				onChange: (event) => setName(event.target.value),
				placeholder: "الاسم"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "field",
				required: true,
				type: "email",
				value: email,
				onChange: (event) => setEmail(event.target.value),
				placeholder: "البريد"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				className: "field min-h-32 py-2",
				required: true,
				value: message,
				onChange: (event) => setMessage(event.target.value),
				placeholder: "الرسالة"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "btn btn-primary",
				type: "submit",
				children: "إرسال"
			})
		]
	}) });
}
//#endregion
export { ContactPage as component };
