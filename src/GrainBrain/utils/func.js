import { coordDistance, pointDistance } from "../../utils/functions";

import { ASSUMPTION, BUILDING_SIZE, CALCULATED, RULE } from "./aoe4/data";
import { BUILDING, TECH } from "./aoe4/enum";
import { gatherRate, villagerCapacity, villagerSpeed } from "./aoe4/func";

import { DATA_UNIT, REPORT_SUBJECT } from "./enum";

export const otherBuildImgSrc = (size) => {
  let filename = "";
  switch (size) {
    case 2:
      filename = "outpost";
      break;
    case 3:
      filename = "barracks";
      break;
    case 4:
      filename = "keep";
      break;
    case 6:
      filename = "building_wonder_age4_forbidden_city";
      break;
  }
  return `./asset/aoe4/${filename}.png`;
};

export const isClickOnFilteredElement = (composedPath, targetNames) => {
  for (let { classList } of composedPath) {
    if (classList)
      for (let classname of classList)
        if (targetNames.includes(classname)) return true;
  }
  return false;
};

export const rowOfChunkIndex = (index) => Math.floor(index / RULE.FARM_CHUNK);
export const colOfChunkIndex = (index) => index % RULE.FARM_CHUNK;
export const chunkCoord = (farmCoord, chunkIndex) => {
  let row = rowOfChunkIndex(chunkIndex),
    col = colOfChunkIndex(chunkIndex);
  return {
    x:
      farmCoord.x +
      ASSUMPTION.PADDING[BUILDING.FARM] +
      (col + 0.5) * CALCULATED.FARM_CHUNK_WIDTH,
    y:
      farmCoord.y +
      ASSUMPTION.PADDING[BUILDING.FARM] +
      (row + 0.5) * CALCULATED.FARM_CHUNK_WIDTH,
  };
};

const dropOffPoint = ({ x, y }, targetCoord, targetKind) => {
  let targetX,
    targetY,
    targetLeft = targetCoord.x + ASSUMPTION.PADDING[targetKind],
    targetRight =
      targetCoord.x +
      BUILDING_SIZE[targetKind] -
      ASSUMPTION.PADDING[targetKind],
    targetTop = targetCoord.y + ASSUMPTION.PADDING[targetKind],
    targetBottom =
      targetCoord.y +
      BUILDING_SIZE[targetKind] -
      ASSUMPTION.PADDING[targetKind];
  switch (true) {
    case x < targetLeft:
      targetX = targetLeft;
      break;
    case x > targetRight:
      targetX = targetRight;
      break;
    default:
      targetX = x;
      break;
  }
  switch (true) {
    case y < targetTop:
      targetY = targetTop;
      break;
    case y > targetBottom:
      targetY = targetBottom;
      break;
    default:
      targetY = y;
      break;
  }
  return {
    x: targetX,
    y: targetY,
    distance: pointDistance(targetX, targetY, x, y),
  };
};
const centerDropOffDistance = (farmCoord, targetCoord, targetKind) =>
  dropOffPoint(
    {
      x: farmCoord.x + BUILDING_SIZE[BUILDING.FARM] / 2,
      y: farmCoord.y + BUILDING_SIZE[BUILDING.FARM] / 2,
    },
    targetCoord,
    targetKind
  ).distance;

