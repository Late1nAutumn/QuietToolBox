import { BUILDING, DYNASTY, TECH, VILLAGER_STAT } from "../aoe4/enum.js";
import { DATA_UNIT, HELP_PAGE_MODE, REPORT_SUBJECT } from "../enum.js";
import {
  APP_MISC_CONTEXT,
  FOOTER_BUTTON_CONTEXT,
  HINT_CONTEXT,
  LEGEND_CONTEXT,
  MODAL_CONTEXT,
  NOTIFICATION_CONTEXT,
  TOOLBAR_TITLE_CONTEXT,
  TOOLTIP_ICONS_CONTEXT,
  TRANSLATION_COLLECTION,
} from "./context.js";

const {
  HELP,
  HELP_MODE,
  TOOLBAR_TITLE,
  REPORT_SUBJECT_LABEL,
  DATA_UNIT_NAME,
  BUILDING_NAME,
  FARMER_STAT,
  FOOTER_BUTTON,
  MODAL,
  NOTIFICATION,
  HINT,
  TOOLTIP_BUILDING,
  TOOLTIP_TECH,
  TOOLTIP_DYNASTY,
  TOOLTIP_REPORT_SUBJECT,
  TOOLTIP_ICONS,
  APP_MISC,
  LEGEND,
} = TRANSLATION_COLLECTION;

const dataExplaination = (reportSubject) =>
  `${EN_PACK[REPORT_SUBJECT_LABEL][reportSubject]}: ${EN_PACK[TOOLTIP_REPORT_SUBJECT][reportSubject]}`;

