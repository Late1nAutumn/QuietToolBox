// #region original
const fullAppDetailSample = {
  type: "game",
  name: "Portal",
  steam_appid: 400,
  required_age: "17",
  // is_free: true,
  // controller_support: "full",
  // dlc: [323170, 2012840],
  // detailed_description:
  //   "Portal™ is a new single player game from Valve. Set in the mysterious Aperture Science Laboratories, Portal has been called one of the most innovative new games on the horizon and will offer gamers hours of unique gameplay.<br />\r\n\t\t\t\t\tThe game is designed to change the way players approach, manipulate, and surmise the possibilities in a given environment; similar to how Half-Life® 2's Gravity Gun innovated new ways to leverage an object in any given situation.<br />\r\n\t\t\t\t\tPlayers must solve physical puzzles and challenges by opening portals to maneuvering objects, and themselves, through space.",
  // about_the_game:
  //   "Portal™ is a new single player game from Valve. Set in the mysterious Aperture Science Laboratories, Portal has been called one of the most innovative new games on the horizon and will offer gamers hours of unique gameplay.<br />\r\n\t\t\t\t\tThe game is designed to change the way players approach, manipulate, and surmise the possibilities in a given environment; similar to how Half-Life® 2's Gravity Gun innovated new ways to leverage an object in any given situation.<br />\r\n\t\t\t\t\tPlayers must solve physical puzzles and challenges by opening portals to maneuvering objects, and themselves, through space.",
  // short_description:
  //   "Portal™ is a new single player game from Valve. Set in the mysterious Aperture Science Laboratories, Portal has been called one of the most innovative new games on the horizon and will offer gamers hours of unique gameplay.",
  // supported_languages:
  //   "English<strong>*</strong>, French<strong>*</strong>, German<strong>*</strong>, Russian<strong>*</strong>, Danish, Dutch, Finnish, Italian, Japanese, Norwegian, Polish, Portuguese - Portugal, Simplified Chinese, Spanish - Spain<strong>*</strong>, Swedish, Traditional Chinese<strong>*</strong>, Korean, Bulgarian, Czech, Greek, Hungarian, Portuguese - Brazil, Romanian, Spanish - Latin America, Thai, Turkish, Ukrainian<br><strong>*</strong>languages with full audio support",
  // header_image:
  //   "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/400/header.jpg?t=1738796058",
  // capsule_image:
  //   "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/400/capsule_231x87.jpg?t=1738796058",
  // capsule_imagev5:
  //   "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/400/capsule_184x69.jpg?t=1738796058",
  // website: "http://www.whatistheorangebox.com/",
  // pc_requirements: {
  //   minimum:
  //     "\n\t\t\t<p><strong>Minimum: </strong>1.7 GHz Processor, 512MB RAM, DirectX&reg; 8.1 level Graphics Card (Requires support for SSE), Windows&reg; 7 (32/64-bit)/Vista/XP, Mouse, Keyboard, Internet Connection</p>\n\t\t\t<p><strong>Recommended: </strong>Pentium 4 processor (3.0GHz, or better), 1GB RAM, DirectX&reg; 9 level Graphics Card, Windows&reg; 7 (32/64-bit)/Vista/XP, Mouse, Keyboard, Internet Connection</p>\n\t\t\t",
  // },
  // mac_requirements: {
  //   minimum:
  //     "<strong>Minimum: </strong>OS X version Leopard 10.5.8, Snow Leopard 10.6.3, 1GB RAM, NVIDIA GeForce 8 or higher, ATI X1600 or higher, or Intel HD 3000 or higher Mouse, Keyboard, Internet Connection",
  // },
  // linux_requirements: [],
  // developers: ["Valve"],
  // publishers: ["Valve"],
  // demos: [
  //   {
  //     appid: 410,
  //     description: "",
  //   },
  // ],
  price_overview: {
    currency: "USD",
    initial: 999,
    final: 999,
    discount_percent: 0,
    initial_formatted: "",
    final_formatted: "$9.99",
  },
  // packages: [515, 204527, 469],
  // package_groups: [
  //   {
  //     name: "default",
  //     title: "Buy Portal",
  //     description: "",
  //     selection_text: "Select a purchase option",
  //     save_text: "",
  //     display_type: 0,
  //     is_recurring_subscription: "false",
  //     subs: [
  //       {
  //         packageid: 515,
  //         percent_savings_text: " ",
  //         percent_savings: 0,
  //         option_text: "Portal - $9.99",
  //         option_description: "",
  //         can_get_free_license: "0",
  //         is_free_license: false,
  //         price_in_cents_with_discount: 999,
  //       },
  //       {
  //         packageid: 204527,
  //         percent_savings_text: " ",
  //         percent_savings: 0,
  //         option_text: "Portal - Commercial License - $9.99",
  //         option_description: "",
  //         can_get_free_license: "0",
  //         is_free_license: false,
  //         price_in_cents_with_discount: 999,
  //       },
  //       {
  //         packageid: 469,
  //         percent_savings_text: " ",
  //         percent_savings: 0,
  //         option_text: "The Orange Box - $19.99",
  //         option_description: "",
  //         can_get_free_license: "0",
  //         is_free_license: false,
  //         price_in_cents_with_discount: 1999,
  //       },
  //     ],
  //   },
  // ],
  // platforms: {
  //   windows: true,
  //   mac: false,
  //   linux: true,
  // },
  // metacritic: {
  //   score: 90,
  //   url: "https://www.metacritic.com/game/pc/portal?ftag=MCD-06-10aaa1f",
  // },
  categories: [
    {
      id: 2,
      description: "Single-player",
    },
    {
      id: 22,
      description: "Steam Achievements",
    },
    {
      id: 28,
      description: "Full controller support",
    },
    {
      id: 13,
      description: "Captions available",
    },
    {
      id: 17,
      description: "Includes level editor",
    },
    {
      id: 16,
      description: "Includes Source SDK",
    },
    {
      id: 14,
      description: "Commentary available",
    },
    {
      id: 41,
      description: "Remote Play on Phone",
    },
    {
      id: 42,
      description: "Remote Play on Tablet",
    },
    {
      id: 62,
      description: "Family Sharing",
    },
  ],
  genres: [
    {
      id: "1",
      description: "Action",
    },
  ],
  // screenshots: [
  //   {
  //     id: 0,
  //     path_thumbnail:
  //       "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/400/0000002582.600x338.jpg?t=1738796058",
  //     path_full:
  //       "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/400/0000002582.1920x1080.jpg?t=1738796058",
  //   },
  //   {
  //     id: 1,
  //     path_thumbnail:
  //       "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/400/0000002583.600x338.jpg?t=1738796058",
  //     path_full:
  //       "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/400/0000002583.1920x1080.jpg?t=1738796058",
  //   },
  //   {
  //     id: 2,
  //     path_thumbnail:
  //       "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/400/0000002584.600x338.jpg?t=1738796058",
  //     path_full:
  //       "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/400/0000002584.1920x1080.jpg?t=1738796058",
  //   },
  //   {
  //     id: 3,
  //     path_thumbnail:
  //       "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/400/0000002585.600x338.jpg?t=1738796058",
  //     path_full:
  //       "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/400/0000002585.1920x1080.jpg?t=1738796058",
  //   },
  //   {
  //     id: 4,
  //     path_thumbnail:
  //       "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/400/0000002586.600x338.jpg?t=1738796058",
  //     path_full:
  //       "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/400/0000002586.1920x1080.jpg?t=1738796058",
  //   },
  //   {
  //     id: 5,
  //     path_thumbnail:
  //       "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/400/0000002587.600x338.jpg?t=1738796058",
  //     path_full:
  //       "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/400/0000002587.1920x1080.jpg?t=1738796058",
  //   },
  //   {
  //     id: 6,
  //     path_thumbnail:
  //       "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/400/0000002588.600x338.jpg?t=1738796058",
  //     path_full:
  //       "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/400/0000002588.1920x1080.jpg?t=1738796058",
  //   },
  //   {
  //     id: 7,
  //     path_thumbnail:
  //       "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/400/ss_25aa95176ac6319fad955b31554451f3ea61f1e8.600x338.jpg?t=1738796058",
  //     path_full:
  //       "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/400/ss_25aa95176ac6319fad955b31554451f3ea61f1e8.1920x1080.jpg?t=1738796058",
  //   },
  //   {
  //     id: 8,
  //     path_thumbnail:
  //       "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/400/ss_15c08be59046abbd785ab8e7e8857ba8633f292b.600x338.jpg?t=1738796058",
  //     path_full:
  //       "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/400/ss_15c08be59046abbd785ab8e7e8857ba8633f292b.1920x1080.jpg?t=1738796058",
  //   },
  //   {
  //     id: 9,
  //     path_thumbnail:
  //       "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/400/ss_5d9a2b799aaaa6f8992128c126e68b7e8d718715.600x338.jpg?t=1738796058",
  //     path_full:
  //       "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/400/ss_5d9a2b799aaaa6f8992128c126e68b7e8d718715.1920x1080.jpg?t=1738796058",
  //   },
  //   {
  //     id: 10,
  //     path_thumbnail:
  //       "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/400/ss_3164c436ce7708dcf0f46bb4569e7f7b83ccb01e.600x338.jpg?t=1738796058",
  //     path_full:
  //       "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/400/ss_3164c436ce7708dcf0f46bb4569e7f7b83ccb01e.1920x1080.jpg?t=1738796058",
  //   },
  // ],
  // movies: [
  //   {
  //     id: 922,
  //     name: "Portal Trailer",
  //     thumbnail:
  //       "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/922/movie.jpg?t=1682715059",
  //     webm: {
  //       480: "http://video.akamai.steamstatic.com/store_trailers/922/movie480.webm?t=1682715059",
  //       max: "http://video.akamai.steamstatic.com/store_trailers/922/movie_max.webm?t=1682715059",
  //     },
  //     mp4: {
  //       480: "http://video.akamai.steamstatic.com/store_trailers/922/movie480.mp4?t=1682715059",
  //       max: "http://video.akamai.steamstatic.com/store_trailers/922/movie_max.mp4?t=1682715059",
  //     },
  //     highlight: true,
  //   },
  // ],
  // recommendations: {
  //   total: 151293,
  // },
  achievements: {
    total: 15,
    highlighted: [
      {
        name: "Lab Rat",
        path: "https://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/400/portal_getportalguns.jpg",
      },
      {
        name: "Fratricide",
        path: "https://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/400/portal_kill_companioncube.jpg",
      },
      {
        name: "Partygoer",
        path: "https://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/400/portal_escape_testchambers.jpg",
      },
      {
        name: "Heartbreaker",
        path: "https://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/400/portal_beat_game.jpg",
      },
      {
        name: "Terminal Velocity",
        path: "https://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/400/portal_infinitefall.jpg",
      },
      {
        name: "Long Jump",
        path: "https://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/400/portal_longjump.jpg",
      },
      {
        name: "Cupcake",
        path: "https://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/400/portal_beat_2advancedmaps.jpg",
      },
      {
        name: "Fruitcake",
        path: "https://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/400/portal_beat_4advancedmaps.jpg",
      },
      {
        name: "Vanilla Crazy Cake",
        path: "https://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/400/portal_beat_6advancedmaps.jpg",
      },
      {
        name: "Basic Science",
        path: "https://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/400/portal_get_allbronze.jpg",
      },
    ],
  },
  release_date: {
    coming_soon: false,
    date: "Oct 10, 2007",
  },
  // support_info: {
  //   url: "http://steamcommunity.com/app/400",
  //   email: "",
  // },
  // background:
  //   "https://store.akamai.steamstatic.com/images/storepagebackground/app/400?t=1738796058",
  // background_raw:
  //   "https://store.akamai.steamstatic.com/images/storepagebackground/app/400?t=1738796058",
  // content_descriptors: {
  //   ids: [],
  //   notes: null,
  // },
  ratings: {
    usk: {
      rating: "12",
    },
    dejus: {
      rating: "10",
      descriptors: "Violência",
    },
    steam_germany: {
      rating_generated: "1",
      rating: "6",
      required_age: "6",
      banned: "0",
      use_age_gate: "0",
      descriptors: "Fantasy-Gewalt",
    },
  },
  // legal_notice: "World of Goo is copyright © 2008 of 2D Boy, LLC",
  // reviews:
  //   "<strong>&quot;Funny, endless, ridiculously good value.&quot;</strong> - PCGAMER",
  fullgame: {
    appid: "223850",
    name: "3DMark",
  },
  // ext_user_account_notice: "Arc (Supports Linking to Steam Account)",
  // drm_notice: "NONE<br>NO LIMIT machine activation limit",
};
// appids of where fields value from
const fullAppDetailSampleSourceApp = {
  type: 400,
  name: 400,
  steam_appid: 400,
  required_age: 55150,
  // is_free: 11020,
  // controller_support: 400,
  // dlc: 400,
  // detailed_description: 400,
  // about_the_game: 400,
  // short_description: 400,
  // supported_languages: 400,
  // header_image: 400,
  // capsule_image: 400,
  // capsule_imagev5: 400,
  // website: 400,
  // pc_requirements: 400,
  // mac_requirements: 400,
  // linux_requirements: 400,
  // developers: 400,
  // publishers: 400,
  // demos: 400,
  price_overview: 400,
  // packages: 400,
  // package_groups: 400,
  // platforms: 400,
  // metacritic: 400,
  categories: 400,
  genres: 400,
  // screenshots: 400,
  // movies: 400,
  // recommendations: 400,
  achievements: 400,
  release_date: 400,
  // support_info: 400,
  // background: 400,
  // background_raw: 400,
  // content_descriptors: 400,
  ratings: 400,
  // legal_notice: 22000,
  // reviews: 3590,
  fullgame: 231350,
  // ext_user_account_notice: 109600,
  // drm_notice: 265590,
};
// #endregion
