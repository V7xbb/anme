import { o as __toESM } from "../_runtime.mjs";
import { C as useNavigate, T as require_jsx_runtime, et as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as signIn, t as authClient } from "./client-IWHfIGH2.mjs";
import { t as GROK_PROVIDERS } from "./server-DWzvqhMl.mjs";
import { t as Logo } from "./logo-CkTdP6CC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-DUrbN0Ms.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const navigate = useNavigate();
	const [mode, setMode] = (0, import_react.useState)("in");
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	async function onSubmit(event) {
		event.preventDefault();
		setPending(true);
		setError("");
		const result = mode === "up" ? await authClient.signUp.email({
			email,
			password,
			name: name || email.split("@")[0] || "مشاهد",
			callbackURL: "/"
		}) : await authClient.signIn.email({
			email,
			password,
			callbackURL: "/"
		});
		setPending(false);
		if (result.error) {
			setError(result.error.message || "تعذر الدخول");
			return;
		}
		navigate({ to: "/" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-screen place-items-center bg-bg px-4 text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "panel w-full max-w-md space-y-4 p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-extrabold",
					children: "كارتيفاي أنمي"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "عالمك، قصتك، أنميك."
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-2",
					children: GROK_PROVIDERS.map((provider) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "btn btn-ghost w-full",
						onClick: () => signIn(provider.providerId, { callbackURL: "/" }),
						children: ["المتابعة عبر ", provider.label]
					}, provider.providerId))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "space-y-3",
					onSubmit,
					children: [
						mode === "up" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field",
							placeholder: "الاسم",
							value: name,
							onChange: (event) => setName(event.target.value)
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field",
							type: "email",
							required: true,
							placeholder: "البريد",
							value: email,
							onChange: (event) => setEmail(event.target.value),
							autoComplete: "email"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field",
							type: "password",
							required: true,
							minLength: 8,
							placeholder: "كلمة المرور",
							value: password,
							onChange: (event) => setPassword(event.target.value),
							autoComplete: mode === "up" ? "new-password" : "current-password"
						}),
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-danger",
							children: error
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn btn-primary w-full",
							type: "submit",
							disabled: pending,
							children: pending ? "…" : mode === "up" ? "إنشاء حساب" : "دخول"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-sm font-bold text-accent",
					onClick: () => setMode(mode === "up" ? "in" : "up"),
					children: mode === "up" ? "لدي حساب" : "حساب جديد"
				})
			] })]
		})
	});
}
//#endregion
export { LoginPage as component };