export const EN_PACK = {
  [HELP_MODE]: {
    [HELP_PAGE_MODE.CONTROL]: "Control",
    [HELP_PAGE_MODE.GAME_SYSTEM]: "Game System",
    [HELP_PAGE_MODE.STATISTICS]: "Statistics",
  },
  [TOOLBAR_TITLE]: {
    [TOOLBAR_TITLE_CONTEXT.SUMMARY]: "Summary",
    [TOOLBAR_TITLE_CONTEXT.BUILDING]: "Buildings",
    [TOOLBAR_TITLE_CONTEXT.TECH]: "Techs",
    [TOOLBAR_TITLE_CONTEXT.INSIGHT]: "Insight",
  },
  [REPORT_SUBJECT_LABEL]: {
    // overview
    [REPORT_SUBJECT.TOTAL_RATE]: "Total food rate",
    [REPORT_SUBJECT.AVERAGE_RATE]: "Average rate per farmer",
    [REPORT_SUBJECT.CHUNKS_BUFFED]: "Total buffed",
    [REPORT_SUBJECT.TRIPLE_BUFFED]: "Triple buffed",
    [REPORT_SUBJECT.DOUBLE_BUFFED]: "Double buffed",
    [REPORT_SUBJECT.UNBUFFED_ACTIVE_CHUNK]: "Unbuffed chunk ratio",
    [REPORT_SUBJECT.AVERAGE_MOVE_DURATION]: "Average move duration",
    [REPORT_SUBJECT.AVERAGE_MOVE_RATIO]: "Average move duration ratio",
    // granary
    [REPORT_SUBJECT.BUFFED_FARM_COUNT]: "Farms in area",
    [REPORT_SUBJECT.BUFFED_CHUNK_COUNT]: "Affected chunks",
    [REPORT_SUBJECT.BUFFED_ACTIVE_CHUNK]: "Affected active chunks",
    [REPORT_SUBJECT.FARM_DROP_COUNT]: "Drop-off point for",
    [REPORT_SUBJECT.AVERAGE_DROPOFF_DISTANCE]: "Average distance to chunks",
    // farm
    [REPORT_SUBJECT.GATHER_RATE]: "Gather rate",
    [REPORT_SUBJECT.TOP_STACKS]: "Top buff stacks on chunk",
    [REPORT_SUBJECT.ACTIVE_CHUNKS]: "Active chunks",
    [REPORT_SUBJECT.TOTAL_MOVE_DISTANCE]: "Total move distance",
    [REPORT_SUBJECT.PERIOD]: "Total duration",
    [REPORT_SUBJECT.MOVE_DURATION]: "Total move duration",
    [REPORT_SUBJECT.MOVE_RATIO]: "Movement duration ratio",
  },
  [DATA_UNIT_NAME]: {
    [DATA_UNIT.SECOND]: "sec",
    [DATA_UNIT.PER_SECOND]: "/ sec",
    [DATA_UNIT.PER_MINUTE]: "/ min",
    [DATA_UNIT.PERCENTAGE]: "%",
    [DATA_UNIT.CHUNK]: "chunks",
    [DATA_UNIT.TILE]: "tiles",
    [DATA_UNIT.FARM]: "farms",
    [DATA_UNIT.TILE_PER_SECOND]: "tiles / sec",
  },
  [BUILDING_NAME]: {
    [BUILDING.GRANARY]: "Granary",
    [BUILDING.FARM]: "Farm",
    [BUILDING.MILL]: "Mill",
    [BUILDING.OTHER]: "Other",
  },
  [FARMER_STAT]: {
    [VILLAGER_STAT.GATHER_RATE]: "Gather rate",
    [VILLAGER_STAT.MOVE_SPEED]: "Move speed",
    [VILLAGER_STAT.CAPACITY]: "Capacity",
  },
  [FOOTER_BUTTON]: {
    [FOOTER_BUTTON_CONTEXT.AUTO_FILL]: "Auto fill",
    [FOOTER_BUTTON_CONTEXT.TOGGLE_GUIDELINE]: "Guideline",
    [FOOTER_BUTTON_CONTEXT.TOGGLE_GRID]: "Grid line",
    [FOOTER_BUTTON_CONTEXT.CENTER_VIEW]: "Center view",
    [FOOTER_BUTTON_CONTEXT.OPEN_HELP]: "Help",
  },
  [MODAL]: {
    [MODAL_CONTEXT.MODAL_TITLE_SAVE]: "Save Data",
    [MODAL_CONTEXT.MODAL_TITLE_LOAD]: "Load Data",
    [MODAL_CONTEXT.MODAL_TITLE_WIPE]: "Remove all buildings?",
    [MODAL_CONTEXT.MODAL_TITLE_HELP]: "Help",

    [MODAL_CONTEXT.MODAL_BODY_SAVE_WARNING]: "Overwritten saves will be lost.",
    [MODAL_CONTEXT.MODAL_BODY_SAVE_NAME_PLACEHOLDER]: "name your pattern",
    [MODAL_CONTEXT.MODAL_BODY_SAVE_LIST_PLACEHOLDER]: "Local save not found",
    [MODAL_CONTEXT.MODAL_BODY_SAVE_LOCAL_WARNING]:
      "All saves are stored locally.",
    [MODAL_CONTEXT.MODAL_BODY_LOAD_WARNING]:
      "Your current progress will be gone.",
    [MODAL_CONTEXT.MODAL_BODY_WIPE]: "Lost pattern can not be recovered",
  },
  [NOTIFICATION]: {
    [NOTIFICATION_CONTEXT.SAVE_INVALID_NAME]: "Invalid save name",
    [NOTIFICATION_CONTEXT.SAVE_SAVE]: "Pattern saved!",
    [NOTIFICATION_CONTEXT.SAVE_OVERWRITE]: "Pattern overwritten!",
    [NOTIFICATION_CONTEXT.LOAD_SAVE]: "Pattern loaded!",

    [NOTIFICATION_CONTEXT.BUILD_GRANARY_LIMIT]: "Granary count exceeded!",
    [NOTIFICATION_CONTEXT.BUILD_INVALID_POSITION]: "Invalid building position",
    [NOTIFICATION_CONTEXT.BUILD_WONDER]: "REALLY? A wonder? For what?",

    [NOTIFICATION_CONTEXT.AUTO_FILL_SUCCESS]: " farms auto filled!",
    [NOTIFICATION_CONTEXT.AUTO_FILL_FULL]: "All granaries fully occupied!",
    [NOTIFICATION_CONTEXT.AUTO_FILL_INVALID]: "Invalid pattern for auto fill",
  },
  [HINT]: {
    [HINT_CONTEXT.DEFAULT_HINT]: "Drag RMB to navigate. Mouse wheel to zoom.",
    [HINT_CONTEXT.BUILDING_HINT]: "Click LMB to build, RMB to quit building",
  },
  [TOOLTIP_BUILDING]: {
    [BUILDING.GRANARY]:
      "Granary: Villagers can drop off Food at this building. Improves the Farm gather rate of nearby Villagers by +10% (stacks with other Granaries). Generates tax each time a resource is dropped off.",
    [BUILDING.FARM]:
      "Farm: Harvestable Food source. Use a Villager to gather Food from the Farm. Only one Villager can work each Farm.",
    [BUILDING.MILL]:
      "Mill: Villagers can drop off Food at this building. Houses technologies to improve Food gathering. Generates tax each time a resource is dropped off.",
  },
  [TOOLTIP_TECH]: {
    [TECH.HORTICULTURE]:
      "Horticulture: Increase Villagers' gathering rate for Food by 10%. Does not apply to hunted meat.",
    [TECH.FERTILIZATION]:
      "Fertilization: Increase Villagers' gathering rate for Food by 10%. Does not apply to hunted meat.",
    [TECH.CROSSBREEDING]:
      "Precision Cross-Breeding: Increase Villagers' gathering rate for Food by 10%. Does not apply to hunted meat.",
    [TECH.WHEELBARROW]:
      "Wheelbarrow: Increase the carry capacity of Villagers by +5 and their movement speed by +15%.",
    [TECH.ANCIENTTECH]:
      "Ancient Techiniques: Increase the gathering rate of Villagers by +4% for each dynasty achieved.",
  },
  [TOOLTIP_DYNASTY]: {
    [DYNASTY.YUAN]:
      "Yuan Dynasty: Villagers, Officials and military units gain +15% speed.",
  },
  [TOOLTIP_REPORT_SUBJECT]: {
    // overview
    [REPORT_SUBJECT.TOTAL_RATE]: "Average food gathered per minute",
    [REPORT_SUBJECT.AVERAGE_RATE]: "Average food per second per villager",
    [REPORT_SUBJECT.CHUNKS_BUFFED]:
      "Number of active clunks buffed by granaries",
    [REPORT_SUBJECT.TRIPLE_BUFFED]:
      "Number of active clunks with 3 stacks of granary aura",
    [REPORT_SUBJECT.DOUBLE_BUFFED]:
      "Number of active clunks with 2 stacks of granary aura",
    [REPORT_SUBJECT.UNBUFFED_ACTIVE_CHUNK]: "Ratio of active chunks not buffed",
    [REPORT_SUBJECT.AVERAGE_MOVE_DURATION]:
      "Average move duration per villager per loop",
    [REPORT_SUBJECT.AVERAGE_MOVE_RATIO]:
      "Average move duration per villager per loop as percent of loop's total duration",
    // granary
    [REPORT_SUBJECT.BUFFED_FARM_COUNT]:
      "Number of farms with clunks buffed by this granary",
    [REPORT_SUBJECT.BUFFED_CHUNK_COUNT]:
      "Number of clunks buffed by this granary",
    [REPORT_SUBJECT.BUFFED_ACTIVE_CHUNK]:
      "Number of active clunks granary buffed in range",
    [REPORT_SUBJECT.FARM_DROP_COUNT]:
      "Nubmer of farms using this granary for drop-off",
    [REPORT_SUBJECT.AVERAGE_DROPOFF_DISTANCE]:
      "Average distance of active clunks to this granary as drop-off point",
    // farm
    [REPORT_SUBJECT.GATHER_RATE]: "Average food gathered per second",
    [REPORT_SUBJECT.TOP_STACKS]: "Top granary stacks on chunk in this farm",
    [REPORT_SUBJECT.ACTIVE_CHUNKS]: "Number of active clunks in this farm",
    [REPORT_SUBJECT.TOTAL_MOVE_DISTANCE]:
      "Distance the villager on this farm moved in a loop",
    [REPORT_SUBJECT.PERIOD]: "Duration of a loop of this farm",
    [REPORT_SUBJECT.MOVE_DURATION]: "Time spent moving on this farm per loop",
    [REPORT_SUBJECT.MOVE_RATIO]:
      "Proportion of move duration in total duration",
  },
  [TOOLTIP_ICONS]: {
    [TOOLTIP_ICONS_CONTEXT.DELETE_ALL]: "Wipe out all placed buildings",
    [TOOLTIP_ICONS_CONTEXT.DELETE_SELECTED]: "Remove this building",
    [TOOLTIP_ICONS_CONTEXT.BOOK]: "Learn more about data",
    [TOOLTIP_ICONS_CONTEXT.AUTO_FILL]: "Auto-fill farms within granarys' aura",
    [TOOLTIP_ICONS_CONTEXT.TOGGLE_GUIDELINE]: "Toggle guideline display",
    [TOOLTIP_ICONS_CONTEXT.TOGGLE_GRID]: "Toggle view grid display",
    [TOOLTIP_ICONS_CONTEXT.CENTER_VIEW]: "Center the view to buildings",
    [TOOLTIP_ICONS_CONTEXT.OPEN_HELP]: "Open help page",
  },
  [APP_MISC]: {
    [APP_MISC_CONTEXT.APP_TITLE]: "Granary\nSimulator",
    [APP_MISC_CONTEXT.INSIGHT_OTHER_BUIDLING]:
      "This worthless building deserves no attention",
    [APP_MISC_CONTEXT.BUTTON_SAVE]: "Save",
    [APP_MISC_CONTEXT.BUTTON_IMPORT]: "Import",
    [APP_MISC_CONTEXT.BUTTON_BACK]: "Back",
    [APP_MISC_CONTEXT.BUTTON_CONFIRM]: "Confirm",
    [APP_MISC_CONTEXT.BUTTON_CANCEL]: "Cancel",
  },
  [LEGEND]: {
    [LEGEND_CONTEXT.TIMEMAP_MOVEMENT]: "Movement",
    [LEGEND_CONTEXT.TIMEMAP_GATHER_WINDUP]: "Gather wind-up",
    [LEGEND_CONTEXT.TIMEMAP_GATHERING]: "Gathering",
    [LEGEND_CONTEXT.TIMEMAP_DROP_OFF]: "Drop-off",
  },
};

