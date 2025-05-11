import {
  TIME_CONTEXT,
  TRANSLATION_COLLECTION,
  GENERAL_TRANSLATE_COLLECTION,
  CHAT_CONTEXT,
  GOSSIP_CONTEXT,
} from "./context.js";

const { TIME } = GENERAL_TRANSLATE_COLLECTION;
const { CHAT, GOSSIP } = TRANSLATION_COLLECTION;

export const CN_PACK = {
  [TIME]: {
    [TIME_CONTEXT.MINUTE]: "分钟",
    [TIME_CONTEXT.HOUR]: "小时",
    [TIME_CONTEXT.SECOND]: "秒钟",
    [TIME_CONTEXT.SHORT_HOUR]: "时",
    [TIME_CONTEXT.SHORT_MINUTE]: "分",
    [TIME_CONTEXT.SHORT_SECOND]: "秒",
  },
  [CHAT]: {
    [CHAT_CONTEXT.GREETING]:
      "事成身退了无趣，\n再添新盏心忧愁。\n人世苍茫如何渡，\n唯以欢喜作扁舟。",
    [CHAT_CONTEXT.LANG_SWITCH]: "让我们说中文",
  },
  [GOSSIP]: {
    [GOSSIP_CONTEXT(0, 0)]: "不会有人觉得我是个AI吧？",
    [GOSSIP_CONTEXT(0, 1)]: "没错，我当然只是个预制人",

    [GOSSIP_CONTEXT(1, 0)]: "为了把我画出来，\n我主直接写了个小工具",
    [GOSSIP_CONTEXT(1, 1)]: "就是应用列表里的Sketcher",
    [GOSSIP_CONTEXT(1, 2)]:
      "其实就只是个多边形工具外加取色器\n他觉Illustrator很不好用",

    [GOSSIP_CONTEXT(2, 0)]: "我在小学的时候就学了Flash",
    [GOSSIP_CONTEXT(2, 1)]: "当时还有短片比赛，拿了点奖",
    [GOSSIP_CONTEXT(2, 2)]: "可惜时代已经变啦",

    [GOSSIP_CONTEXT(3, 0)]:
      "我学编程最早是中学时学的Pascal，\n也参加竞赛拿了点奖",
    [GOSSIP_CONTEXT(3, 1)]:
      "编程这玩意儿和乐器一样，\n也是越早学越好，\n我很多大学同学都搞不定",

    [GOSSIP_CONTEXT(4, 0)]: "虚拟机是真的好用，\n隔离环境太爽了",
    [GOSSIP_CONTEXT(4, 1)]: "国产软件一律进虚拟机，\n再也不用担心流氓程序了",

    [GOSSIP_CONTEXT(5, 0)]: "我github本来想叫late in autumn，\n结果已被占用了",
    [GOSSIP_CONTEXT(5, 1)]:
      "那个号上连个公开项目都没有，\n用不上能不能留给有需要的人啊啊啊啊",

    [GOSSIP_CONTEXT(6, 0)]: "巴赫的BWV578和螃蟹卡农很好听",
    [GOSSIP_CONTEXT(6, 1)]: "要是生在现代，巴赫绝对是顶级码农",
    [GOSSIP_CONTEXT(6, 2)]: "BWV1042也很好听，\n大键琴的音色很有韵味",

    [GOSSIP_CONTEXT(7, 0)]:
      "高中毕业那个暑假我自学了一首钢琴曲，\n磕磕绊绊花了两年才弹流畅",
    [GOSSIP_CONTEXT(7, 1)]:
      "再想学第二首的时候怎么也练不出来了。\n乐器这东西还得是童子功",
    [GOSSIP_CONTEXT(7, 2)]: "不过嘛我觉得我小时候可能也没这个定力好好练乐器",
    [GOSSIP_CONTEXT(7, 3)]: "生活总是充满遗憾啊",

    [GOSSIP_CONTEXT(8, 0)]:
      "游戏不好玩配叫游戏吗？\n那些个3A大厂出的都是些什么垃圾",
    [GOSSIP_CONTEXT(8, 1)]: "任天堂这样在玩法上作钻研的厂家才是正途",
    [GOSSIP_CONTEXT(8, 2)]: "世上有太多的人只知道照搬成熟的商业体系赚钱",
    [GOSSIP_CONTEXT(8, 3)]:
      "像Braid，星际拓荒，动物井\n这样精巧的独立游戏才是真正的艺术品",
    [GOSSIP_CONTEXT(8, 4)]:
      "那些没有品味、只会氪金，最后把腾讯米哈游这种公司养肥的人永远体会不到",

    [GOSSIP_CONTEXT(9, 0)]: "你知道吗，把鸡肉切成丁非常解压",
    [GOSSIP_CONTEXT(9, 1)]: "推荐在解冻到一半的时候下刀，手感非常好",

    [GOSSIP_CONTEXT(10, 0)]:
      "我不喝酒，我连一瓶啤酒都喝不下。\n为什么会有人喜欢喝酒这么难喝的东西啊",

    [GOSSIP_CONTEXT(11, 0)]: "之前看到过一张图，小笼包生日蛋糕",
    [GOSSIP_CONTEXT(11, 1)]: "算是体会到意大利人看到菠萝披萨是什么感觉了",

    [GOSSIP_CONTEXT(12, 0)]: "Costco的Cheese cake超好吃！",
    [GOSSIP_CONTEXT(12, 1)]: "但这东西现在贵的1b",
    [GOSSIP_CONTEXT(12, 2)]: "我记得刚来美国的时候这东西才12刀，一整个大蛋糕",
    [GOSSIP_CONTEXT(12, 3)]: "现在咱这里一个要卖27块了",
  },
};
