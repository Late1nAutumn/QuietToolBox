export const sortByProperty = (arr, property, reverse) => {
    let temp = arr.slice();
    for (let i = 0; i < arr.length - 1; i++)
      for (let j = i + 1; j < arr.length; j++) {
        if (!reverse) {
          if (arr[i][property] > arr[j][property]) {
            let temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
          }
        } else if (arr[i][property] < arr[j][property]) {
          let temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
        }
      }
    return temp;
  };
  