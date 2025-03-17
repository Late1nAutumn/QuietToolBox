export function mapSetToCompendium(setName) {
  switch (setName) {
    case "A Beautiful Day":
      return [5, 2];
    case "Afternoon Shine":
      return [4, 4];
    case "Bibcoon Realm":
      return [4, 4];
    case "Blooming Dreams":
      return [8, 1];
    case "Blossoming Stars":
      return [7, 3];
    case "Breezy Tea Time":
      return [4, 4];
    case "Bright Days":
      return [4, 4];
    case "Bubbly Voyage":
      return [7, 3];
    case "Bye-Bye Dust":
      return [4, 4];
    case "Carefree Moments":
      return [7, 3];
    case "Carnival Ode":
      return [7, 3];
    case "Chic Elegance":
      return [5, 1];
    case "Cozy Adventure":
      return [4, 4];
    case "Crystal Poems":
      return [8, 1];
    case "Dance Till Dawn":
      return [1, 3];
    case "Daughter of the Lake":
      return [4, 4];
    case "Departing Blossom":
      return [5, 2];
    case "Dreamy Glitter":
      return [4, 4];
    case "Endless Longing":
      return [7, 3];
    case "Enduring Bond":
      return [7, 3];
    case "Fairytale Swan":
      return [8, 1];
    case "Far and Away":
      return [1, 2];
    case "Fiery Glow":
      return [5, 4];
    case "First Love":
      return [7, 3];
    case "Floral Memory":
      return [7, 3];
    case "Flowing Colors":
      return [7, 3];
    case "Flutter Storm":
      return [7, 3];
    case "Forest's Fluttering":
      return [4, 4];
    case "Froggy Fashion":
      return [4, 4];
    case "Fully Charged":
      return [5, 4];
    case "Gleaming Dance":
      return [7, 3];
    case "Guard's Resolve":
      return [5, 4];
    case "Hometown Breeze":
      return [1, 3];
    case "Midnight Vigil":
      return [5, 4];
    case "Moment Capturer":
      return [7, 3];
    case "Monster Girl":
      return [4, 4];
    case "Moonlight Oath":
      return [8, 2];
    case "New Bloom Blessings":
      return [7, 3];
    case "New Year's Dawn":
      return [7, 3];
    case "Path of Starlight":
      return [7, 3];
    case "Pink Bunny":
      return [4, 4];
    case "Pink Ribbon Waltz":
      return [4, 4];
    case "Quirky Idea":
      return [4, 4];
    case "Radiant Night":
      return [7, 3];
    case "Rebirth Wish":
      return [1, 3];
    case "Refined Grace":
      return [5, 2];
    case "Rippling Serenity":
      return [4, 4];
    case "Scaly Dream":
      return [5, 2];
    case "Scarlet Dream":
      return [7, 3];
    case "School Days":
      return [5, 1];
    case "Searching for Dreams":
      return [5, 2];
    case "Shark Mirage":
      return [4, 4];
    case "Silvergale's Aria":
      return [1, 1];
    case "Snowy Encounter":
      return [8, 1];
    case "Snowy Fragrance":
      return [7, 3];
    case "Star of the Gala":
      return [7, 3];
    case "Stardust Flare":
      return [1, 2];
    case "Starfall Radiance":
      return [5, 3];
    case "Starlet Burst":
      return [3, 3];
    case "Starlit Celebration":
      return [7, 2];
    case "Starwish Echoes":
      return [1, 3];
    case "Sunlit Grasspom":
      return [4, 4];
    case "Sweet Honey":
      return [4, 4];
    case "Sweet Jazz Nights":
      return [4, 4];
    case "Symphony of Strings":
      return [7, 3];
    case "Timeless Echo":
      return [7, 3];
    case "Unseen Entity":
      return [5, 2];
    case "Whimsical Picnic":
      return [7, 3];
    case "Whispers of Waves":
      return [7, 3];
    case "Wind of Purity":
      return [4, 4];
    case "Wings of Wishes":
      return [7, 3];
    case "Wishful Aurosa":
      return [1, 1];
    case "Woolfruit Siesta":
      return [4, 4];
    default:
      console.log(`[WARNING]: Compendium data missing for set [${setName}]`);
      return [0, 0];
  }
}