const getBestChunks = (
  farmData,
  dropperData,
  { moveSpeed, gatherRater, capacity },
  chunkBuffs
) => {
  // get best chunks in regrow period
  let chunks = new Array(RULE.FARM_CHUNK ** 2)
    .fill()
    .map((_, index) => {
      let coord = chunkCoord(farmData.coord, index);
      let { x, y, distance } = dropOffPoint(
        coord,
        dropperData.coord,
        dropperData.kind
      );
      return {
        index,
        coord,
        dropOffCoord: { x, y },
        dropOffDistance: distance,
      };
    })
    .sort(
      // it is what it is for now
      (a, b) =>
        a.dropOffDistance - b.dropOffDistance ||
        Math.abs(rowOfChunkIndex(a.index) - RULE.FARM_CHUNK / 2) -
          Math.abs(rowOfChunkIndex(b.index) - RULE.FARM_CHUNK / 2) ||
        Math.abs(colOfChunkIndex(a.index) - RULE.FARM_CHUNK / 2) -
          Math.abs(colOfChunkIndex(b.index) - RULE.FARM_CHUNK / 2)
    );

  // get farm rate
  // period start after gather in the first chunk finished
  let i,
    period = 0,
    distance = 0;
  for (i = 1; i < chunks.length; i += 2) {
    // WARNING: simulation without wheelbarrow is totally inaccurate
    let baseDeltaTime =
      (chunks[i].dropOffDistance + CALCULATED.FARM_CHUNK_WIDTH) / moveSpeed +
      capacity / 2 / gatherRater(chunkBuffs[i]) +
      capacity / 2 / gatherRater(chunkBuffs[i + 1]) +
      ASSUMPTION.GATHER_WINDUP_DURATION +
      ASSUMPTION.RESOURCE_DROPOFF_DURATION;
    distance += chunks[i].dropOffDistance + CALCULATED.FARM_CHUNK_WIDTH;
    if (period + baseDeltaTime > RULE.FARM_REGROW_PERIOD) {
      let tempDist = coordDistance(chunks[i].dropOffCoord, chunks[0].coord);
      period += baseDeltaTime + tempDist / moveSpeed;
      distance += tempDist;
      break;
    } else {
      let tempDist = coordDistance(chunks[i].dropOffCoord, chunks[i + 1].coord);
      period += baseDeltaTime + tempDist / moveSpeed;
      distance += tempDist;
    }
  }
  period = Math.max(period, RULE.FARM_REGROW_PERIOD); // this shouldn't happen

  return {
    period,
    distance,
    efficiency: (((i - 1) / 2 + 1) * capacity) / period, // food per sec
    activeChunks: chunks.slice(0, i + 1),
  };
};

