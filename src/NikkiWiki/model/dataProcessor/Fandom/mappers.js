// import { sort } from "../../utils";
// export const toExcelTableString = (data) => {
//   let str = "";
//   let temp = sort(data, "position");
//   temp = sort(data, "style");
//   temp = sort(data, "set");
//   temp = sort(data, "quality", 1);
//   temp
//     .map(
//       ({
//         itemName,
//         itemChineseName,
//         position,
//         set,
//         quality,
//         style,
//         lv0,
//         lv10,
//         lv11,
//         labels,
//       }) =>
//         `${itemName}\t${itemChineseName}\t${quality}\t${style}\t${
//           set || ""
//         }\t${position}\t${lv0}\t${lv10}\t${lv11}\t${labels.join(", ")}`
//     )
//     .forEach((s) => {
//       str += s;
//       str += "\n";
//     });
//   return str;
// };

// export const processSetInfo = (data) => {
//   let collection = {};
//   data.forEach(
//     ({
//       itemName,
//       itemChineseName,
//       position,
//       set,
//       quality,
//       style,
//       lv0,
//       lv10,
//       lv11,
//       labels,
//     }) => {
//       if (!set) return;
//       if (collection[set] === undefined) collection[set] = { quality, style };
//       collection[set][position] = lv11;
//     }
//   );
//   let output = "";
//   for (let temp in collection) {
//     let {
//       quality,
//       style,
//       Hair,
//       Dresses,
//       Outerwear,
//       Tops,
//       Bottoms,
//       Socks,
//       Shoes,
//       Headwear,
//       Earrings,
//       Neckwear,
//       Bracelets,
//       Chokers,
//       Gloves,
//       Pendants,
//       Backpieces,
//       Rings,
//       Handhelds,
//     } = collection[temp];
//     let HairA = collection[temp]["Hair Accessories"];
//     let FaceD = collection[temp]["Face Decorations"];
//     let ChectA = collection[temp]["Chest Accessories"];
//     let ArmD = collection[temp]["Arm Decorations"];
//     output += `${temp}\t${quality}\t${style}\t${Hair || ""}\t${
//       Dresses || ""
//     }\t${Outerwear || ""}\t${Tops || ""}\t${Bottoms || ""}\t${Socks || ""}\t${
//       Shoes || ""
//     }\t${HairA || ""}\t${Headwear || ""}\t${Earrings || ""}\t${
//       Neckwear || ""
//     }\t${Bracelets || ""}\t${Chokers || ""}\t${Gloves || ""}\t${FaceD || ""}\t${
//       ChectA || ""
//     }\t${Pendants || ""}\t${Backpieces || ""}\t${Rings || ""}\t${ArmD || ""}\t${
//       Handhelds || ""
//     }\n`;
//   }
//   return output;
// };

// export const processSpareInfo = (data) => {
//   return data;
// };
// export const filter = (data, conditions = []) => {
//   return data;
// };

// export function toChineseNameList(data) {
//   let temp = {};
//   data.forEach(({ itemName, itemChineseName }) => {
//     if (itemChineseName) temp[itemName] = itemChineseName;
//   });
//   return temp;
// }
