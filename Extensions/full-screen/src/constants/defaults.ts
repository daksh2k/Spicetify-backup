import { Config } from "../types/fullscreen";

export const DEFAULTS: Config = {
    tv: {
        lyricsDisplay: true,
        lyricsAlignment: "right",
        autoHideLyrics: true,
        animationTempo: 0.2,
        progressBarDisplay: "never",
        playerControls: "never",
        trimTitle: true,
        trimTitleUpNext: true,
        showAlbum: "date",
        showAllArtists: true,
        icons: true,
        titleMovingIcon: false,
        enableFade: true,
        enableFullscreen: true,
        backgroundChoice: "artist_art",
        extraControls: "never",
        upnextDisplay: true,
        contextDisplay: "always",
        volumeDisplay: "smart",
        themedButtons: true,
        themedIcons: true,
        invertColors: "never",
        backAnimationTime: 0.4,
        animationSpeed: 0.25,
        upNextAnim: "sp",
        upnextTimeToShow: 45,
        coloredBackChoice: "DESATURATED",
        staticBackChoice: "#787878",
        blurSize: 0,
        backgroundBrightness: 0.4,
        showRemainingTime: false,
        verticalMonitorSupport: false,
        sidebarQueue: true,
    },
    def: {
        lyricsDisplay: true,
        lyricsAlignment: "right",
        autoHideLyrics: true,
        animationTempo: 0.2,
        progressBarDisplay: "always",
        playerControls: "always",
        trimTitle: true,
        trimTitleUpNext: true,
        showAlbum: "never",
        showAllArtists: true,
        icons: false,
        titleMovingIcon: false,
        enableFade: true,
        enableFullscreen: true,
        backgroundChoice: "album_art",
        extraControls: "always",
        upnextDisplay: true,
        contextDisplay: "mousemove",
        volumeDisplay: "smart",
        themedButtons: true,
        themedIcons: false,
        invertColors: "never",
        backAnimationTime: 1,
        animationSpeed: 0.25,
        upNextAnim: "sp",
        upnextTimeToShow: 30,
        coloredBackChoice: "DESATURATED",
        staticBackChoice: "#787878",
        blurSize: 32,
        backgroundBrightness: 0.7,
        showRemainingTime: false,
        verticalMonitorSupport: true,
        sidebarQueue: true,
    },
    tvMode: false,
    locale: "en-US",
    fsHideOriginal: false,
    autoLaunch: "never",
    activationTypes: "both",
    buttonActivation: "both",
    keyActivation: "both",
};
