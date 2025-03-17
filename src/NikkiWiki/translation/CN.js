import {
  DATA_FIELD,
  SLOT,
  STYLE,
  STAT_MODE,
  FILTER_TAB,
} from "../model/enums.js";
import {
  FILTER_CONTEXT,
  APP_MISC_CONTEXT,
  TRANSLATE_COLLECTION,
} from "./context.js";

const {
  TABLE_HEADERS,
  ITEM_SLOTS,
  ITEM_STYLES,
  TABLE_STAT_MODES,
  FILTER_TABS,
  ITEM_COMPENDIUMS,
  ITEM_COMPENDIUM_SUBS,
  FILTER,
  APP_FOOTER,
  APP_MISC,
} = TRANSLATE_COLLECTION;

export const CN_PACK = {
  [TABLE_HEADERS]: {
    [DATA_FIELD.NAME]: "英",
    [DATA_FIELD.SLOT]: "部位",
    [DATA_FIELD.RARITY]: "星",
    [DATA_FIELD.SET]: "套装",
    [DATA_FIELD.MAIN_STAT]: "主",
    [DATA_FIELD.SEC_STAT]: "次",
    [DATA_FIELD.STAT_EL]: "典",
    [DATA_FIELD.STAT_FR]: "清",
    [DATA_FIELD.STAT_SW]: "甜",
    [DATA_FIELD.STAT_SX]: "性",
    [DATA_FIELD.STAT_CL]: "帅",
    [DATA_FIELD.TAGS]: "标",
    [DATA_FIELD.OBTAIN_FROM]: "获取",
    [DATA_FIELD.NAME_CN]: "中",
    [DATA_FIELD.COMPENDIUM]: "图鉴",
    [DATA_FIELD.COUNT]: "零件",
    [DATA_FIELD.COUNT_ACCESSORY]: "饰品",
    [DATA_FIELD.STAT_MAIN]: "数值",
    [DATA_FIELD.SIM_SCORE]: "模拟",
  },
  [ITEM_SLOTS]: {
    [SLOT.HAIR]: "发",
    [SLOT.DRESS]: "裙",
    [SLOT.OUTERWEAR]: "外",
    [SLOT.TOP]: "衣",
    [SLOT.BOTTOM]: "裤",
    [SLOT.SOCKS]: "袜",
    [SLOT.SHOES]: "鞋",
    [SLOT.HAIR_ACCESSORY]: "箍",
    [SLOT.HEADWEAR]: "帽",
    [SLOT.EARRINGS]: "耳",
    [SLOT.NECKWEAR]: "项",
    [SLOT.BRACELET]: "镯",
    [SLOT.CHOKER]: "枷",
    [SLOT.GLOVES]: "手",
    [SLOT.FACE_DECORATION]: "面",
    [SLOT.CHEST_ACCESSORY]: "胸",
    [SLOT.PENDANT]: "包",
    [SLOT.BACKPIECE]: "背",
    [SLOT.RING]: "指",
    [SLOT.ARM_DECORATION]: "臂",
    [SLOT.HANDHELD]: "持",
  },
  [ITEM_STYLES]: {
    [STYLE.MULTY]: "多",
    [STYLE.NONE]: "无",
    [STYLE.ELEGANT]: "典",
    [STYLE.FRESH]: "清",
    [STYLE.SWEET]: "甜",
    [STYLE.SEXY]: "性",
    [STYLE.COOL]: "帅",
  },
  [TABLE_STAT_MODES]: {
    [STAT_MODE.DETAILED]: "详细",
    [STAT_MODE.MAIN]: "主属性",
    [STAT_MODE.SIMULATION]: "模拟",
  },
  [FILTER_TABS]: {
    [FILTER_TAB.FILTER]: "筛选",
    [FILTER_TAB.COLUMNS]: "属性",
    [FILTER_TAB.SORT]: "排序",
  },
  [ITEM_COMPENDIUMS]: {
    1: "致敬辉煌的光",
    2: "神之一念",
    3: "漫长的足迹",
    4: "自然给予的馈赠",
    5: "大家的心愿原野（一）",
    6: "大家的心愿原野（二）",
    7: "纪念人生轨迹",
    8: "水晶灯闪耀的殿堂",
  },
  [ITEM_COMPENDIUM_SUBS]: {
    101: "奇迹套装",
    102: "骄傲之心",
    103: "种族传奇",

    201: "搭配新星的领悟",
    202: "设计改变世界",
    203: "品牌的萌芽",
    204: "奇妙旅行家",

    301: "旧时代落幕",
    302: "流星坠落时",
    303: "以奇想为名的时代",

    401: "拥抱浪花与鱼儿",
    402: "聆听微风与虫鸣",
    403: "遇见动物新朋友",
    404: "我们生活在一起",
    405: "装满提篮的花果",

    501: "心愿原野校服志",
    502: "江湖风云传",
    503: "心愿原野的星空",
    504: "了不起的事业心",

    601: "兴趣使然的绝品",
    602: "伴我长大的服装店",
    603: "亲爱的朋友们",
    604: "闲谈八卦集散地",

    701: "无法言说的悸动",
    702: "属于自己的节日",
    703: "铭刻记忆的声音",
    704: "不愿留下的遗憾",
    705: "最喜欢的小礼物",

    801: "乘上南瓜马车",
    802: "此生专属誓约",
  },
  [FILTER]: {
    [FILTER_CONTEXT.TITLE_CONFIGURATION]: "设置",
    [FILTER_CONTEXT.TITLE_SIMULATOR]: "模拟",
    [FILTER_CONTEXT.TITLE_COLUMNS]: "隐藏表列",
    [FILTER_CONTEXT.TITLE_SORT]: "排序优先级",
    [FILTER_CONTEXT.LABEL_STAT_MODE]: "服装数值",
    [FILTER_CONTEXT.LABEL_ITEM_LV]: "服装等级",
    [FILTER_CONTEXT.LABEL_ADD_FILTER]: "添加筛选规则",
    [FILTER_CONTEXT.LABEL_MAIN_STAT]: "主",
    [FILTER_CONTEXT.LABEL_SEC_STAT]: "次",
    [FILTER_CONTEXT.LABEL_ADD_BONUS_TAG]: "添加标签",
    [FILTER_CONTEXT.LABEL_TAG_POWER]: "标签系数",
    [FILTER_CONTEXT.LABEL_TAG]: "标",
    [FILTER_CONTEXT.LABEL_STYLE_BONUS]: "全风格加分",
    [FILTER_CONTEXT.LABEL_SLOT_STAT_BONUS]: "全部位加属性",
    [FILTER_CONTEXT.LABEL_SLOT_SCORE_BONUS]: "全部位加分",
    [FILTER_CONTEXT.LABEL_FIELD_BONUS]: "无场地加成",
    [FILTER_CONTEXT.LABEL_ADD_SORT_RULE]: "添加排序规则",
    [FILTER_CONTEXT.OPTION_ITEMLV_0]: "未升级",
    [FILTER_CONTEXT.OPTION_ITEMLV_11]: "已焕新",
    [FILTER_CONTEXT.OPTION_ITEM_LV]: "等级",
  },
  [APP_FOOTER]: [
    "声明:",
    "本页所有数据均复制于官方Discord频道的计算表格：",
    "https://docs.google.com/spreadsheets/d/1Q5yjX8roIyIRvaddOEI24hEBq4JZtSQ-7x61rFvyrds",
    "对于数据遗漏与勘误，本站虽会对发现的错误标明更正，但不会对任何数据及用户采信后所造成的结果负责",
    "网站的数据不会实时更新",
    "用户的自定义数据依赖浏览器本地存储，本站不提供云服务与设备间同步",
    "如有建议、需求或更正，请在Github上说明：",
    "https://github.com/Late1nAutumn/QuietToolBox/issues",
    "，期待您的宝贵建议与协助",
  ],
  [APP_MISC]: {
    [APP_MISC_CONTEXT.APP_TITLE]: "暖暖惟碁",
    [APP_MISC_CONTEXT.TABLE_NO_DATA]: "无适用数据",
    [APP_MISC_CONTEXT.FOOTNOTE_DATE]: "数据导入",
    [APP_MISC_CONTEXT.FOOTNOTE_VERSION]: " 数据版本",
  },
};