EN_PACK[HELP] = {
  [HELP_PAGE_MODE.CONTROL]: [
    {
      title: "View",
      list: [
        "Left-click building icons to inspect",
        ["Click on blank area to cancel selection"],
        "Hold right-click and drag to look around",
        "Scroll the mouse wheel to zoom by mouse position as center",
      ],
    },
    {
      title: "Sidebar",
      list: [
        "Click the skull icon to delete all or selected buildings",
        "Click building icons to start building",
        [
          "Red squares on buildings indicate placement conflict",
          "Left-click to place buildings, build mode won't exit automatically",
          "Right-click to quit building",
        ],
        "Click tech icons to toggle activation",
      ],
    },
    {
      title: "Footer",
      list: [
        EN_PACK[TOOLTIP_ICONS][TOOLTIP_ICONS_CONTEXT.AUTO_FILL],
        ["Disabled when any building is misaligned"],
        EN_PACK[TOOLTIP_ICONS][TOOLTIP_ICONS_CONTEXT.TOGGLE_GUIDELINE],
        EN_PACK[TOOLTIP_ICONS][TOOLTIP_ICONS_CONTEXT.TOGGLE_GRID],
        EN_PACK[TOOLTIP_ICONS][TOOLTIP_ICONS_CONTEXT.CENTER_VIEW],
        EN_PACK[TOOLTIP_ICONS][TOOLTIP_ICONS_CONTEXT.OPEN_HELP],
      ],
    },
  ],
  [HELP_PAGE_MODE.GAME_SYSTEM]: [
    {
      title: "Terminology",
      list: [
        "A chunk: One minor area villagers collect food on farms",
        "A turn: The process from dropping off resources to the next submission",
        "A loop: The process from the start of chunk gather to the next gather after its regrowth",
        "An active chunk: a chunk that will be gathered within a loop",
      ],
    },
    {
      title: "Knowing the Farm",
      list: [
        "Farms contain chunks in rows & columns, each with fixed food amount",
        [
          "Unlike most civs, Chinese farm is 4×4 with 7.5 food per chunk",
          "With wheelbarrow, villagers can carry exactly two chunks of food",
        ],
        "Chunks regrow only after being fully harvested",
        ["Chinese farm takes 30 seconds to regrow"],
      ],
    },
    {
      title: "Knowing the Granary",
      list: [
        "Granary aura boosts villagers, not the farm",
        [
          "Granary effect does not stick long enough even for starting the next chunk",
          "Thus calculations should be done based on chunks",
        ],
        "All tech stacks are additive calculated, while granary bonus is multiplied after techs added",
        [
          "Stacking granary aura or not does NOT affect total profit",
          "Granary pattern is to reduce farm cost and shortening drop-off trips",
        ],
      ],
    },
    {
      title: "Knowing Gathering Mechanics",
      list: ["This application is NOT simulating all the following rules"],
    },
    {
      list: [
        "Villagers have a short wind-up before gathering, but almost no wind-down",
        "After gathering the first chunk, villagers then go to the nearest chunk",
        [
          "Villagers may not choose the best chunk for drop-off",
          "On some maps, villagers prefer chunks on NW-SE orientation (cause unknown)",
        ],
        "",
        "Once capacity is full, villagers head to nearest drop-off point",
        "Submitting resources takes noticeable time",
        "After submitting, villagers heads to the closest gatherable chunk",
        "",
        "The following comes from observation:",
        [
          "Villagers stand at chunk center when gathering",
          "Base gather rate: 0.75/sec",
          "Chunk regrow duration: 30sec",
          "All tech stacks are additive",
          "Granary bonus is multiplied after tech additions done",
          "Drop-off time (approx.): 0.5sec",
          "Pre-gather wind-up (approx.): 0.25sec",
          "Granary aura range: 7.63 tiles (may vary, but won't affect calculation)",
          "Building edge gaps:",
          [
            "Farmland: 0.25 tiles (approx., doesn't affect aura calculation)",
            "Mill/Granary: 0.4 tiles (approx.)",
          ],
        ],
        "",
      ],
    },
    {
      title: "Technology",
      list: [
        "Villager Gather Rate",
        ["Mill techs", "Ancient Techniques"],
        "Villager Capacity",
        ["Wheelbarrow"],
        "Villager Move Speed",
        ["Wheelbarrow", "Yuan Dynasty"],
      ],
    },
    {
      title: "Formulas",
      list: [
        "Based on the above, we get:",
        "Total efficiency = Drop-off counts × Capacity ÷ Total duration",
        "Total duration = Movement duration + Gathering duration + Gather wind-up + Drop-off duration",
        "1 Loop duration > Chunk regrow duration",
        "Gather rate = Base rate × (1 + Mill techs + Ancient technique) × (1 + Granary stacks × Granary bonus)",
        "Move speed = Base speed × Wheelbarrow bonus × Yuan Dynasty bonus",
      ],
    },
  ],
  [HELP_PAGE_MODE.STATISTICS]: [
    {
      list: [
        "Please read the Game System section before continue.",
        "Do NOT use this application for actual food income calculation.",
      ],
    },
    {
      title: "Please acknowledge these flaws before use",
      list: [
        "Ignoring chunks under-harvested without wheelbarrow",
        "Ignoring villagers' chunk bias",
        "Ignoring building collision when pathfinding",
        "Assuming each farm uses only one drop-off point",
        "Ignoring villager hitbox",
        "Ignoring AoE4's quirky pathfinding",
      ],
    },
    {
      title: "Assumptions",
      list: [
        "Villagers always choose the best starting point",
        "All chunks are full at the start",
        "Villagers always choose best chunks & drop-off points",
        "Frame rate and network latency shouldn't affect calculation",
      ],
    },
    {
      title: "Data Explaination",
      list: [
        "Overview",
        [
          dataExplaination(REPORT_SUBJECT.TOTAL_RATE),
          dataExplaination(REPORT_SUBJECT.AVERAGE_RATE),
          dataExplaination(REPORT_SUBJECT.CHUNKS_BUFFED),
          dataExplaination(REPORT_SUBJECT.TRIPLE_BUFFED),
          dataExplaination(REPORT_SUBJECT.DOUBLE_BUFFED),
          dataExplaination(REPORT_SUBJECT.UNBUFFED_ACTIVE_CHUNK),
          dataExplaination(REPORT_SUBJECT.AVERAGE_MOVE_DURATION),
          dataExplaination(REPORT_SUBJECT.AVERAGE_MOVE_RATIO),
        ],
        "Granary",
        [
          dataExplaination(REPORT_SUBJECT.BUFFED_FARM_COUNT),
          dataExplaination(REPORT_SUBJECT.BUFFED_CHUNK_COUNT),
          dataExplaination(REPORT_SUBJECT.BUFFED_ACTIVE_CHUNK),
          dataExplaination(REPORT_SUBJECT.FARM_DROP_COUNT),
          dataExplaination(REPORT_SUBJECT.AVERAGE_DROPOFF_DISTANCE),
          dataExplaination(REPORT_SUBJECT.AVERAGE_MOVE_DURATION),
        ],
        "Farm",
        [
          dataExplaination(REPORT_SUBJECT.GATHER_RATE),
          dataExplaination(REPORT_SUBJECT.TOP_STACKS),
          dataExplaination(REPORT_SUBJECT.ACTIVE_CHUNKS),
          dataExplaination(REPORT_SUBJECT.BUFFED_ACTIVE_CHUNK),
          dataExplaination(REPORT_SUBJECT.TOTAL_MOVE_DISTANCE),
          dataExplaination(REPORT_SUBJECT.PERIOD),
          dataExplaination(REPORT_SUBJECT.MOVE_DURATION),
          dataExplaination(REPORT_SUBJECT.MOVE_RATIO),
        ],
      ],
    },
    {
      title: "Guideline Info",
      list: [
        "Farm",
        [
          "Cyan squares = granary-buffed, red = unbuffed",
          "Yellow dots = gathered, red dots = skipped",
          "Chunk buff is decided by whether center being inside granary range",
        ],
        "Drop-off Point",
        ["Outline in buildings represents hitbox for drop-off"],
        "Selected Building",
        [
          "Selecting farm highlights buffing granaries, with cyan outline on drop-off point",
          "Selecting granary highlights buffed farms",
          "Selecting drop-off point highlights related farms",
        ],
      ],
    },
  ],
};
