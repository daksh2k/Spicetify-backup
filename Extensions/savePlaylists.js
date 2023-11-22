// @ts-check

// NAME: Save Playlists
// AUTHOR: daksh2k
// DESCRIPTION: Save any playlist by right click > Save Playlist

/// <reference path="../shared/types/spicetify.d.ts" />

(function savePlaylists() {
    if (!(Spicetify.CosmosAsync && Spicetify.ContextMenu)) {
        setTimeout(savePlaylists, 200);
        return;
    }

    const LOCALE = "en-IN"; //Set your own locale to change format of date `language-Country`
    const OPTIONS = { day: "numeric", month: "short", year: "numeric" }; // Set the date format to save in title

    // Add option to Context Menu
    new Spicetify.ContextMenu.Item(
        "Save Playlist",
        fetchAndCreate,
        uriPlaylist,
        `<svg role="img" height="16" width="16" viewBox="0 0 512 512" fill="currentColor"><path d="M8 224h272a8 8 0 0 0 8-8v-16a8 8 0 0 0-8-8H8a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8zm152 104a8 8 0 0 0-8-8H8a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h144a8 8 0 0 0 8-8zM8 96h272a8 8 0 0 0 8-8V72a8 8 0 0 0-8-8H8a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8zM470 1.64l-96.59 31.88C360.72 37.74 352 50 352 64v312.13C331.66 361.28 303.38 352 272 352c-61.86 0-112 35.82-112 80s50.14 80 112 80 112-35.82 112-80V192l106.12-35.37A32 32 0 0 0 512 126.27V32a32 32 0 0 0-42-30.36zM272 480c-47.14 0-80-25.3-80-48s32.86-48 80-48 80 25.3 80 48-32.86 48-80 48zm208-353.72l-96 32V64h-.56v-.13L480 32z"></path></svg>`
    ).register();

    /**
     * Convert image from a URL to base64 format
     * @param src The src URL of the image to encode ot base64
     * @param outputFormat The output format of the image as supported by Canvas API
     */
    function encodeImgFromUrl(src, outputFormat = "image/jpeg") {
        return new Promise((resolve, reject) => {
            let image = new Image();
            image.crossOrigin = "Anonymous";
            image.onload = function () {
                let canvas = document.createElement("canvas");
                let ctx = canvas.getContext("2d");
                let dataURL;
                // @ts-ignore
                canvas.height = this.naturalHeight;
                // @ts-ignore
                canvas.width = this.naturalWidth;
                // @ts-ignore
                ctx?.drawImage(this, 0, 0);
                dataURL = canvas.toDataURL(outputFormat);
                resolve(dataURL);
            };
            image.onerror = (err) => {
                reject(new Error("Failed to load image."+ err));
            };
            image.src = src;
        });
    }
    /**
     * Update the image of the new playlist created with the original playlist.
     * @param encodedImg base64 encoded jpeg image
     * @param playlistUri the uri of the newly created playlist
     */
    async function updatePlaylistImage(encodedImg, playlistUri) {
        let accessToken = await Spicetify.Platform.AuthorizationAPI._tokenProvider({ preferCached: true }).then((res) => res.accessToken);
        const URL = `https://api.spotify.com/v1/playlists/${playlistUri}/images`;

        await fetch(URL, {
            method: "PUT",
            body: encodedImg,
            headers: {
                Authorization: "Bearer " + accessToken,
                Accept: "application/json",
                "Content-Type": "image/jpeg",
            },
        });
    }
    // Only add context menu option to Playlists
    function uriPlaylist(uris) {
        if (uris.length > 1) {
            return false;
        }
        const uri = uris[0];
        const uriObj = Spicetify.URI.fromString(uri);
        return uriObj.type === Spicetify.URI.Type.PLAYLIST || uriObj.type === Spicetify.URI.Type.PLAYLIST_V2
    }

    function fetchAndCreate(uris) {
        fetchPlaylist(uris[0])
            .then((meta) => {
                createPlaylist(meta).catch((err) => {
                    Spicetify.showNotification("Error in Creating! Check Console.");
                    console.error("Creation Error: ", err);
                });
            })
            .catch((err) => {
                Spicetify.showNotification("Error in Fetching! Check Console.");
                console.error("Fetching Error: ", err);
            });
    }

    /**
     * Fetch the required metadata and tracks of the playlist
     */
    async function fetchPlaylist(uri) {
        Spicetify.showNotification("Fetching Playlist....");
        const playlistMeta = await Spicetify.CosmosAsync.get(`sp://core-playlist/v1/playlist/${uri}`);
        return { uris: playlistMeta.items.map((track) => track.link), data: playlistMeta.playlist };
    }

    // Create a new playlist
    async function createPlaylist(meta) {
        Spicetify.showNotification("Creating new Playlist....");
        let playlistDate = meta.data.lastModification ? new Date(meta.data.lastModification * 1000) : new Date();

        // @ts-ignore
        const playlistDateFormatted = playlistDate.toLocaleDateString(LOCALE, OPTIONS).replaceAll(" ", "-");
        const playlistName = `Copy- ${meta.data.name} (${playlistDateFormatted})`;

        const newPlaylist = await Spicetify.CosmosAsync.post("sp://core-playlist/v1/rootlist", {
            operation: "create",
            name: playlistName,
            playlist: true,
            public: false,
            uris: meta.uris,
        });
        Spicetify.showNotification(`${playlistName} created successfully!`);

        setTimeout(() => {
            Spicetify.CosmosAsync.put(`https://api.spotify.com/v1/playlists/${newPlaylist.uri.split(":")[2]}`, {
                description: `Copy of ${meta.data.name} by ${meta.data.owner.name}. ${meta.data.description}`,
            }).then(() => Spicetify.showNotification("Description updated successfully!"));
            if (/^spotify:image:\w{40}$|^https:\/\/.*$/.test(meta.data.picture)) {
                const imageUrl = meta.data.picture.startsWith("https://")
                    ? meta.data.picture
                    : "https://i.scdn.co/image/" + meta.data.picture.split(":")[2];
                encodeImgFromUrl(imageUrl)
                    .then((encodedImg) => {
                        updatePlaylistImage(encodedImg.split("base64,")[1], newPlaylist.uri.split(":")[2])
                            .then(() => Spicetify.showNotification("Image updated successfully!"))
                            .catch((err) => console.error("Image Update Error: ", err));
                    })
                    .catch((err) => console.error("Image conversion: ", err));
            }
        }, 1200);
    }
})();
