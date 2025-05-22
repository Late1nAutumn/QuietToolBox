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
  `${CN_PACK[REPORT_SUBJECT_LABEL][reportSubject]}：${CN_PACK[TOOLTIP_REPORT_SUBJECT][reportSubject]}`;

export const CN_PACK = {
  [HELP_MODE]: {
    [HELP_PAGE_MODE.CONTROL]: "操作",
    [HELP_PAGE_MODE.GAME_SYSTEM]: "游戏机制",
    [HELP_PAGE_MODE.STATISTICS]: "数据说明",
  },
  [TOOLBAR_TITLE]: {
    [TOOLBAR_TITLE_CONTEXT.SUMMARY]: "总览",
    [TOOLBAR_TITLE_CONTEXT.BUILDING]: "建筑",
    [TOOLBAR_TITLE_CONTEXT.TECH]: "科技",
    [TOOLBAR_TITLE_CONTEXT.INSIGHT]: "详情",
  },
  [REPORT_SUBJECT_LABEL]: {
    // overview
    [REPORT_SUBJECT.TOTAL_RATE]: "总效率",
    [REPORT_SUBJECT.AVERAGE_RATE]: "人均效率",
    [REPORT_SUBJECT.CHUNKS_BUFFED]: "总强化",
    [REPORT_SUBJECT.TRIPLE_BUFFED]: "三层强化",
    [REPORT_SUBJECT.DOUBLE_BUFFED]: "二层强化",
    [REPORT_SUBJECT.UNBUFFED_ACTIVE_CHUNK]: "未强化率",
    [REPORT_SUBJECT.AVERAGE_MOVE_DURATION]: "人均移动时长",
    [REPORT_SUBJECT.AVERAGE_MOVE_RATIO]: "人均移动占比",
    // granary
    [REPORT_SUBJECT.BUFFED_FARM_COUNT]: "强化农田数",
    [REPORT_SUBJECT.BUFFED_CHUNK_COUNT]: "强化簇数",
    [REPORT_SUBJECT.BUFFED_ACTIVE_CHUNK]: "强化活跃簇",
    [REPORT_SUBJECT.FARM_DROP_COUNT]: "上交者",
    [REPORT_SUBJECT.AVERAGE_DROPOFF_DISTANCE]: "簇均距离",
    // farm
    [REPORT_SUBJECT.GATHER_RATE]: "采集效率",
    [REPORT_SUBJECT.TOP_STACKS]: "最高层数",
    [REPORT_SUBJECT.ACTIVE_CHUNKS]: "活跃簇数",
    [REPORT_SUBJECT.TOTAL_MOVE_DISTANCE]: "总移动距离",
    [REPORT_SUBJECT.PERIOD]: "总耗时",
    [REPORT_SUBJECT.MOVE_DURATION]: "总移动耗时",
    [REPORT_SUBJECT.MOVE_RATIO]: "移动占比",
  },
  [DATA_UNIT_NAME]: {
    [DATA_UNIT.SECOND]: "秒",
    [DATA_UNIT.PER_SECOND]: "每秒",
    [DATA_UNIT.PER_MINUTE]: "每分",
    [DATA_UNIT.CHUNK]: "簇",
    [DATA_UNIT.TILE]: "格",
    [DATA_UNIT.FARM]: "农田",
    [DATA_UNIT.TILE_PER_SECOND]: "格每秒",
  },
  [BUILDING_NAME]: {
    [BUILDING.GRANARY]: "谷仓",
    [BUILDING.FARM]: "农田",
    [BUILDING.MILL]: "磨坊",
    [BUILDING.OTHER]: "其他",
  },
  [FARMER_STAT]: {
    [VILLAGER_STAT.GATHER_RATE]: "采集速率",
    [VILLAGER_STAT.MOVE_SPEED]: "移动速度",
    [VILLAGER_STAT.CAPACITY]: "运载量",
  },
  [FOOTER_BUTTON]: {
    [FOOTER_BUTTON_CONTEXT.AUTO_FILL]: "自动填充",
    [FOOTER_BUTTON_CONTEXT.TOGGLE_GUIDELINE]: "辅助线",
    [FOOTER_BUTTON_CONTEXT.TOGGLE_GRID]: "网格线",
    [FOOTER_BUTTON_CONTEXT.CENTER_VIEW]: "视角居中",
    [FOOTER_BUTTON_CONTEXT.OPEN_HELP]: "帮助",
  },
  [MODAL]: {
    [MODAL_CONTEXT.MODAL_TITLE_SAVE]: "保存数据",
    [MODAL_CONTEXT.MODAL_TITLE_LOAD]: "读取数据",
    [MODAL_CONTEXT.MODAL_TITLE_WIPE]: "桌面清理大师",
    [MODAL_CONTEXT.MODAL_TITLE_HELP]: "帮助",

    [MODAL_CONTEXT.MODAL_BODY_SAVE_WARNING]: "存档被覆盖就会消失",
    [MODAL_CONTEXT.MODAL_BODY_SAVE_NAME_PLACEHOLDER]: "填个存档名",
    [MODAL_CONTEXT.MODAL_BODY_SAVE_LIST_PLACEHOLDER]: "未找到本地存档",
    [MODAL_CONTEXT.MODAL_BODY_SAVE_LOCAL_WARNING]: "所有存档均存储于本地",
    [MODAL_CONTEXT.MODAL_BODY_LOAD_WARNING]: "当前未保存的进度会消失",
    [MODAL_CONTEXT.MODAL_BODY_WIPE]: "东西不保存就全没了",
  },
  [NOTIFICATION]: {
    [NOTIFICATION_CONTEXT.SAVE_INVALID_NAME]: "无效存档名",
    [NOTIFICATION_CONTEXT.SAVE_SAVE]: "方案已保存",
    [NOTIFICATION_CONTEXT.SAVE_OVERWRITE]: "方案已覆盖",
    [NOTIFICATION_CONTEXT.LOAD_SAVE]: "方案已加载",

    [NOTIFICATION_CONTEXT.BUILD_GRANARY_LIMIT]: "已超出谷仓上限",
    [NOTIFICATION_CONTEXT.BUILD_INVALID_POSITION]: "无效的着陆地点",
    [NOTIFICATION_CONTEXT.BUILD_WONDER]: "不是，哥们儿，你图啥？",

    [NOTIFICATION_CONTEXT.AUTO_FILL_SUCCESS]: "个农场成功填充",
    [NOTIFICATION_CONTEXT.AUTO_FILL_FULL]: "所有谷仓均已填满",
    [NOTIFICATION_CONTEXT.AUTO_FILL_INVALID]: "无法对该方案填充",
  },
  [HINT]: {
    [HINT_CONTEXT.DEFAULT_HINT]: "拖动鼠标右键四处查看。使用滚轮缩放视角",
    [HINT_CONTEXT.BUILDING_HINT]: "单击左键放置建筑，右键退出建造",
  },
  [TOOLTIP_BUILDING]: {
    [BUILDING.GRANARY]:
      "谷仓：村民可将食物存放于这个建筑。使附近村民的农田采集速率+10%（可与其他谷仓叠加）。每次存放资源都会产生税。",
    [BUILDING.FARM]:
      "农田：可采集的食物来源，利用村民即可以从农田采集食物。每块农田只能派遣一位村民耕作。",
    [BUILDING.MILL]:
      "磨坊：村民可将食物存放于这个建筑。可研究提升食物采集效率的科技。每次存放资源都会产生税。",
  },
  [TOOLTIP_TECH]: {
    [TECH.HORTICULTURE]: "园艺学：村民的食物采集速率+10%，不包括狩猎肉类。",
    [TECH.FERTILIZATION]: "施肥：村民的食物采集速率+10%，不包括狩猎肉类。",
    [TECH.CROSSBREEDING]:
      "精准杂交育种：村民的食物采集速率+10%，不包括狩猎肉类。",
    [TECH.WHEELBARROW]: "独轮推车：村民的运载量+5，移动速度+15%。",
    [TECH.ANCIENTTECH]: "古代技术：每达到一个王朝时村民的采集速率+4%。",
  },
  [TOOLTIP_DYNASTY]: {
    [DYNASTY.YUAN]: "元朝：村民、命官及军事单位速度+15%。",
  },
  [TOOLTIP_REPORT_SUBJECT]: {
    // overview
    [REPORT_SUBJECT.TOTAL_RATE]: "每分钟的平均食物采集量",
    [REPORT_SUBJECT.AVERAGE_RATE]: "平均每个村民的每秒采集量",
    [REPORT_SUBJECT.CHUNKS_BUFFED]: "所有活跃簇中被谷仓强化的总数",
    [REPORT_SUBJECT.TRIPLE_BUFFED]: "所有活跃簇中被谷仓强化三层的总数",
    [REPORT_SUBJECT.DOUBLE_BUFFED]: "所有活跃簇中被谷仓强化二层的总数",
    [REPORT_SUBJECT.UNBUFFED_ACTIVE_CHUNK]: "所有活跃簇中未被谷仓强化的占比",
    [REPORT_SUBJECT.AVERAGE_MOVE_DURATION]: "平均每个村民一循环中的移动时长",
    [REPORT_SUBJECT.AVERAGE_MOVE_RATIO]:
      "平均每个村民一循环中的移动时长占一循环总耗时的比例",
    // granary
    [REPORT_SUBJECT.BUFFED_FARM_COUNT]: "簇受到该谷仓强化的农田总数",
    [REPORT_SUBJECT.BUFFED_CHUNK_COUNT]: "受到该谷仓强化的簇总数",
    [REPORT_SUBJECT.BUFFED_ACTIVE_CHUNK]: "范围内谷仓强化的活跃簇总数",
    [REPORT_SUBJECT.FARM_DROP_COUNT]: "将该谷仓用于上交资源的农田",
    [REPORT_SUBJECT.AVERAGE_DROPOFF_DISTANCE]:
      "每一向该谷仓上交的活跃簇到该谷仓的平均距离",
    // farm
    [REPORT_SUBJECT.GATHER_RATE]: "每秒的平均食物采集量",
    [REPORT_SUBJECT.TOP_STACKS]: "该农田中受强化次数最多的簇的层数",
    [REPORT_SUBJECT.ACTIVE_CHUNKS]: "该农田的一个循环中会被采集的簇的数量",
    [REPORT_SUBJECT.TOTAL_MOVE_DISTANCE]: "该农田一个循环中村民的移动距离",
    [REPORT_SUBJECT.PERIOD]: "该农田一个循环的总时长",
    [REPORT_SUBJECT.MOVE_DURATION]: "该农田一个循环中村民的移动耗时",
    [REPORT_SUBJECT.MOVE_RATIO]: "该农田一循环中的移动时长占总耗时的比例",
  },
  [TOOLTIP_ICONS]: {
    [TOOLTIP_ICONS_CONTEXT.DELETE_ALL]: "清空放置的所有建筑",
    [TOOLTIP_ICONS_CONTEXT.DELETE_SELECTED]: "删除这个建筑",
    [TOOLTIP_ICONS_CONTEXT.BOOK]: "查看数据细则",
    [TOOLTIP_ICONS_CONTEXT.AUTO_FILL]: "在谷仓范围内自动铺设农田",
    [TOOLTIP_ICONS_CONTEXT.TOGGLE_GUIDELINE]: "切换辅助信息显示",
    [TOOLTIP_ICONS_CONTEXT.TOGGLE_GRID]: "切换地图网格显示",
    [TOOLTIP_ICONS_CONTEXT.CENTER_VIEW]: "将地图视角移动到建筑群中央",
    [TOOLTIP_ICONS_CONTEXT.OPEN_HELP]: "打开帮助界面",
  },
  [APP_MISC]: {
    [APP_MISC_CONTEXT.APP_TITLE]: "谷神",
    [APP_MISC_CONTEXT.INSIGHT_OTHER_BUIDLING]:
      "有人拿50木修了个房子，有人修了俩。还有人把这房子烧了，赚到了25块钱",
    [APP_MISC_CONTEXT.BUTTON_SAVE]: "保存",
    [APP_MISC_CONTEXT.BUTTON_IMPORT]: "导入",
    [APP_MISC_CONTEXT.BUTTON_BACK]: "返回",
    [APP_MISC_CONTEXT.BUTTON_CONFIRM]: "确认",
    [APP_MISC_CONTEXT.BUTTON_CANCEL]: "取消",
  },
  [LEGEND]: {
    [LEGEND_CONTEXT.TIMEMAP_MOVEMENT]: "移动",
    [LEGEND_CONTEXT.TIMEMAP_GATHER_WINDUP]: "采集前摇",
    [LEGEND_CONTEXT.TIMEMAP_GATHERING]: "采集资源",
    [LEGEND_CONTEXT.TIMEMAP_DROP_OFF]: "交付资源",
  },
};