export const mapSetNameToCN = (setName) => {
  switch (setName) {
    // #region sets
    case "A Beautiful Day":
      return "美好的一天";
    case "Afternoon Shine":
      return "午后暖阳";
    case "Bibcoon Realm":
      return "围兜礼遇";
    case "Blooming Dreams":
      return "花漾梦萦";
    case "Blossoming Stars":
      return "群星绽放时";
    case "Breezy Tea Time":
      return "清爽茶会时";
    case "Bright Days":
      return "晴日悠行";
    case "Bubbly Voyage":
      return "轻盈泡泡";
    case "Bye-Bye Dust":
      return "灰尘拜拜";
    case "Carefree Moments":
      return "悠然欢馨时";
    case "Carnival Ode":
      return "嘉年华颂歌";
    case "Chic Elegance":
      return "利落仪表";
    case "Cozy Adventure":
      return "暖绒行动";
    case "Crystal Poems":
      return "晶莹诗集";
    case "Dance Till Dawn":
      return "绽响黎明前";
    case "Daughter of the Lake":
      return "湖的女儿";
    case "Departing Blossom":
      return "别离花客";
    case "Dreamy Glitter":
      return "梦泽流光";
    case "Endless Longing":
      return "长相思";
    case "Enduring Bond":
      return "恒久羁绊";
    case "Fairytale Swan":
      return "天鹅童话";
    case "Far and Away":
      return "远方的遥想";
    case "Fiery Glow":
      return "焰光灼灼";
    case "First Love":
      return "初恋滋味";
    case "Floral Memory":
      return "飞花的追忆";
    case "Flowing Colors":
      return "笔尖漾奇彩";
    case "Flutter Storm":
      return "蝶屿风袭";
    case "Forest's Fluttering":
      return "林间戏蝶";
    case "Froggy Fashion":
      return "蛙蛙风尚";
    case "Fully Charged":
      return "满电行动";
    case "Gleaming Dance":
      return "熠熠舞曲";
    case "Guard's Resolve":
      return "守卫志愿";
    case "Hometown Breeze":
      return "故乡的风";
    case "Midnight Vigil":
      return "仲夜守望";
    case "Moment Capturer":
      return "定格瞬间";
    case "Monster Girl":
      return "怪物少女";
    case "Moonlight Oath":
      return "辉月诺言";
    case "New Bloom Blessings":
      return "朝岁贺禧";
    case "New Year's Dawn":
      return "新岁曈曈";
    case "Path of Starlight":
      return "星夜归途";
    case "Pink Bunny":
      return "粉茸兔兔";
    case "Pink Ribbon Waltz":
      return "粉缎带圆舞曲";
    case "Quirky Idea":
      return "实验奇思";
    case "Radiant Night":
      return "璀璨夜庭";
    case "Rebirth Wish":
      return "祈愿新生";
    case "Refined Grace":
      return "简练风度";
    case "Rippling Serenity":
      return "悠然水畔";
    case "Scaly Dream":
      return "幽鳞渡梦生";
    case "Scarlet Dream":
      return "绯红绮梦";
    case "School Days":
      return "橱中回忆";
    case "Searching for Dreams":
      return "梦寻星愿";
    case "Shark Mirage":
      return "潮汐鲨影";
    case "Silvergale's Aria":
      return "咏叹银夜莺";
    case "Snowy Encounter":
      return "雪夜奇遇";
    case "Snowy Fragrance":
      return "冬雪梅香";
    case "Star of the Gala":
      return "夜宴明星";
    case "Stardust Flare":
      return "缀夜希光";
    case "Starfall Radiance":
      return "流星绚烂时";
    case "Starlet Burst":
      return "迷你星芒";
    case "Starlit Celebration":
      return "星愿璨梦";
    case "Starwish Echoes":
      return "星愿之声";
    case "Sunlit Grasspom":
      return "晴日草绒";
    case "Sweet Honey":
      return "甜润蜜糖";
    case "Sweet Jazz Nights":
      return "爵士夜甜心";
    case "Symphony of Strings":
      return "琴弦之诗";
    case "Timeless Echo":
      return "吟谣故梦";
    case "Unseen Entity":
      return "不可见对象";
    case "Whimsical Picnic":
      return "即兴野餐";
    case "Whispers of Waves":
      return "谕浪希声";
    case "Wind of Purity":
      return "纯净之风";
    case "Wings of Wishes":
      return "翩翩愿飞去";
    case "Wishful Aurosa":
      return "心愿金蔷薇";
    case "Woolfruit Siesta":
      return "树荫午憩";
    // #endregion
    case "-":
      return "-";
    default:
      if (setName) {
        console.log(`[WARNING]: Chinese name missing for set [${setName}]`);
        return "?";
      }
      return "-";
  }
};