export const generateTracker = (atlas, techState) => {
  let farms = {},
    granaries = [],
    mills = [],
    tracker = {};
  Object.values(atlas).forEach(({ uuid, kind }) => {
    switch (kind) {
      case BUILDING.FARM:
        farms[uuid] = {
          chunkBuffs: new Array(RULE.FARM_CHUNK ** 2).fill(0),
          dropper: null,
          buffedBy: new Array(RULE.FARM_CHUNK ** 2).fill().map(() => []),
          period: Infinity,
          efficiency: 0,
          activeChunks: [],
        };
        break;
      case BUILDING.GRANARY:
        granaries.push(uuid);
        tracker[uuid] = { droppingOffs: [], buffing: [] };
        break;
      case BUILDING.MILL:
        mills.push(uuid);
        tracker[uuid] = { droppingOffs: [] };
        break;
    }
  });
  Object.keys(farms).forEach((farmUuid) => {
    let minCenterDropOffDistance = Infinity,
      bestDroppers = [];

    const getBestDroppers = (uuid) => {
      let dist = centerDropOffDistance(
        atlas[farmUuid].coord,
        atlas[uuid].coord,
        atlas[uuid].kind
      );
      if (minCenterDropOffDistance > dist) {
        minCenterDropOffDistance = dist;
        bestDroppers = [uuid];
      } else if (minCenterDropOffDistance === dist) bestDroppers.push(uuid);
    };

    mills.forEach(getBestDroppers);
    granaries.forEach((granaryUuid) => {
      let buffing = false;
      getBestDroppers(granaryUuid);
      // count buffs
      new Array(RULE.FARM_CHUNK ** 2).fill().forEach((_, index) => {
        let { x, y } = chunkCoord(atlas[farmUuid].coord, index);
        if (
          pointDistance(
            atlas[granaryUuid].coord.x + BUILDING_SIZE[BUILDING.GRANARY] / 2,
            atlas[granaryUuid].coord.y + BUILDING_SIZE[BUILDING.GRANARY] / 2,
            x,
            y
          ) < ASSUMPTION.GRANARY_AREA_RADIUS
        ) {
          farms[farmUuid].chunkBuffs[index]++;
          farms[farmUuid].buffedBy[index].push(granaryUuid);
          buffing = true;
        }
      });
      if (buffing) tracker[granaryUuid].buffing.push(farmUuid);
    });

    let bestResult = { efficiency: 0 },
      villager = {
        moveSpeed: villagerSpeed(
          techState[TECH.WHEELBARROW],
          techState[TECH.DYNASTY]
        ),
        gatherRater: (count) =>
          gatherRate(
            techState[TECH.FOOD_GATHER] - TECH.FOOD_GATHER,
            +techState[TECH.ANCIENTTECH] * techState[TECH.DYNASTY_COUNT],
            count
          ),
        capacity: villagerCapacity(techState[TECH.WHEELBARROW]),
      };
    bestDroppers.forEach((dropperUuid) => {
      let result = getBestChunks(
        atlas[farmUuid],
        atlas[dropperUuid],
        villager,
        farms[farmUuid].chunkBuffs
      );
      if (result.efficiency > bestResult.efficiency) {
        bestResult = result;
        farms[farmUuid].dropper = dropperUuid;
      }
    });
    if (bestDroppers.length)
      tracker[farms[farmUuid].dropper].droppingOffs.push(farmUuid);
    Object.assign(farms[farmUuid], bestResult);
  });
  Object.assign(tracker, farms);
  return tracker;
};
export const generateReport = (tracker, atlas, techState) => {
  if (
    !tracker ||
    (!Object.keys(tracker).find(
      (uuid) => atlas[uuid].kind === BUILDING.GRANARY
    ) &&
      !Object.keys(tracker).find((uuid) => atlas[uuid].kind === BUILDING.MILL))
  )
    return {};
  let report = {
    overview: {
      [REPORT_SUBJECT.TOTAL_RATE]: 0, // food / min
      [REPORT_SUBJECT.AVERAGE_RATE]: 0, // food / sec
      [REPORT_SUBJECT.CHUNKS_BUFFED]: 0,
      [REPORT_SUBJECT.TRIPLE_BUFFED]: 0,
      [REPORT_SUBJECT.DOUBLE_BUFFED]: 0,
      [REPORT_SUBJECT.UNBUFFED_ACTIVE_CHUNK]: 0, // %
      [REPORT_SUBJECT.MOVE_DURATION]: 0, // sec
      [REPORT_SUBJECT.MOVE_RATIO]: 0, // %
    },
    buildings: {},
  };
  let totalActiveChunks = 0,
    farmCount = 0,
    totalWorkTime = 0,
    totalMoveTime = 0;

  let moveSpeed = villagerSpeed(
    techState[TECH.WHEELBARROW],
    techState[TECH.DYNASTY]
  );

  Object.keys(tracker).forEach((uuid) => {
    let { kind } = atlas[uuid];
    report.buildings[uuid] = {};
    let {
      chunkBuffs,
      // dropper,
      buffedBy,
      period,
      distance,
      efficiency,
      activeChunks,

      droppingOffs,
      buffing,
    } = tracker[uuid];

    let buildingReport = {};

    switch (kind) {
      case BUILDING.FARM:
        farmCount++;
        let moveDuration = distance / moveSpeed;
        buildingReport[REPORT_SUBJECT.GATHER_RATE] = efficiency;
        buildingReport[REPORT_SUBJECT.TOP_STACKS] = Math.max(...chunkBuffs);
        buildingReport[REPORT_SUBJECT.TOTAL_MOVE_DISTANCE] = distance;
        buildingReport[REPORT_SUBJECT.PERIOD] = period;
        buildingReport[REPORT_SUBJECT.MOVE_DURATION] = moveDuration;
        buildingReport[REPORT_SUBJECT.MOVE_RATIO] =
          (moveDuration / period) * 100;
        buildingReport[REPORT_SUBJECT.ACTIVE_CHUNKS] = activeChunks.length;
        buildingReport[REPORT_SUBJECT.BUFFED_ACTIVE_CHUNK] = 0;
        buffedBy.forEach((granaryList, i) => {
          if (
            granaryList.length &&
            activeChunks.find(({ index }) => index === i)
          ) {
            buildingReport[REPORT_SUBJECT.BUFFED_ACTIVE_CHUNK]++;
            if (granaryList.length === 2)
              report.overview[REPORT_SUBJECT.DOUBLE_BUFFED]++;
            if (granaryList.length > 2)
              report.overview[REPORT_SUBJECT.TRIPLE_BUFFED]++;
          }
        });
        totalActiveChunks += activeChunks.length;
        totalWorkTime += period;
        totalMoveTime += moveDuration;
        report.overview[REPORT_SUBJECT.TOTAL_RATE] += efficiency;
        report.overview[REPORT_SUBJECT.CHUNKS_BUFFED] +=
          buildingReport[REPORT_SUBJECT.BUFFED_ACTIVE_CHUNK];
        break;
      case BUILDING.GRANARY:
        let buffCount = 0;
        let usefulBuffCount = 0;
        buffing.forEach((farmUuid) => {
          tracker[farmUuid].buffedBy.forEach((granaryList, i) => {
            if (granaryList.includes(uuid)) {
              buffCount++;
              if (
                tracker[farmUuid].activeChunks.find(({ index }) => index === i)
              )
                usefulBuffCount++;
            }
          });
        });
        buildingReport[REPORT_SUBJECT.BUFFED_FARM_COUNT] = buffing.length;
        buildingReport[REPORT_SUBJECT.BUFFED_CHUNK_COUNT] = buffCount;
        buildingReport[REPORT_SUBJECT.BUFFED_ACTIVE_CHUNK] = usefulBuffCount;
      case BUILDING.MILL:
      case BUILDING.GRANARY:
        let totalDropOffChunks = 0,
          totalDistance = 0;
        let totalDropOffDistance = droppingOffs.reduce((acc, uuid) => {
          acc += tracker[uuid].activeChunks.reduce(
            (accu, { dropOffDistance }) => {
              accu += dropOffDistance;
              return accu;
            },
            0
          );
          totalDistance += tracker[uuid].distance;
          totalDropOffChunks += tracker[uuid].activeChunks.length;
          return acc;
        }, 0);
        buildingReport[REPORT_SUBJECT.FARM_DROP_COUNT] = droppingOffs.length;
        buildingReport[REPORT_SUBJECT.AVERAGE_DROPOFF_DISTANCE] =
          totalDropOffDistance / totalDropOffChunks;
        buildingReport[REPORT_SUBJECT.AVERAGE_MOVE_DURATION] =
          totalDistance / droppingOffs.length / moveSpeed;
        break;
    }
    report.buildings[uuid] = buildingReport;
  });
  report.overview[REPORT_SUBJECT.AVERAGE_RATE] =
    report.overview[REPORT_SUBJECT.TOTAL_RATE] / farmCount;
  report.overview[REPORT_SUBJECT.UNBUFFED_ACTIVE_CHUNK] =
    (1 - report.overview[REPORT_SUBJECT.CHUNKS_BUFFED] / totalActiveChunks) *
    100;
  report.overview[REPORT_SUBJECT.AVERAGE_MOVE_DURATION] =
    totalMoveTime / farmCount;
  report.overview[REPORT_SUBJECT.AVERAGE_MOVE_RATIO] =
    (totalMoveTime / totalWorkTime) * 100;
  report.overview[REPORT_SUBJECT.TOTAL_RATE] *= 60;
  return report;
};
// export const generateInsight = (atlas) => {};
export const farmReportToTotalPrecastDuration = (report) =>
  ASSUMPTION.GATHER_WINDUP_DURATION * report[REPORT_SUBJECT.ACTIVE_CHUNKS];
