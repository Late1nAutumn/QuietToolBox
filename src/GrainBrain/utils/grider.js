import { AUTO_CAMERA_PADDING, AUTO_ZOOM_LIMIT, ZOOM_LIMIT } from "./constants";
import { randomUUID } from "../../utils/functions";

export default class Grider {
  constructor(roster, atlas) {
    this.roster = roster;
    // {
    //   [kind]: {
    //     types: [],
    //     atrributes: {},
    //     size: { x, y },
    //   },
    // };
    this.atlas = atlas;
    // {
    //   1: {
    //     uuid: 1,
    //     kind: BUILDING.FARM,
    //     coord: { x: 2, y: 3 },
    //     mods:{},
    //   },
    // };
    this.camera = {
      zoom: 40, // pixel per grid
      x: 0, // left
      y: 0, // top
    };
    this.newObject = null;
    this.invalidCoords = [];
  }

  // #region data
  startAddingObject(kind, mods, coordX, coordY) {
    this.newObject = {
      uuid: randomUUID(),
      kind,
      coord: { x: 0, y: 0 },
      mods,
    };
    return this.moveNewObject(coordX, coordY);
  }
  moveNewObject(x, y) {
    this.newObject.coord = { x, y };
    this.invalidCoords = this.newObjectCollisionCheck();
    return this.mapAtlasDataToDisplayable(this.newObject);
  }
  newObjectCollisionCheck() {
    let rects = [];
    let zoom = this.camera.zoom;
    Object.values(this.atlas).forEach(({ kind, coord, mods }) => {
      let x1 = this.newObject.coord.x,
        y1 = this.newObject.coord.y,
        x2 = coord.x,
        y2 = coord.y,
        size1 =
          this.roster[this.newObject.kind].size || this.newObject.mods.size,
        size2 = this.roster[kind].size || mods.size;
      let leftBound = Math.max(x1, x2),
        rightBound = Math.min(x1 + size1.x, x2 + size2.x),
        topBound = Math.max(y1, y2),
        bottomBound = Math.min(y1 + size1.y, y2 + size2.y);
      if (leftBound < rightBound && topBound < bottomBound)
        rects.push({
          top: topBound * zoom - this.camera.y,
          left: leftBound * zoom - this.camera.x,
          width: (rightBound - leftBound) * zoom,
          height: (bottomBound - topBound) * zoom,
        });
    });
    return rects;
  }
  confirmAddingObject(successCB, failureCB) {
    if (this.invalidCoords.length) {
      return failureCB(this.invalidCoords);
    }
    this.atlas[this.newObject.uuid] = this.newObject;
    this.newObject = null;
    this.invalidCoords = [];
    successCB();
  }
  cancelAddingObject() {
    this.newObject = null;
    this.invalidCoords = [];
  }
  deleteObject(uuid) {
    delete this.atlas[uuid];
  }
  removeAllObject() {
    this.atlas = {};
  }

  batchNewObjectByCoord(kind, mods, list) {
    list.forEach((coord) => {
      let uuid = randomUUID();
      this.atlas[uuid] = {
        uuid,
        kind,
        coord,
        mods,
      };
    });
  }

  getObjectCountByKind(targetKind) {
    return Object.values(this.atlas).reduce((acc, { kind }) => {
      if (targetKind === kind) acc++;
      return acc;
    }, 0);
  }
  // #endregion

  // #region visual
  zoomCamera(d, mouseX, mouseY, callback) {
    let newZoom = this.camera.zoom * d;
    if (newZoom <= ZOOM_LIMIT) return;
    let ratio = newZoom / this.camera.zoom;
    this.camera = {
      zoom: newZoom,
      x: (this.camera.x + mouseX) * ratio - mouseX,
      y: (this.camera.y + mouseY) * ratio - mouseY,
    };
    callback(this.camera.zoom);
  }
  moveCamera(dx, dy, callback) {
    this.camera.x -= dx;
    this.camera.y -= dy;
    callback({ x: this.camera.x, y: this.camera.y });
  }
  autoCamera(top, left, height, width) {
    let objectList = Object.values(this.atlas);
    if (!objectList.length) {
      this.camera = { zoom: AUTO_ZOOM_LIMIT, x: 0, y: 0 };
      return;
    }
    let leftBound = Infinity,
      topBound = Infinity,
      rightBound = -Infinity,
      bottomBound = -Infinity;
    objectList.forEach(({ kind, coord, mods }) => {
      leftBound = Math.min(leftBound, coord.x);
      topBound = Math.min(topBound, coord.y);
      rightBound = Math.max(
        rightBound,
        coord.x + (this.roster[kind]?.size?.x || mods?.size?.x)
      );
      bottomBound = Math.max(
        bottomBound,
        coord.y + (this.roster[kind]?.size?.y || mods?.size?.y)
      );
    });
    let cols = rightBound - leftBound,
      rows = bottomBound - topBound;
    let zoom = Math.min(
      (width / cols) * (1 - 2 * AUTO_CAMERA_PADDING),
      (height / rows) * (1 - 2 * AUTO_CAMERA_PADDING)
    );
    zoom = Math.min(zoom, AUTO_ZOOM_LIMIT);
    zoom = Math.max(zoom, ZOOM_LIMIT);
    this.camera = {
      zoom,
      x: (leftBound + cols / 2) * zoom - left - width / 2,
      y: (topBound + rows / 2) * zoom - top - height / 2,
    };
  }

  getCoordByPosition(px, py) {
    let { x, y, zoom } = this.camera;
    return { x: (x + px) / zoom, y: (y + py) / zoom };
  }
  getGridLineOffset() {
    let { x, y, zoom } = this.camera;
    return { x: (x % zoom) * -1, y: (y % zoom) * -1 };
  }
  getVisibleObjectList(innerWidth, innerHeight) {
    let vision = [];
    Object.values(this.atlas).map((obj) => {
      vision.push(this.mapAtlasDataToDisplayable(obj));
    });
    return vision;
  }
  // #endregion

  // #region private
  mapAtlasDataToDisplayable({ uuid, kind, coord, mods }) {
    let zoom = this.camera.zoom;
    let position = {
      left: coord.x * zoom - this.camera.x,
      top: coord.y * zoom - this.camera.y,
    };
    let size = this.roster[kind].size || mods.size;
    return {
      uuid,
      kind,
      position,
      area: { x: size.x * zoom, y: size.y * zoom },
      mods,
      coord,
      size, // for matched icons
    };
  }
  // #endregion
}