export const mapItemNameToCN = (name) => {
  // TODO: complete data
  switch (name) {
    // #region items
    case "Air Bubbles":
      return "团团空气";
    case "Azure Sand":
      return "碧空流沙";
    case "Back to School":
      return "青春再来";
    case "Born Pink":
      return "天生粉色";
    case "Breezy Song":
      return "风中吟唱";
    case "Caressing Breeze":
      return "和风轻抚";
    case "Clear Vision":
      return "晴朗视野";
    case "Clearsky Moon":
      return "晴晚月色";
    case "Corridor of Time":
      return "穿过连廊";
    case "Curls of Grace":
      return "鬈曲婉转";
    case "Distant Memory":
      return "悠远之忆";
    case "Dream of Wonder":
      return "憧憬的幻梦";
    case "Fairy Song":
      return "精灵之歌";
    case "Festive Glow":
      return "暖意融烛";
    case "Five More Minutes":
      return "再睡五分钟";
    case "Gemini Spiral":
      return "双子星螺旋";
    case "Gilded Fragrance":
      return "鎏金幽香";
    case "Grayscale Mode":
      return "灰度模式";
    case "Leafy Vibe":
      return "绿叶清辉";
    case "Mini Fishball":
      return "小鱼丸";
    case "Moonlit Mist":
      return "雾月流影";
    case "Morning Sunlight":
      return "曦光洒落";
    case "Mortal Waters":
      return "湖落人间";
    case "Nostalgic Blossom":
      return "旧时光的花";
    case "Orange Dream":
      return "橙梦绮思";
    case "Peachy Puffs":
      return "桃气团团";
    case "Pink 'n' Curly":
      return "粉红微卷";
    case "Playful Spades":
      return "俏皮黑桃";
    case "Plump Fruit":
      return "饱满果实";
    case "Relaxed Workflow":
      return "从容处理";
    case "Rippling Waves":
      return "波纹卷卷";
    case "Sealed Wish":
      return "封存之愿";
    case "Silken Strands":
      return "乌墨丝缕";
    case "Silverspring Love":
      return "银泉漫流";
    case "Spring Whispers":
      return "春风的呢喃";
    case "Sunrise Runner":
      return "活力自由跑";
    case "Tender Curls":
      return "柔心卷卷";
    case "Warm Breeze":
      return "清逸暖风";
    case "Winter Love Song":
      return "冬日恋曲";
    case "Azure Whisper":
      return "风动微蓝";
    case "Blooming Grace":
      return "翩然新蕾";
    case "Daydream Delights":
      return "悠闲幻想";
    case "Enchanted Brilliance":
      return "灿烂愿景";
    case "Flower Melody":
      return "柔风花吟";
    case "Fragrant Reverie":
      return "芬芳遐想";
    case "Gentle Meowmur":
      return "轻柔猫语";
    case "Peachy Fellowship":
      return "桃园同袍";
    case "Perfect Start":
      return "满分出发";
    case "Playful Bibcoon":
      return "围兜礼装";
    case "Pure Melody":
      return "纯净的轻歌";
    case "Rewind Time":
      return "忆返旧苑";
    case "Sky Fall":
      return "天际降落";
    case "Soft Feathers":
      return "柔软的稚羽";
    case "Song of the Silvergale":
      return "银夜莺之歌";
    case "Starlit Moon":
      return "璨星守月";
    case "Tail of Purity":
      return "无暇之尾";
    case "Tiny Star Wish":
      return "小小的星愿";
    case "Whispering Bubbles":
      return "泡沫轻语";
    case "All Set":
      return "轻装上阵";
    case "Celestial Starfall":
      return "穹宇星垂";
    case "Crisp Design":
      return "挺括装束";
    case "Emerald Fluttering":
      return "翠蝶时时舞";
    case "First Day Jogging":
      return "晨跑第一天";
    case "Midsummer Shade":
      return "夏至桃荫";
    case "No Display":
      return "不予显示";
    case "Puffy Sleeves":
      return "蓬蓬短袖";
    case "Subtle Gray":
      return "浅灰格调";
    case "Through the Storm":
      return "风雨历程";
    case "Academy Tribute":
      return "学院寄语";
    case "Azure Waters":
      return "蓝蓝水域";
    case "Blending In":
      return "融入背景";
    case "Classroom Hours":
      return "课堂时间";
    case "Clean Posture":
      return "清整之姿";
    case "Clear Mind":
      return "清晰思路";
    case "Dreamland Marathon":
      return "梦乡马拉松";
    case "Heartfelt Love":
      return "赤诚爱意";
    case "Joyful Forever":
      return "欢悦不逝";
    case "Quick Warm-up":
      return "随心热身操";
    case "Refreshing Greenery":
      return "沁爽绿意";
    case "Siesta Tunes":
      return "午休伴奏";
    case "Time's Promise":
      return "时光约定";
    case "Wind of Thoughts":
      return "风花有思";
    case "Azure Impression":
      return "湛蓝印象";
    case "Babbling Brook":
      return "潺潺清溪";
    case "Blurred Effect":
      return "模糊处理";
    case "Foliage Musings":
      return "叶脉之思";
    case "Immersive Study":
      return "沉浸自习";
    case "Late Slumber":
      return "困意迟到了";
    case "Longing to Stay":
      return "懵懂久伴";
    case "Neat Pleats":
      return "规整百褶";
    case "Oceanic Hero":
      return "深海英雄";
    case "Operation Summer":
      return "夏日行动";
    case "Pink & Blue":
      return "粉蓝棱格";
    case "Silent Care":
      return "无声润养";
    case "Sleek Attire":
      return "利落行装";
    case "Smoky Blue":
      return "朦胧烟蓝";
    case "Spinning Mood":
      return "旋转心情";
    case "Sunny Agenda":
      return "暖日计划";
    case "Swift Leap":
      return "灵巧跳跃";
    case "With Efficiency":
      return "高效记录";
    case "Bittersweet Memory":
      return "悲欣交集";
    case "Candlelit Feast":
      return "烛映佳宴";
    case "Cotton Diamond":
      return "纯棉菱格";
    case "Days and Nights":
      return "不歇的昼夜";
    case "Diving Teaser":
      return "潜水预告";
    case "Dreamy Hope":
      return "浪漫憧憬";
    case "Fluffy Sockos":
      return "绒绒袜虫";
    case "Fun Stripes":
      return "条条不成框";
    case "Gradient Sky":
      return "渐变色星空";
    case "Heartfelt Touch":
      return "白沿心意";
    case "Interwoven with Love":
      return "以爱交织";
    case "Little Luck":
      return "小小幸运";
    case "Midday Nap":
      return "午间小憩";
    case "Neglected Existence":
      return "忽视存在";
    case "Peachfall Page":
      return "桃瓣书";
    case "Radiant Heat":
      return "热浪褶皱";
    case "Red Cherries":
      return "点红印花";
    case "Silver Nightglow":
      return "寂夜银辉";
    case "Snowy Dream":
      return "纯白之梦";
    case "Sweet Dreams":
      return "甜梦堆堆袜";
    case "Transparent Trajectory":
      return "透明踪迹";
    case "Twilight Daydream":
      return "暮色随想";
    case "Ultra-Vibrant Stripes":
      return "超活力线条";
    case "White Mist":
      return "纯白雾霭";
    case "White Petals":
      return "白花牵绊";
    case "Airborne Steps":
      return "踏风的步履";
    case "Azure Canvas":
      return "蓝白轻帆";
    case "Blooming Cycles":
      return "花有归期";
    case "Brown Footprints":
      return "浅咖足迹";
    case "Colorful Walk":
      return "款步斑斓";
    case "Divine Memories":
      return "默石回忆";
    case "Dreamward":
      return "迈入梦之国";
    case "Dripping Droplets":
      return "滴答水珠";
    case "Easy Steps":
      return "简洁步骤";
    case "Endless Journey":
      return "行途不止";
    case "Fearless Wanderer":
      return "不惧独行";
    case "Floral Stroll":
      return "漫步花间";
    case "Fruit Candy":
      return "果味硬糖";
    case "Graceful Takeoff":
      return "轻盈升空";
    case "Heartfelt Tribute":
      return "精心致礼";
    case "Heartwarming Glow":
      return "沁心暖光";
    case "Into Midnight":
      return "走进午夜";
    case "Into Thin Air":
      return "消失无踪";
    case "Journey Home":
      return "芒星归路";
    case "Low Heels":
      return "初试低跟";
    case "Moonveil Mirror":
      return "垂影银镜";
    case "One More Minute":
      return "再穿一分钟";
    case "Passing Joy":
      return "幸福传递";
    case "Path of Flowers":
      return "幽引花途";
    case "Pink Slippers":
      return "粉红凉拖";
    case "Purrfect Steps":
      return "喵呜舞步";
    case "Race Against Time":
      return "与时间赛跑";
    case "Ripple Tracker":
      return "一步涟漪";
    case "Shining Journey":
      return "闪耀的旅途";
    case "Snowfall Boots":
      return "雪绒长靴";
    case "Soft Steps":
      return "脚步轻轻";
    case "Springtime Steps":
      return "踏青脚步";
    case "Starry Steps":
      return "星光小碎步";
    case "Steady Steps":
      return "款步不歇";
    case "Stroll and Leisure":
      return "信步闲游";
    case "Zestful Kicks":
      return "轻快启程";
    case "A New Dawn":
      return "迎接黎明";
    case "Blossom Verses":
      return "花期的诗句";
    case "Celestial Radiance":
      return "星月长辉";
    case "Chasing Petals":
      return "逸逐花影";
    case "Kitty Reverie":
      return "喵喵遐想";
    case "Morning Glow":
      return "耀目的晨曦";
    case "Morning Greetings":
      return "晨安问候";
    case "Nostalgic Breeze":
      return "系起微风";
    case "Paw Print":
      return "棕黄爪印";
    case "Peachy Oath":
      return "桃珠结义";
    case "Petal Whisper":
      return "白蕊知意";
    case "Rebounding Deep Breath":
      return "弹力深呼吸";
    case "Sharky Bite":
      return "利齿咬咬";
    case "Shifted Gaze":
      return "转移视线";
    case "Sparkling Triangle":
      return "灵动三角";
    case "Subtle Gleam":
      return "微微的闪光";
    case "Sunny Windchime":
      return "晴天风铃";
    case "Twinkling Refractions":
      return "微光折射";
    case "Unfading Bloom":
      return "不凋之花";
    case "Wind's Caress":
      return "牵挂晚风";
    case "Woven Dreams":
      return "编织花梦";
    case "Blooming Crown":
      return "绽放花冕";
    case "Breeze-Kissed Blooms":
      return "湖风花雨";
    case "Cheerful Fisher":
      return "翘翘渔夫";
    case "Cozy Orange":
      return "服帖橘绒";
    case "Crown of Frost":
      return "霜华冠冕";
    case "Crowning Spring":
      return "万物的冠冕";
    case "Defined Lines":
      return "清晰轮廓";
    case "Fluttering Feathers":
      return "微扬稚羽";
    case "Gathering Drops":
      return "滴水聚汇";
    case "Gentle Sunshine":
      return "阳光不刺眼";
    case "Gift of Fish":
      return "鱼群之礼";
    case "Heart Aligned":
      return "同心依旧";
    case "Heavy Eyelids":
      return "眼皮好沉重";
    case "Meadow's Wish":
      return "田野心愿";
    case "Moonlit Threads":
      return "薄芒织夜";
    case "Pristine Grace":
      return "明净之姿";
    case "Rain of Flowers":
      return "晴雨生花";
    case "Scarlet Story":
      return "绯色物语";
    case "Seamless Disguise":
      return "无痕伪装";
    case "Shaky Branch":
      return "摇动枝丫";
    case "Silvermoon Serenade":
      return "啼唱银月";
    case "Skipping Joy":
      return "雀跃心绪";
    case "Sparkling Reverie":
      return "晶莹遐想";
    case "Starry Trampoline":
      return "星云蹦蹦床";
    case "Trail of Trends":
      return "潮流轨迹";
    case "Veiled Tea Party":
      return "雾纱茶宴";
    case "Blazing Scorch":
      return "灼炎烈日";
    case "Blossoming Bouquet":
      return "簇拥花球";
    case "Bringing Flowers":
      return "衔花来时";
    case "Echoing Silverwings":
      return "银翼回响";
    case "Floral Whispers":
      return "静听花语";
    case "Friendship's Bond":
      return "知交之谊";
    case "Mixed Juice":
      return "果汁特调";
    case "Moonbathed Bloom":
      return "沐月花蕊";
    case "Morning Dew":
      return "朝露夕拾";
    case "Resurrected Shine":
      return "再现的光辉";
    case "Sea of Pearls":
      return "寻珠之海";
    case "Soft Murmurs":
      return "絮语轻轻";
    case "Stockpile Audit":
      return "盘点储备";
    case "Swaying Ode":
      return "摇曳颂诗";
    case "Tangy Sweetness":
      return "酸甜欲滴";
    case "Tiny Bites":
      return "小鱼咬钩";
    case "Twilight's Veil":
      return "渐染夜色";
    case "Twinkling Stars":
      return "闪烁的星群";
    case "Undersea Encounter":
      return "海底相遇";
    case "Astral Entanglement":
      return "星流交轨";
    case "Blooming Heart":
      return "心若繁花";
    case "Blue Teardrop":
      return "蓝色泪滴";
    case "Heartfelt Waves":
      return "心绪摇曳";
    case "Pure Leaves":
      return "稚拙白叶";
    case "Diligent Agenda":
      return "严谨日程";
    case "Faraway Hour":
      return "远方时刻";
    case "Forgotten Hair Tie":
      return "忘了扎头发";
    case "Fragrant Blessings":
      return "幽香祝福";
    case "Fresh Square":
      return "清新小方";
    case "Gentle Touch":
      return "轻柔触碰";
    case "Glittering Change":
      return "亮晶晶变身";
    case "Green Dreams":
      return "绿意流连";
    case "Orange Sun":
      return "小橘瓣";
    case "Peachy Nostalgia":
      return "脆桃灼灼";
    case "Song of Fish":
      return "鱼之歌";
    case "First Impression":
      return "第一印象";
    case "Flowing Ripple":
      return "随波浮动";
    case "Fluttering Heart":
      return "心跳来袭";
    case "Mystic Woods":
      return "飘渺幻林";
    case "Past Fragrance":
      return "昔日花香";
    case "Rising Star":
      return "冉冉的新星";
    case "Silverweaving Star":
      return "织银成星";
    case "Sparkling Beginnings":
      return "璀璨的启程";
    case "Swan Sonata":
      return "天鹅心曲";
    case "Sweet & Cool":
      return "甜酷造型";
    case "Endless Horizons":
      return "指尖的无限";
    case "Feathered Dreamscape":
      return "浮梦织羽";
    case "Feathered Gleam":
      return "纤羽碎光";
    case "Fluffy Orange":
      return "绒绒暖橘";
    case "Humble Helper":
      return "朴实帮手";
    case "Lake Drops":
      return "湖影留珠";
    case "Lingering Memory":
      return "留住思念";
    case "Midnight Moon":
      return "深黑圆月";
    case "Monsoon Messenger":
      return "季风的信使";
    case "Silver Shattering":
      return "银碎微声";
    case "Splashy Gloves":
      return "水波点点";
    case "Sunburn Blockers":
      return "烈日对手";
    case "Thoughtful Care":
      return "贴心照料";
    case "Velvet Blend":
      return "陈年佳酿";
    case "Pixel Disguise":
      return "像素伪装";
    case "Shadow Tinted":
      return "染光墨镜";
    case "Simple Lines":
      return "简约线条";
    case "Smiling Blossoms":
      return "含笑面靥";
    case "Delicate Petal":
      return "素蕊胸针";
    case "Field Posy":
      return "田野花束";
    case "Meowie Badge":
      return "甜喵徽章";
    case "Eyes on You":
      return "目光锁定";
    case "Farewell Tail":
      return "鱼尾告别曲";
    case "Heart of Red":
      return "红心寄情";
    case "Sunlit Melody":
      return "煦日锦歌";
    case "Windswept Plume":
      return "拂风的翎羽";
    case "Fishing Bliss":
      return "日日有余";
    case "Golden Daylight":
      return "明黄晴日";
    case "Loaded with Hope":
      return "满满期待";
    case "Wings of Wish":
      return "梦愿飞絮";
    case "To the Future":
      return "勇闯未来";
    case "Starry Guidance":
      return "循星指引";
    case "Embracing Vines":
      return "银蔓依偎";
    case "Laurel Guardian":
      return "月桂之守";
    case "Festival of Dreams":
      return "星与梦的盛典";
    case "Glowing Radiance":
      return "如辉光闪烁";
    case "Lotus Umbrella":
      return "荷伞时光";
    case "Old Tale":
      return "旧日情怀";
    case "Uniform Companion":
      return "制服伴侣";
    // #endregion
    default:
      // console.log(`[WARNING]: Chinese name missing for item [${name}]`);
      return "-";
  }
};

export const mapTagNameToCN = (tagName) => {
  switch (tagName) {
    // #region tags
    case "Adventure":
      return "冒险";
    case "Ballroom":
      return "舞会";
    case "Cute":
      return "甜心";
    case "Fairy":
      return "精灵";
    case "Fantasy":
      return "幻想";
    case "Fashion":
      return "时尚";
    case "Formal":
      return "礼服";
    case "Home":
      return "居家";
    case "Intellectual":
      return "知性";
    case "Light":
      return "发光";
    case "Linlang":
      return "琳琅";
    case "More Light":
      return "发亮";
    case "Pastoral":
      return "田园";
    case "Playful":
      return "童趣";
    case "Retro":
      return "复古";
    case "Romance":
      return "浪漫";
    case "Royal":
      return "宫廷";
    case "Simple":
      return "简约";
    case "Summer":
      return "清凉";
    case "Trendy":
      return "超酷";
    case "Uniform":
      return "制服";
    case "Warm":
      return "保暖";
    // #endregion
    case "-":
      return "-";
    default:
      if (tagName) {
        console.log(`[WARNING]: Chinese name missing for tag [${tagName}]`);
        return "?";
      }
      return "-";
  }
};