export const farmReportToTotalGatherDuration = (report) =>
  report[REPORT_SUBJECT.PERIOD] -
  report[REPORT_SUBJECT.MOVE_DURATION] -
  ASSUMPTION.GATHER_WINDUP_DURATION * report[REPORT_SUBJECT.ACTIVE_CHUNKS] -
  ASSUMPTION.RESOURCE_DROPOFF_DURATION;

export const autoFillAvailable = (atlas) => {
  let buildings = Object.values(atlas);
  if (!buildings.length) return false;

  const parity = ({ x, y }) => Math.abs(x % 2) * 2 + Math.abs(y % 2);
  let parity0 = parity(buildings[0].coord);
  for (let i = 1; i < buildings.length; i++)
    if (
      parity(buildings[i].coord) !== parity0 ||
      (buildings[i].kind === BUILDING.OTHER &&
        (buildings[i].mods?.size?.x % 2 || buildings[i].mods?.size?.y % 2))
    )
      return false;
  return true;
};
export const autoFill = (atlas) => {
  // NOTE: this function only supports starting patterns with all buildings in same parity,
  // and it's only checking if the center in granary range,
  // since false cases are mathematically impossible for current radius value.
  // also assuming no 1x1 buildings
  let newFarmCoords = [];
  let granaries = [];
  let occupiedMap = Object.values(atlas).reduce(
    (acc, { kind, coord, mods }) => {
      if (kind === BUILDING.GRANARY) granaries.push(coord);

      let { x, y } = coord;
      let size = BUILDING_SIZE[kind] || mods?.size?.x || mods?.size?.y;
      // other building size consider
      for (let i = 0; i < size; i += RULE.MIN_BUILDING_SIZE)
        for (let j = 0; j < size; j += RULE.MIN_BUILDING_SIZE)
          acc[`${x + i},${y + j}`] = true;
      return acc;
    },
    {}
  );
  granaries.forEach(({ x, y }) => {
    // this part could actually be hard coded
    for (
      let i = x - 3 * RULE.MIN_BUILDING_SIZE;
      i < x + BUILDING_SIZE[BUILDING.GRANARY] + 3 * RULE.MIN_BUILDING_SIZE;
      i += 2
    )
      for (
        let j = y - 3 * RULE.MIN_BUILDING_SIZE;
        j < y + BUILDING_SIZE[BUILDING.GRANARY] + 3 * RULE.MIN_BUILDING_SIZE;
        j += 2
      )
        if (
          (i +
            BUILDING_SIZE[BUILDING.FARM] / 2 -
            x -
            BUILDING_SIZE[BUILDING.GRANARY] / 2) **
            2 +
            (j +
              BUILDING_SIZE[BUILDING.FARM] / 2 -
              y -
              BUILDING_SIZE[BUILDING.GRANARY] / 2) **
              2 <
            ASSUMPTION.GRANARY_AREA_RADIUS ** 2 &&
          !occupiedMap[`${i},${j}`]
        ) {
          newFarmCoords.push({ x: i, y: j });
          occupiedMap[`${i},${j}`] = true;
        }
  });
  return newFarmCoords;
};

