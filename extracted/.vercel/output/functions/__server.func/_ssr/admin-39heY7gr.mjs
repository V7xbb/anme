import { o as __toESM } from "../_runtime.mjs";
import { T as require_jsx_runtime, et as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as saveAdminEpisode, E as saveAdminAnime, I as useCurrentUserState, O as saveAdminSettings, S as getMyProfile, T as runAdminSync, c as deleteAdminSource, d as getAdminEpisodes, f as getAdminOverview, h as getAdminUsers, j as setAdminUserRole, k as saveAdminSource, m as getAdminSources, n as RedirectToSignIn, o as deleteAdminAnime, p as getAdminSettings, r as SiteShell, s as deleteAdminEpisode, u as getAdminAnime } from "./site-shell-38quj5hE.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-39heY7gr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var tabs = [
	"overview",
	"anime",
	"episodes",
	"sources",
	"sync",
	"users",
	"settings"
];
function AdminPage() {
	const { user, isPending } = useCurrentUserState();
	const [role, setRole] = (0, import_react.useState)(null);
	const [tab, setTab] = (0, import_react.useState)("overview");
	(0, import_react.useEffect)(() => {
		if (!user) return;
		getMyProfile().then((profile) => setRole(profile.role)).catch(() => setRole("denied"));
	}, [user]);
	if (isPending || user && role == null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "جارٍ التحقق…" }) });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {}) });
	if (role !== "admin") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "text-3xl font-extrabold",
		children: "غير مسموح"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-2 text-muted",
		children: "فعّل صلاحية المدير من الحساب في المعاينة، أو عبر KARTIFY_ADMIN_EMAILS في الإنتاج."
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mb-4 text-3xl font-extrabold",
			children: "لوحة الإدارة"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-5 flex gap-2 overflow-x-auto",
			children: tabs.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: `btn ${tab === item ? "btn-primary" : "btn-ghost"}`,
				onClick: () => setTab(item),
				children: item
			}, item))
		}),
		tab === "overview" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overview, {}) : null,
		tab === "anime" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimeAdmin, {}) : null,
		tab === "episodes" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EpisodeAdmin, {}) : null,
		tab === "sources" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceAdmin, {}) : null,
		tab === "sync" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SyncAdmin, {}) : null,
		tab === "users" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsersAdmin, {}) : null,
		tab === "settings" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsAdmin, {}) : null
	] });
}
function Overview() {
	const [data, setData] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		getAdminOverview().then(setData).catch((error) => toast.error(error instanceof Error ? error.message : "Error"));
	}, []);
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skel h-40 rounded-2xl" });
	const cards = [
		["عناوين", data.counts.anime],
		["حلقات مسجّلة", data.counts.episodes],
		["مصادر", data.counts.sources],
		["مصادر مفعّلة وموثّقة", data.counts.active_sources],
		["مستخدمون", data.counts.users]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-3",
				children: cards.map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-3xl font-extrabold",
						children: value
					})]
				}, label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "panel p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-extrabold",
					children: "آخر مزامنة"
				}), data.runs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "لا توجد عمليات بعد."
				}) : data.runs.map((run) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						run.kind,
						" · ",
						run.status,
						" · نجح ",
						run.success,
						" · فشل ",
						run.failure,
						" · ",
						run.message
					]
				}, run.id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "panel p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-extrabold",
					children: "سجل الإدارة"
				}), data.audits.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						row.action,
						" · ",
						row.entityType,
						" · ",
						row.detail
					]
				}, row.id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "panel p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-extrabold",
					children: "رسائل التواصل"
				}), data.messages.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm",
					children: [
						row.name,
						" · ",
						row.email,
						": ",
						row.message
					]
				}, row.id))]
			})
		]
	});
}
function AnimeAdmin() {
	const [q, setQ] = (0, import_react.useState)("");
	const [rows, setRows] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({
		title: "",
		titleAr: "",
		genres: "",
		format: "TV",
		airingStatus: "FINISHED",
		lockSynopsis: false,
		lockPoster: false
	});
	function load(query = q) {
		getAdminAnime({ data: query }).then(setRows).catch((error) => toast.error(error instanceof Error ? error.message : "Error"));
	}
	(0, import_react.useEffect)(() => {
		load("");
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field",
					value: q,
					onChange: (event) => setQ(event.target.value),
					placeholder: "بحث بالعنوان أو معرف المزود"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "btn btn-primary",
					type: "button",
					onClick: () => load(),
					children: "بحث"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "panel grid gap-2 p-4 md:grid-cols-2",
				onSubmit: (event) => {
					event.preventDefault();
					saveAdminAnime({ data: form }).then(() => {
						toast.success("حُفظ");
						load();
					}).catch((error) => toast.error(error instanceof Error ? error.message : "Error"));
				},
				children: [
					[
						"title",
						"titleAr",
						"englishTitle",
						"originalTitle",
						"genres",
						"posterUrl",
						"bannerUrl",
						"releaseYear",
						"episodeCount",
						"season",
						"seasonYear",
						"synopsis",
						"synopsisAr"
					].map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs font-bold",
						children: [key, key.startsWith("synopsis") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: "field mt-1 min-h-24 py-2",
							value: String(form[key] ?? ""),
							onChange: (event) => setForm({
								...form,
								[key]: event.target.value
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field mt-1",
							value: String(form[key] ?? ""),
							onChange: (event) => setForm({
								...form,
								[key]: event.target.value
							})
						})]
					}, key)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs",
						children: ["ترجمة عربية", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "field mt-1",
							value: String(form.hasArabicSubs ?? "unknown"),
							onChange: (event) => setForm({
								...form,
								hasArabicSubs: event.target.value
							}),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "unknown",
									children: "غير موثّق"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "yes",
									children: "نعم"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "no",
									children: "لا"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs",
						children: ["دبلجة عربية", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "field mt-1",
							value: String(form.hasArabicDub ?? "unknown"),
							onChange: (event) => setForm({
								...form,
								hasArabicDub: event.target.value
							}),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "unknown",
									children: "غير موثّق"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "yes",
									children: "نعم"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "no",
									children: "لا"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs",
						children: ["دبلجة مصرية", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "field mt-1",
							value: String(form.hasEgyptianDub ?? "unknown"),
							onChange: (event) => setForm({
								...form,
								hasEgyptianDub: event.target.value
							}),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "unknown",
									children: "غير موثّق"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "yes",
									children: "نعم"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "no",
									children: "لا"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: Boolean(form.lockSynopsis),
							onChange: (event) => setForm({
								...form,
								lockSynopsis: event.target.checked
							})
						}), " حماية الوصف الإنجليزي من المزامنة"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: Boolean(form.lockPoster),
							onChange: (event) => setForm({
								...form,
								lockPoster: event.target.checked
							})
						}), " تثبيت الملصق"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn btn-primary",
						type: "submit",
						children: form.id ? "تحديث" : "إنشاء"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel p-4 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-extrabold",
					children: "تكرار محتمل في العناوين"
				}), rows?.duplicates.length ? rows.duplicates.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					row.title,
					" · ",
					row.n
				] }, row.title)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted",
					children: "لا تكرار ظاهر."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: rows?.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "panel flex flex-wrap items-center justify-between gap-2 p-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						item.title,
						" · ",
						item.provider,
						":",
						item.providerId
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn btn-ghost",
							onClick: () => setForm({
								id: item.id,
								title: item.title,
								titleAr: item.titleAr ?? "",
								englishTitle: item.englishTitle ?? "",
								originalTitle: item.originalTitle ?? "",
								genres: item.genres.join(", "),
								posterUrl: item.posterUrl ?? "",
								bannerUrl: item.bannerUrl ?? "",
								releaseYear: String(item.releaseYear ?? ""),
								episodeCount: String(item.episodeCount ?? ""),
								season: item.season ?? "",
								seasonYear: String(item.seasonYear ?? ""),
								synopsis: item.synopsis ?? "",
								synopsisAr: item.synopsisAr ?? "",
								format: item.format ?? "TV",
								airingStatus: item.airingStatus ?? "FINISHED",
								hasArabicSubs: item.hasArabicSubs == null ? "unknown" : item.hasArabicSubs ? "yes" : "no",
								hasArabicDub: item.hasArabicDub == null ? "unknown" : item.hasArabicDub ? "yes" : "no",
								hasEgyptianDub: item.hasEgyptianDub == null ? "unknown" : item.hasEgyptianDub ? "yes" : "no",
								lockPoster: false,
								lockSynopsis: false
							}),
							children: "تعديل"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn btn-ghost",
							onClick: () => {
								if (!confirm("حذف السجل وكل الحلقات المرتبطة؟")) return;
								deleteAdminAnime({ data: item.id }).then(() => load()).catch((error) => toast.error(error instanceof Error ? error.message : "Error"));
							},
							children: "حذف"
						})]
					})]
				}, item.id))
			})
		]
	});
}
function EpisodeAdmin() {
	const [animeId, setAnimeId] = (0, import_react.useState)("");
	const [data, setData] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({
		animeId: "",
		number: "1",
		title: "",
		synopsis: "",
		thumbnailUrl: "",
		durationSeconds: "",
		seasonId: ""
	});
	function load() {
		if (!animeId) return;
		getAdminEpisodes({ data: animeId }).then(setData).catch((error) => toast.error(error instanceof Error ? error.message : "Error"));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field",
					placeholder: "معرّف الأنمي",
					value: animeId,
					onChange: (event) => setAnimeId(event.target.value)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "btn btn-primary",
					type: "button",
					onClick: load,
					children: "عرض"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "panel grid gap-2 p-4",
				onSubmit: (event) => {
					event.preventDefault();
					saveAdminEpisode({ data: {
						...form,
						animeId: form.animeId || animeId,
						number: Number(form.number),
						durationSeconds: Number(form.durationSeconds)
					} }).then(() => {
						toast.success("حُفظت الحلقة");
						load();
					}).catch((error) => toast.error(error instanceof Error ? error.message : "Error"));
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						placeholder: "رقم الحلقة",
						value: form.number,
						onChange: (event) => setForm({
							...form,
							number: event.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						placeholder: "العنوان",
						value: form.title,
						onChange: (event) => setForm({
							...form,
							title: event.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						className: "field min-h-20 py-2",
						placeholder: "الوصف",
						value: form.synopsis,
						onChange: (event) => setForm({
							...form,
							synopsis: event.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						placeholder: "صورة https",
						value: form.thumbnailUrl,
						onChange: (event) => setForm({
							...form,
							thumbnailUrl: event.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						placeholder: "المدة بالثواني",
						value: form.durationSeconds,
						onChange: (event) => setForm({
							...form,
							durationSeconds: event.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "field",
						value: form.seasonId,
						onChange: (event) => setForm({
							...form,
							seasonId: event.target.value
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "بدون موسم"
						}), data?.seasons.map((season) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: season.id,
							children: [
								season.number,
								" · ",
								season.title
							]
						}, season.id))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn btn-primary",
						type: "submit",
						children: "حفظ الحلقة"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2 text-sm",
				children: data?.episodes.map((episode) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "panel flex justify-between gap-2 p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						episode.number,
						". ",
						episode.title || "بدون عنوان",
						" · ",
						episode.origin
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-ghost",
						onClick: () => deleteAdminEpisode({ data: episode.id }).then(load),
						children: "حذف"
					})]
				}, episode.id))
			})
		]
	});
}
function SourceAdmin() {
	const [episodeId, setEpisodeId] = (0, import_react.useState)("");
	const [rows, setRows] = (0, import_react.useState)([]);
	const [form, setForm] = (0, import_react.useState)({
		providerName: "",
		sourceType: "mp4",
		playbackUrl: "",
		language: "",
		subtitlesLanguage: "",
		subtitleUrl: "",
		isOfficial: false,
		isActive: false,
		authorizationConfirmed: false
	});
	function load() {
		if (!episodeId) return;
		getAdminSources({ data: episodeId }).then(setRows).catch((error) => toast.error(error instanceof Error ? error.message : "Error"));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "لن يُحفظ مصدر بدون تأكيد صريح أن الترخيص متاح، ولن يُعرض للزوار إلا إذا كان موثّقاً ومفعّلاً وعلى نطاق مسموح."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field",
					placeholder: "معرّف الحلقة",
					value: episodeId,
					onChange: (event) => setEpisodeId(event.target.value)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "btn btn-primary",
					type: "button",
					onClick: load,
					children: "عرض"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "panel grid gap-2 p-4",
				onSubmit: (event) => {
					event.preventDefault();
					saveAdminSource({ data: {
						...form,
						episodeId
					} }).then(() => {
						toast.success("حُفظ المصدر");
						load();
					}).catch((error) => toast.error(error instanceof Error ? error.message : "Error"));
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						placeholder: "اسم المزود",
						value: form.providerName,
						onChange: (event) => setForm({
							...form,
							providerName: event.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "field",
						value: form.sourceType,
						onChange: (event) => setForm({
							...form,
							sourceType: event.target.value
						}),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "mp4",
								children: "mp4"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "hls",
								children: "hls"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "external",
								children: "رابط خارجي"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						placeholder: "https://",
						value: form.playbackUrl,
						onChange: (event) => setForm({
							...form,
							playbackUrl: event.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						placeholder: "لغة الصوت",
						value: form.language,
						onChange: (event) => setForm({
							...form,
							language: event.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						placeholder: "لغة الترجمة",
						value: form.subtitlesLanguage,
						onChange: (event) => setForm({
							...form,
							subtitlesLanguage: event.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						placeholder: "ملف ترجمة https",
						value: form.subtitleUrl,
						onChange: (event) => setForm({
							...form,
							subtitleUrl: event.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: form.isOfficial,
							onChange: (event) => setForm({
								...form,
								isOfficial: event.target.checked
							})
						}), " رسمي"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: form.isActive,
							onChange: (event) => setForm({
								...form,
								isActive: event.target.checked
							})
						}), " مفعّل"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-sm font-bold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: form.authorizationConfirmed,
							onChange: (event) => setForm({
								...form,
								authorizationConfirmed: event.target.checked
							})
						}), " أؤكد أن هذا المصدر مرخّص ومصرّح بتشغيله"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn btn-primary",
						type: "submit",
						children: "حفظ المصدر"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2 text-sm",
				children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "panel p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							row.providerName,
							" · ",
							row.sourceType,
							" · ",
							row.authorizationVerified ? "موثّق" : "غير موثّق",
							" · ",
							row.isActive ? "مفعّل" : "متوقف"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-muted",
							children: row.playbackUrl
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn btn-ghost mt-2",
							onClick: () => deleteAdminSource({ data: row.id }).then(load),
							children: "حذف"
						})
					]
				}, row.id))
			})
		]
	});
}
function SyncAdmin() {
	const [kind, setKind] = (0, import_react.useState)("trending");
	const [search, setSearch] = (0, import_react.useState)("");
	const [anilistId, setAnilistId] = (0, import_react.useState)("");
	const [report, setReport] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "panel space-y-3 p-4",
		onSubmit: (event) => {
			event.preventDefault();
			runAdminSync({ data: {
				kind,
				search,
				id: anilistId ? Number(anilistId) : void 0,
				page: 1
			} }).then((result) => setReport(`${result.ok ? "تم" : "غير مكتمل"} · نجح ${result.success} · فشل ${result.failure} · ${result.message}`)).catch((error) => toast.error(error instanceof Error ? error.message : "Error"));
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "المزامنة تجلب بيانات وصفية من AniList فقط. لا تُنشئ روابط تشغيل."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				className: "field",
				value: kind,
				onChange: (event) => setKind(event.target.value),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "trending",
						children: "رائج"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "popular",
						children: "شائع"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "season",
						children: "الموسم الحالي"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "movies",
						children: "أفلام"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "search",
						children: "بحث"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "id",
						children: "معرّف AniList"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "field",
				placeholder: "عبارة البحث",
				value: search,
				onChange: (event) => setSearch(event.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "field",
				placeholder: "AniList id",
				value: anilistId,
				onChange: (event) => setAnilistId(event.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "btn btn-primary",
				type: "submit",
				children: "مزامنة دفعة"
			}),
			report ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm",
				children: report
			}) : null
		]
	});
}
function UsersAdmin() {
	const [rows, setRows] = (0, import_react.useState)([]);
	function load() {
		getAdminUsers().then(setRows).catch((error) => toast.error(error instanceof Error ? error.message : "Error"));
	}
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "space-y-2 text-sm",
		children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "panel flex flex-wrap items-center justify-between gap-2 p-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
				row.displayName || row.name,
				" · ",
				row.email,
				" · ",
				row.role
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn btn-ghost",
					onClick: () => setAdminUserRole({ data: {
						userId: row.id,
						role: "suspended"
					} }).then(load),
					children: "إيقاف"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn btn-ghost",
					onClick: () => setAdminUserRole({ data: {
						userId: row.id,
						role: "user"
					} }).then(load),
					children: "تفعيل"
				})]
			})]
		}, row.id))
	});
}
function SettingsAdmin() {
	const [form, setForm] = (0, import_react.useState)({
		brandNameAr: "",
		brandNameEn: "",
		taglineAr: "",
		taglineEn: "",
		defaultLocale: "ar",
		syncBatchSize: 12,
		allowedDomains: "",
		recommendationsEnabled: true,
		continueWatchingEnabled: true,
		bilingualEnabled: true
	});
	(0, import_react.useEffect)(() => {
		getAdminSettings().then((settings) => setForm({
			brandNameAr: settings.brandNameAr,
			brandNameEn: settings.brandNameEn,
			taglineAr: settings.taglineAr,
			taglineEn: settings.taglineEn,
			defaultLocale: settings.defaultLocale,
			syncBatchSize: settings.syncBatchSize,
			allowedDomains: settings.allowedDomains.join("\n"),
			recommendationsEnabled: settings.recommendationsEnabled,
			continueWatchingEnabled: settings.continueWatchingEnabled,
			bilingualEnabled: settings.bilingualEnabled
		})).catch((error) => toast.error(error instanceof Error ? error.message : "Error"));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "panel grid gap-3 p-4",
		onSubmit: (event) => {
			event.preventDefault();
			saveAdminSettings({ data: form }).then(() => toast.success("حُفظت الإعدادات")).catch((error) => toast.error(error instanceof Error ? error.message : "Error"));
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "field",
				value: form.brandNameAr,
				onChange: (event) => setForm({
					...form,
					brandNameAr: event.target.value
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "field",
				value: form.brandNameEn,
				onChange: (event) => setForm({
					...form,
					brandNameEn: event.target.value
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "field",
				value: form.taglineAr,
				onChange: (event) => setForm({
					...form,
					taglineAr: event.target.value
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "field",
				value: form.taglineEn,
				onChange: (event) => setForm({
					...form,
					taglineEn: event.target.value
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				className: "field min-h-24 py-2",
				placeholder: "نطاقات التشغيل المسموحة، نطاق في كل سطر",
				value: form.allowedDomains,
				onChange: (event) => setForm({
					...form,
					allowedDomains: event.target.value
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "text-sm",
				children: ["حجم الدفعة", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field mt-1",
					type: "number",
					min: 1,
					max: 25,
					value: form.syncBatchSize,
					onChange: (event) => setForm({
						...form,
						syncBatchSize: Number(event.target.value)
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: form.recommendationsEnabled,
					onChange: (event) => setForm({
						...form,
						recommendationsEnabled: event.target.checked
					})
				}), " التوصيات"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: form.continueWatchingEnabled,
					onChange: (event) => setForm({
						...form,
						continueWatchingEnabled: event.target.checked
					})
				}), " متابعة المشاهدة"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: form.bilingualEnabled,
					onChange: (event) => setForm({
						...form,
						bilingualEnabled: event.target.checked
					})
				}), " الواجهة ثنائية اللغة"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "btn btn-primary",
				type: "submit",
				children: "حفظ الإعدادات"
			})
		]
	});
}
//#endregion
export { AdminPage as component };
