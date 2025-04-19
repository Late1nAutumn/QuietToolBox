# Nikki Kiwi
- Data source: https://docs.google.com/spreadsheets/d/1Q5yjX8roIyIRvaddOEI24hEBq4JZtSQ-7x61rFvyrds
## Assuming:
### Game data logic
- Items won't have duplicated tags
- Items only have one main stat
- Player have all bonus specs
- Item stat greater than 0
- Compendium pages won't have 99+ sub pages
- Set names never include `(`
### OG raw data
- Item set always end with ` (n)`
- Set evolutions are not included

## Check list
- Cursor style check
- Translation check
- Clear unused imports
- Button trigger area & pointer style in `<label/>`

## More to update:
### Feature
- Best items in slot
- Local stored plan
- Limit up to 5 accessories in score simulation
### Data
- Compendium data for spare items
- Translate obtain info
### Fix
- Filters (especially range input limits) are not updated when config is changed