export const reportSubjectToUnit = (subject) => {
  switch (subject) {
    case REPORT_SUBJECT.AVERAGE_MOVE_DURATION:
    case REPORT_SUBJECT.PERIOD:
    case REPORT_SUBJECT.MOVE_DURATION:
      return DATA_UNIT.SECOND;

    case REPORT_SUBJECT.AVERAGE_RATE:
    case REPORT_SUBJECT.GATHER_RATE:
      return DATA_UNIT.PER_SECOND;

    case REPORT_SUBJECT.TOTAL_RATE:
      return DATA_UNIT.PER_MINUTE;

    case REPORT_SUBJECT.UNBUFFED_ACTIVE_CHUNK:
    case REPORT_SUBJECT.AVERAGE_MOVE_RATIO:
    case REPORT_SUBJECT.MOVE_RATIO:
      return DATA_UNIT.PERCENTAGE;

    case REPORT_SUBJECT.CHUNKS_BUFFED:
    case REPORT_SUBJECT.TRIPLE_BUFFED:
    case REPORT_SUBJECT.DOUBLE_BUFFED:
      return DATA_UNIT.CHUNK;

    case REPORT_SUBJECT.AVERAGE_DROPOFF_DISTANCE:
    case REPORT_SUBJECT.TOTAL_MOVE_DISTANCE:
      return DATA_UNIT.TILE;

    case REPORT_SUBJECT.FARM_DROP_COUNT:
      return DATA_UNIT.FARM;

    default:
    case REPORT_SUBJECT.BUFFED_FARM_COUNT:
    case REPORT_SUBJECT.BUFFED_CHUNK_COUNT:
    case REPORT_SUBJECT.BUFFED_ACTIVE_CHUNK:
    case REPORT_SUBJECT.TOP_STACKS:
    case REPORT_SUBJECT.ACTIVE_CHUNKS:
      return DATA_UNIT.NONE;
  }
};

export const reportSubjectDecimaling = (subject) => {
  switch (subject) {
    case REPORT_SUBJECT.TOTAL_RATE:
      return 2;
    case REPORT_SUBJECT.UNBUFFED_ACTIVE_CHUNK:
    case REPORT_SUBJECT.AVERAGE_MOVE_DURATION:
    case REPORT_SUBJECT.AVERAGE_MOVE_RATIO:
    case REPORT_SUBJECT.AVERAGE_DROPOFF_DISTANCE:
    case REPORT_SUBJECT.TOTAL_MOVE_DISTANCE:
    case REPORT_SUBJECT.PERIOD:
    case REPORT_SUBJECT.MOVE_DURATION:
    case REPORT_SUBJECT.MOVE_RATIO:
      return 3;
    case REPORT_SUBJECT.AVERAGE_RATE:
    case REPORT_SUBJECT.GATHER_RATE:
      return 5;
    default:
      return -1;
  }
};
