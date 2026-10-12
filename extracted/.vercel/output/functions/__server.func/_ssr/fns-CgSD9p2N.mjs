import { i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { r as readCatalogSearch, t as authMiddleware } from "./search-params-B3Zy_7CL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fns-CgSD9p2N.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getHome_createServerFn_handler = createServerRpc({
	id: "3e28fadac4cf20033ced64c7e3b7e6b0c886bd55045cd9bbdd37343f5f54d6b1",
	name: "getHome",
	filename: "src/lib/anime/fns.ts"
}, (opts) => getHome.__executeServer(opts));
var getHome = createServerFn({ method: "GET" }).handler(getHome_createServerFn_handler, async () => {
	const { loadHome } = await import("./repo.server-wmjKsdSa.mjs");
	return loadHome();
});
var getCatalog_createServerFn_handler = createServerRpc({
	id: "52b65126ece0d5044bb565dbc1b150108b4d156f5f9fa677cfa08e173138cdfe",
	name: "getCatalog",
	filename: "src/lib/anime/fns.ts"
}, (opts) => getCatalog.__executeServer(opts));
var getCatalog = createServerFn({ method: "GET" }).validator((input) => {
	const search = readCatalogSearch(input && typeof input === "object" ? input : {});
	return {
		...search,
		year: search.year ? Number(search.year) : null
	};
}).handler(getCatalog_createServerFn_handler, async ({ data }) => {
	const { loadCatalog } = await import("./repo.server-wmjKsdSa.mjs");
	return loadCatalog({
		q: data.q,
		genre: data.genre,
		year: data.year,
		format: data.format,
		status: data.status,
		sort: data.sort,
		page: data.page,
		audio: data.audio
	});
});
var getAnime_createServerFn_handler = createServerRpc({
	id: "4978ee8ce289138ac23246824287983bbb8a196992e01b88beddf43033edbd4b",
	name: "getAnime",
	filename: "src/lib/anime/fns.ts"
}, (opts) => getAnime.__executeServer(opts));
var getAnime = createServerFn({ method: "GET" }).validator((slug) => slug.trim().slice(0, 140)).handler(getAnime_createServerFn_handler, async ({ data }) => {
	const { loadAnime } = await import("./repo.server-wmjKsdSa.mjs");
	return loadAnime(data);
});
var getEpisode_createServerFn_handler = createServerRpc({
	id: "500ae620ba208a4f2041929260def2013fd9250d50ce0100d2671156934245cf",
	name: "getEpisode",
	filename: "src/lib/anime/fns.ts"
}, (opts) => getEpisode.__executeServer(opts));
var getEpisode = createServerFn({ method: "GET" }).validator((input) => ({
	slug: input.slug.trim().slice(0, 140),
	number: Math.floor(Number(input.number))
})).handler(getEpisode_createServerFn_handler, async ({ data }) => {
	if (!Number.isFinite(data.number) || data.number < 1) return null;
	const { loadEpisode } = await import("./repo.server-wmjKsdSa.mjs");
	return loadEpisode(data.slug, data.number);
});
var getMyProfile_createServerFn_handler = createServerRpc({
	id: "7e0e1634c52e8f3653bb30cb324a50d7a7826e63ed7f8f6708abdc808f8575b3",
	name: "getMyProfile",
	filename: "src/lib/anime/fns.ts"
}, (opts) => getMyProfile.__executeServer(opts));
var getMyProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMyProfile_createServerFn_handler, async ({ context }) => {
	const { profileFor } = await import("./mutations.server-B4QV7_zw.mjs");
	return profileFor(context.userId);
});
var claimPreviewAdmin_createServerFn_handler = createServerRpc({
	id: "e765123f477d958165128e3dfdf5e24a80335fd0be6e7bb0798af443fc336af3",
	name: "claimPreviewAdmin",
	filename: "src/lib/anime/fns.ts"
}, (opts) => claimPreviewAdmin.__executeServer(opts));
var claimPreviewAdmin = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(claimPreviewAdmin_createServerFn_handler, async ({ context }) => {
	const { claimPreviewAdmin: claim } = await import("./mutations.server-B4QV7_zw.mjs");
	return claim(context.userId);
});
var updateProfile_createServerFn_handler = createServerRpc({
	id: "293e656833b0f02ad51a208c18d81c360897043d8354f9a2d556f1f0fb41d2e7",
	name: "updateProfile",
	filename: "src/lib/anime/fns.ts"
}, (opts) => updateProfile.__executeServer(opts));
var updateProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(updateProfile_createServerFn_handler, async ({ data, context }) => {
	const { updateProfile: save } = await import("./mutations.server-B4QV7_zw.mjs");
	return save(context.userId, data);
});
var getLibrary_createServerFn_handler = createServerRpc({
	id: "1228d0cbc1e8be2dbd6390eeb1788679bda38086b24412f973b866b6ce709fb7",
	name: "getLibrary",
	filename: "src/lib/anime/fns.ts"
}, (opts) => getLibrary.__executeServer(opts));
var getLibrary = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getLibrary_createServerFn_handler, async ({ context }) => {
	const { loadLibrary } = await import("./mutations.server-B4QV7_zw.mjs");
	return loadLibrary(context.userId);
});
var getMembership_createServerFn_handler = createServerRpc({
	id: "932f3ed8d7dd4db055410cc3a71abec97242a3564975117f847a95d07dc1cdd4",
	name: "getMembership",
	filename: "src/lib/anime/fns.ts"
}, (opts) => getMembership.__executeServer(opts));
var getMembership = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMembership_createServerFn_handler, async ({ context }) => {
	const { membership } = await import("./mutations.server-B4QV7_zw.mjs");
	return membership(context.userId);
});
var toggleFavorite_createServerFn_handler = createServerRpc({
	id: "eee0dbd3c108f2cf7ef7de0e90b40a6c2a642dea03a209ee69c155faa6e30bd2",
	name: "toggleFavorite",
	filename: "src/lib/anime/fns.ts"
}, (opts) => toggleFavorite.__executeServer(opts));
var toggleFavorite = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((animeId) => animeId).handler(toggleFavorite_createServerFn_handler, async ({ data, context }) => {
	const { toggleFavorite: toggle } = await import("./mutations.server-B4QV7_zw.mjs");
	return toggle(context.userId, data);
});
var toggleWatchlist_createServerFn_handler = createServerRpc({
	id: "373028a7b926c54cc7fce37c8348ffd05ba4b96bfa6683938e39d17e7a2d484b",
	name: "toggleWatchlist",
	filename: "src/lib/anime/fns.ts"
}, (opts) => toggleWatchlist.__executeServer(opts));
var toggleWatchlist = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((animeId) => animeId).handler(toggleWatchlist_createServerFn_handler, async ({ data, context }) => {
	const { toggleWatchlist: toggle } = await import("./mutations.server-B4QV7_zw.mjs");
	return toggle(context.userId, data);
});
var saveProgress_createServerFn_handler = createServerRpc({
	id: "4ab8b16f4698d53d23394f7e5d159877fc5e6e11f3adf1f56ec94e06c2c043a0",
	name: "saveProgress",
	filename: "src/lib/anime/fns.ts"
}, (opts) => saveProgress.__executeServer(opts));
var saveProgress = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(saveProgress_createServerFn_handler, async ({ data, context }) => {
	const { saveProgress: save } = await import("./mutations.server-B4QV7_zw.mjs");
	return save(context.userId, data.episodeId, Number(data.seconds), Boolean(data.completed));
});
var getProgress_createServerFn_handler = createServerRpc({
	id: "e03a0197f2ca595386361d7a832d03df86ce43f74312451398f908bda06d2870",
	name: "getProgress",
	filename: "src/lib/anime/fns.ts"
}, (opts) => getProgress.__executeServer(opts));
var getProgress = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((episodeId) => episodeId).handler(getProgress_createServerFn_handler, async ({ data, context }) => {
	const { progressFor } = await import("./mutations.server-B4QV7_zw.mjs");
	return progressFor(context.userId, data);
});
var getRecommendations_createServerFn_handler = createServerRpc({
	id: "fd33e7bdc51106ccdbfe147acc6a4ddbb879e31bb9e4de9af6676183e95b4d57",
	name: "getRecommendations",
	filename: "src/lib/anime/fns.ts"
}, (opts) => getRecommendations.__executeServer(opts));
var getRecommendations = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getRecommendations_createServerFn_handler, async ({ context }) => {
	const { recommendations } = await import("./mutations.server-B4QV7_zw.mjs");
	return recommendations(context.userId);
});
var submitContact_createServerFn_handler = createServerRpc({
	id: "e5ad8d21fd4c1dbfe798c5fcaeb7d44e9eb94ead56c2cb971c280d5bd64bf84b",
	name: "submitContact",
	filename: "src/lib/anime/fns.ts"
}, (opts) => submitContact.__executeServer(opts));
var submitContact = createServerFn({ method: "POST" }).validator((input) => input).handler(submitContact_createServerFn_handler, async ({ data }) => {
	const { submitContact: send } = await import("./mutations.server-B4QV7_zw.mjs");
	return send(data);
});
async function admin(userId, run) {
	const { profileFor } = await import("./mutations.server-B4QV7_zw.mjs");
	if ((await profileFor(userId)).role !== "admin") throw new Error("Forbidden");
	return run(userId);
}
var getAdminOverview_createServerFn_handler = createServerRpc({
	id: "e97aceacc74d4aef481979a073b24b46da4f1043f81c68df9966240d4bd0b376",
	name: "getAdminOverview",
	filename: "src/lib/anime/fns.ts"
}, (opts) => getAdminOverview.__executeServer(opts));
var getAdminOverview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getAdminOverview_createServerFn_handler, async ({ context }) => {
	const { adminOverview } = await import("./repo.server-wmjKsdSa.mjs");
	return admin(context.userId, () => adminOverview());
});
var getAdminSettings_createServerFn_handler = createServerRpc({
	id: "fc87c4a39822d6ade7cde39d34374975614690ad8cb3c58986d20db7ebb4e706",
	name: "getAdminSettings",
	filename: "src/lib/anime/fns.ts"
}, (opts) => getAdminSettings.__executeServer(opts));
var getAdminSettings = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getAdminSettings_createServerFn_handler, async ({ context }) => admin(context.userId, async () => {
	const { getSql } = await import("./db-D23WWzhe.mjs").then((n) => n.n).then((n) => n.n);
	const { readSettings } = await import("./repo.server-wmjKsdSa.mjs");
	return readSettings(await getSql());
}));
var saveAdminSettings_createServerFn_handler = createServerRpc({
	id: "392df5fc128209806ad865f9dc0f86543e967afd5f534cc41fa55b133eca7ba2",
	name: "saveAdminSettings",
	filename: "src/lib/anime/fns.ts"
}, (opts) => saveAdminSettings.__executeServer(opts));
var saveAdminSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(saveAdminSettings_createServerFn_handler, async ({ data, context }) => {
	const { saveSettings } = await import("./mutations.server-B4QV7_zw.mjs");
	return admin(context.userId, (id) => saveSettings(id, data));
});
var getAdminAnime_createServerFn_handler = createServerRpc({
	id: "89576efd05927e10fe2afe83686ad4c131f87e7d8b2999f03faff62347a64dc0",
	name: "getAdminAnime",
	filename: "src/lib/anime/fns.ts"
}, (opts) => getAdminAnime.__executeServer(opts));
var getAdminAnime = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((q) => (q ?? "").slice(0, 80)).handler(getAdminAnime_createServerFn_handler, async ({ data, context }) => {
	const { adminAnimePage } = await import("./mutations.server-B4QV7_zw.mjs");
	return admin(context.userId, () => adminAnimePage(data));
});
var saveAdminAnime_createServerFn_handler = createServerRpc({
	id: "778754704dacff50f98193aaaa169ffbb398f29699adfd5ace43f0e00b5d6a88",
	name: "saveAdminAnime",
	filename: "src/lib/anime/fns.ts"
}, (opts) => saveAdminAnime.__executeServer(opts));
var saveAdminAnime = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(saveAdminAnime_createServerFn_handler, async ({ data, context }) => {
	const { saveAnime } = await import("./mutations.server-B4QV7_zw.mjs");
	return admin(context.userId, (id) => saveAnime(id, data));
});
var deleteAdminAnime_createServerFn_handler = createServerRpc({
	id: "7f1945153b8d3ebf296f01ae499131c5cf6f93a3074bfe89e579da00c0330533",
	name: "deleteAdminAnime",
	filename: "src/lib/anime/fns.ts"
}, (opts) => deleteAdminAnime.__executeServer(opts));
var deleteAdminAnime = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(deleteAdminAnime_createServerFn_handler, async ({ data, context }) => {
	const { deleteAnime } = await import("./mutations.server-B4QV7_zw.mjs");
	return admin(context.userId, (adminId) => deleteAnime(adminId, data));
});
var getAdminEpisodes_createServerFn_handler = createServerRpc({
	id: "fc4555772a38b85464cf1977a7ff4e9c9021c46884647c05b7baa3c3117d0ec3",
	name: "getAdminEpisodes",
	filename: "src/lib/anime/fns.ts"
}, (opts) => getAdminEpisodes.__executeServer(opts));
var getAdminEpisodes = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((animeId) => animeId).handler(getAdminEpisodes_createServerFn_handler, async ({ data, context }) => {
	const { adminEpisodes } = await import("./mutations.server-B4QV7_zw.mjs");
	return admin(context.userId, () => adminEpisodes(data));
});
var saveAdminEpisode_createServerFn_handler = createServerRpc({
	id: "5b49d2d3361ed98d6ec97c786eae50b12c987f7c942555dea7a9990d138454e3",
	name: "saveAdminEpisode",
	filename: "src/lib/anime/fns.ts"
}, (opts) => saveAdminEpisode.__executeServer(opts));
var saveAdminEpisode = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(saveAdminEpisode_createServerFn_handler, async ({ data, context }) => {
	const { saveEpisode } = await import("./mutations.server-B4QV7_zw.mjs");
	return admin(context.userId, (id) => saveEpisode(id, data));
});
var deleteAdminEpisode_createServerFn_handler = createServerRpc({
	id: "f75da07b51f525d73fd99bf4decb0a3a4737363bff6952c5cac439598af8034b",
	name: "deleteAdminEpisode",
	filename: "src/lib/anime/fns.ts"
}, (opts) => deleteAdminEpisode.__executeServer(opts));
var deleteAdminEpisode = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(deleteAdminEpisode_createServerFn_handler, async ({ data, context }) => {
	const { deleteEpisode } = await import("./mutations.server-B4QV7_zw.mjs");
	return admin(context.userId, (adminId) => deleteEpisode(adminId, data));
});
var getAdminSources_createServerFn_handler = createServerRpc({
	id: "9dd5349aa031f4759ff385d441bc12aad1e9e4e2ec7933d1af8eed97627a7c09",
	name: "getAdminSources",
	filename: "src/lib/anime/fns.ts"
}, (opts) => getAdminSources.__executeServer(opts));
var getAdminSources = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((episodeId) => episodeId).handler(getAdminSources_createServerFn_handler, async ({ data, context }) => {
	const { adminSources } = await import("./mutations.server-B4QV7_zw.mjs");
	return admin(context.userId, () => adminSources(data));
});
var saveAdminSource_createServerFn_handler = createServerRpc({
	id: "1c080650b687a464249b9f767eba2315aa991c488bbcc5e62cabc65dc841922e",
	name: "saveAdminSource",
	filename: "src/lib/anime/fns.ts"
}, (opts) => saveAdminSource.__executeServer(opts));
var saveAdminSource = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(saveAdminSource_createServerFn_handler, async ({ data, context }) => {
	const { saveSource } = await import("./mutations.server-B4QV7_zw.mjs");
	return admin(context.userId, (id) => saveSource(id, data));
});
var deleteAdminSource_createServerFn_handler = createServerRpc({
	id: "43f7f9039ede65d50f9abce430f2589af6551cfac847014b5027907827eae6d5",
	name: "deleteAdminSource",
	filename: "src/lib/anime/fns.ts"
}, (opts) => deleteAdminSource.__executeServer(opts));
var deleteAdminSource = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(deleteAdminSource_createServerFn_handler, async ({ data, context }) => {
	const { deleteSource } = await import("./mutations.server-B4QV7_zw.mjs");
	return admin(context.userId, (adminId) => deleteSource(adminId, data));
});
var runAdminSync_createServerFn_handler = createServerRpc({
	id: "af8ad984814aa8f65ea7674f52f7593268b4f4360815ac7a4251ab3808c8b557",
	name: "runAdminSync",
	filename: "src/lib/anime/fns.ts"
}, (opts) => runAdminSync.__executeServer(opts));
var runAdminSync = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(runAdminSync_createServerFn_handler, async ({ data, context }) => {
	const { runSync } = await import("./mutations.server-B4QV7_zw.mjs");
	return admin(context.userId, (id) => runSync(id, data));
});
var getAdminUsers_createServerFn_handler = createServerRpc({
	id: "a2172e7b6fb407a8669a11a2c471b9991bde8ad9eb13633a3b3fcb7e36fc7b01",
	name: "getAdminUsers",
	filename: "src/lib/anime/fns.ts"
}, (opts) => getAdminUsers.__executeServer(opts));
var getAdminUsers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getAdminUsers_createServerFn_handler, async ({ context }) => {
	const { listUsers } = await import("./mutations.server-B4QV7_zw.mjs");
	return admin(context.userId, () => listUsers());
});
var setAdminUserRole_createServerFn_handler = createServerRpc({
	id: "ffa63eb303281abb75a7b8f6eb0ff9216c91ea6214b7ebac96bf5e513f6bf054",
	name: "setAdminUserRole",
	filename: "src/lib/anime/fns.ts"
}, (opts) => setAdminUserRole.__executeServer(opts));
var setAdminUserRole = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(setAdminUserRole_createServerFn_handler, async ({ data, context }) => {
	const { setUserRole } = await import("./mutations.server-B4QV7_zw.mjs");
	return admin(context.userId, (id) => setUserRole(id, data.userId, data.role));
});
//#endregion
export { claimPreviewAdmin_createServerFn_handler, deleteAdminAnime_createServerFn_handler, deleteAdminEpisode_createServerFn_handler, deleteAdminSource_createServerFn_handler, getAdminAnime_createServerFn_handler, getAdminEpisodes_createServerFn_handler, getAdminOverview_createServerFn_handler, getAdminSettings_createServerFn_handler, getAdminSources_createServerFn_handler, getAdminUsers_createServerFn_handler, getAnime_createServerFn_handler, getCatalog_createServerFn_handler, getEpisode_createServerFn_handler, getHome_createServerFn_handler, getLibrary_createServerFn_handler, getMembership_createServerFn_handler, getMyProfile_createServerFn_handler, getProgress_createServerFn_handler, getRecommendations_createServerFn_handler, runAdminSync_createServerFn_handler, saveAdminAnime_createServerFn_handler, saveAdminEpisode_createServerFn_handler, saveAdminSettings_createServerFn_handler, saveAdminSource_createServerFn_handler, saveProgress_createServerFn_handler, setAdminUserRole_createServerFn_handler, submitContact_createServerFn_handler, toggleFavorite_createServerFn_handler, toggleWatchlist_createServerFn_handler, updateProfile_createServerFn_handler };
