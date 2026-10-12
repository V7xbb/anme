import { o as __toESM } from "../_runtime.mjs";
import { T as require_jsx_runtime, et as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as updateProfile, I as useCurrentUserState, L as useI18n, S as getMyProfile, a as claimPreviewAdmin, i as UserButton, n as RedirectToSignIn, r as SiteShell } from "./site-shell-38quj5hE.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-BM0Y20q8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	const { user, isPending } = useCurrentUserState();
	const { t, setLocale } = useI18n();
	const [name, setName] = (0, import_react.useState)("");
	const [avatar, setAvatar] = (0, import_react.useState)("");
	const [locale, setLoc] = (0, import_react.useState)("ar");
	const [role, setRole] = (0, import_react.useState)("user");
	const [preview, setPreview] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		getMyProfile().then((profile) => {
			setName(profile.displayName);
			setAvatar(profile.avatarUrl ?? "");
			setLoc(profile.locale);
			setRole(profile.role);
			setPreview(profile.previewAdminAvailable);
			setLocale(profile.locale === "en" ? "en" : "ar");
		}).catch((error) => toast.error(error instanceof Error ? error.message : "Error"));
	}, [user, setLocale]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("loading") }) });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mb-4 text-3xl font-extrabold",
			children: t("profile")
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "panel max-w-xl space-y-3 p-5",
			onSubmit: (event) => {
				event.preventDefault();
				updateProfile({ data: {
					displayName: name,
					avatarUrl: avatar,
					locale
				} }).then((profile) => {
					setRole(profile.role);
					setLocale(profile.locale === "en" ? "en" : "ar");
					toast.success("تم الحفظ");
				}).catch((error) => toast.error(error instanceof Error ? error.message : "Error"));
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: user.primaryEmail
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm",
					children: ["الدور: ", role]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-sm font-bold",
					children: ["الاسم", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field mt-1",
						value: name,
						onChange: (event) => setName(event.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-sm font-bold",
					children: ["صورة https", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field mt-1",
						value: avatar,
						onChange: (event) => setAvatar(event.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-sm font-bold",
					children: ["اللغة", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "field mt-1",
						value: locale,
						onChange: (event) => setLoc(event.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "ar",
							children: "العربية"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "en",
							children: "English"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "btn btn-primary",
					type: "submit",
					children: "حفظ"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
		}),
		preview && role !== "admin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			className: "btn btn-ghost mt-4",
			type: "button",
			onClick: () => claimPreviewAdmin().then((profile) => setRole(profile.role)).catch((error) => toast.error(error instanceof Error ? error.message : "Error")),
			children: "تفعيل الإدارة في المعاينة المحلية"
		}) : null,
		role === "suspended" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-danger",
			children: "الحساب موقوف."
		}) : null
	] });
}
//#endregion
export { ProfilePage as component };