CN_PACK[HELP] = {
  [HELP_PAGE_MODE.CONTROL]: [
    {
      title: "地图",
      list: [
        "鼠标左键点击建筑图标以选中建筑",
        ["点击地图空白处取消选择"],
        "按住右键拖动移动视角",
        "鼠标滚轮会以鼠标位置为中心缩放地图",
      ],
    },
    {
      title: "侧边栏",
      list: [
        "点击骷髅图标删除全部建筑或选中建筑",
        "点击建筑图标进入建造模式",
        [
          "建筑上的红色方格表示位置冲突",
          "地图上点击左键放置建筑，完成放置不会退出建造模式",
          "右键退出建造",
        ],
        "点击科技图标切换激活状态",
      ],
    },
    {
      title: "页脚栏",
      list: [
        CN_PACK[TOOLTIP_ICONS][TOOLTIP_ICONS_CONTEXT.AUTO_FILL],
        ["在有任意建筑错位时无法使用"],
        CN_PACK[TOOLTIP_ICONS][TOOLTIP_ICONS_CONTEXT.TOGGLE_GUIDELINE],
        CN_PACK[TOOLTIP_ICONS][TOOLTIP_ICONS_CONTEXT.TOGGLE_GRID],
        CN_PACK[TOOLTIP_ICONS][TOOLTIP_ICONS_CONTEXT.CENTER_VIEW],
        CN_PACK[TOOLTIP_ICONS][TOOLTIP_ICONS_CONTEXT.OPEN_HELP],
      ],
    },
  ],
  [HELP_PAGE_MODE.GAME_SYSTEM]: [
    {
      title: "术语定义",
      list: [
        "簇：农田上的农民采集的稻苗",
        "轮：农民以资源上交点为起点，到下一次回到资源上交点的过程",
        "循环：从某簇开始采集，到该簇重生后下一次重新回到该簇采集的过程",
        "活跃簇：在一个循环中会被采集的簇",
      ],
    },
    {
      title: "了解农田",
      list: [
        "农田上有若干横竖排列的簇，每簇有固定数量的食物",
        [
          "与大多数文明不同，中国稻田内部结构为4x4，每簇含量7.5",
          "研究完独轮推车后，农民恰好携带两簇的食物",
        ],
        "农田簇只会在被完全采集之后重新生长",
        ["中国稻田完成成长需要30秒"],
      ],
    },
    {
      title: "了解谷仓",
      list: [
        "谷仓的光环强化对象为农民而非农田",
        ["谷仓光环的粘滞时间极短，无法维持到下一簇", "收益计算需要按簇分析"],
        "所有其他采集加成均为加算，但谷仓光环在科技结算后单独乘算",
        [
          "谷仓光环重叠与否其实收益不变",
          "谷仓问题的本质是如何节省农田数量和缩短上交资源距离",
        ],
      ],
    },
    {
      title: "了解采集机制",
      list: ["以下内容本应用并未完全模拟"],
    },
    {
      list: [
        "村民在移动后采集前有一定的前摇，后摇则几乎没有",
        "村民完成第一簇的采集之后，会就近选择最近的簇进行第二簇采集",
        [
          "村民不保证选择距上交点最近的簇",
          "在某些地图上，村民会尽可能的选择西北-东南方向上最近的簇（规律不明）",
        ],
        "",
        "村民运载量耗尽后，会就近选择资源上交点",
        "上交资源有明显的耗时",
        "上交资源后，会就近选择起点簇",
        "",
        "以下机制由观测得出：",
        [
          "农民采集时位于簇正中央",
          "基础采集速度：0.75每秒",
          "农田簇重生时间：30秒",
          "采集科技加成为加算",
          "谷仓光环加成为结算科技后乘算",
          "资源上交时长（有误差）：0.5秒",
          "采集前摇时长（有较大误差）：0.25秒",
          "谷仓光环范围： 7.63格（或有误差，但经验证不影响生效范围计算）",
          "建筑边缘间隙：",
          [
            "农田： 0.25格（或有误差，经验证不影响光环计算）",
            "磨坊、谷仓：0.4格（或有误差）",
          ],
        ],
        "",
      ],
    },
    {
      title: "相关科技",
      list: [
        "村民采集速度",
        ["磨坊科技", "古代技术"],
        "村民运载量",
        ["独轮推车"],
        "村民移动速度",
        ["独轮推车", "元朝"],
      ],
    },
    {
      title: "公式",
      list: [
        "综上分析，我们得到：",
        "总效率 = 上交次数 × 运载量 / 总耗时",
        "总耗时 = 移动耗时 + 采集耗时 + 采集前摇耗时 + 上交动作耗时",
        "一循环耗时 > 簇重生时长",
        "采集速度 = 基础采集速度 × ( 1 + 磨坊科技 + 古道技术 ) × (1 + 谷仓层数 × 谷仓加成)",
        "移动速度 = 基础移速 × 独轮推车加成 × 元朝加成",
      ],
    },
  ],
  [HELP_PAGE_MODE.STATISTICS]: [
    {
      list: [
        "在阅读本页前请先确保理解机制页面的知识",
        "切勿将此应用用于计算实际经济收益",
      ],
    },
    {
      title: "请确认本应用的计算缺陷",
      list: [
        "不考虑无独轮推车时对簇的不完全采集",
        "不考虑农民选择第二簇时的倾向性",
        "路线计算会无视一切建筑的碰撞",
        "只考虑每片农田只使用一个资源上交点",
        "不考虑农民的碰撞体积",
        "不考虑帝国4的逆天寻路算法",
      ],
    },
    {
      title: "假设",
      list: [
        "村民总是选择最佳策略的起点",
        "农田在开始前存量全满",
        "村民的上交点和簇的选择总是最佳策略",
        "游戏帧数和网络延迟对计算没有影响",
      ],
    },
    {
      title: "统计事项",
      list: [
        "总览",
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
        "谷仓",
        [
          dataExplaination(REPORT_SUBJECT.BUFFED_FARM_COUNT),
          dataExplaination(REPORT_SUBJECT.BUFFED_CHUNK_COUNT),
          dataExplaination(REPORT_SUBJECT.BUFFED_ACTIVE_CHUNK),
          dataExplaination(REPORT_SUBJECT.FARM_DROP_COUNT),
          dataExplaination(REPORT_SUBJECT.AVERAGE_DROPOFF_DISTANCE),
          dataExplaination(REPORT_SUBJECT.AVERAGE_MOVE_DURATION),
        ],
        "农田",
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
      title: "地图事项",
      list: [
        "农田",
        [
          "青色方块表示簇被谷仓加强，红色方块表示未被谷仓加强",
          "黄色方点表示簇被采集，红色方点表示不被采集",
          "簇是否被强化取决于中心点是否在谷仓圈内",
        ],
        "资源上交点",
        ["建筑中的边框表示建筑的碰撞体积，即农民上交资源的位置"],
        "选择建筑",
        [
          "选中农田会高亮显示对起加强的谷仓，并用青色边框显示资源上交点",
          "选中谷仓会高亮显示有蔟受其加强的农田",
          "选中资源上交点会高亮显示对其上交的农田",
        ],
      ],
    },
  ],
};
