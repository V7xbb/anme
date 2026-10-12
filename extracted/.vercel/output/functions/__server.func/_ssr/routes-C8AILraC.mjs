import { T as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as SiteShell } from "./site-shell-38quj5hE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C8AILraC.js
var import_jsx_runtime = require_jsx_runtime();
var SplitErrorComponent = ({ error, reset }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "panel p-8 text-center",
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-extrabold",
			children: "تعذر تحميل الكتالوج"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-muted",
			children: error instanceof Error ? error.message : "تعذر تحميل الكتالوج"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			className: "btn btn-primary mt-6",
			type: "button",
			onClick: () => reset(),
			children: "إعادة المحاولة"
		})
	]
}) });
//#endregion
export { SplitErrorComponent as errorComponent };
