import { TILES } from './TileSet';

export const TILE_SIZE = 64;

// --- Short Aliases for Layout ---
const _ = -1; // VOID

// Floors
const F = TILES.FLOOR_MIDDLEMIDDLE;
const F_C = TILES.FLOOR_MIDDLEMIDDLE_CRACKED;
const F_V1 = TILES.FlOOR_VENT1;
const F_V2 = TILES.FLOOR_VENT2;
const F_Warn = TILES.FLOOR_CAUTION;

// Walls
const W_TL = TILES.WALL_TOPLEFTCORNER;
const W_TM = TILES.WALL_TOPMIDDLE;
const W_TR = TILES.WALL_TOPRIGHTCORNER;
const W_ML = TILES.WALL_MIDDLELEFT;
const W_MR = TILES.WALL_MIDDLERIGHT;
const W_BL = TILES.WALL_BOTTOMLEFTCORNER;
const W_BM = TILES.WALL_BOTTOMMIDDLE;
const W_BR = TILES.WALL_BOTTOMRIGHTCORNER;

// Objects (Furniture)
const O_Rub1 = TILES.RUBBLES_1;

// Special
const D = 99; // DOOR (Custom ID)

export const LEVEL_LAYOUT = [
    // -----------------------------------------------------------------------------------------
    // ROW 0-5: DATABASE ROOM (Top Left) - Expanded & Cracked | ROW 0-5: VOID (Right)
    // -----------------------------------------------------------------------------------------
    [_, _, W_TL, W_TM, W_TM, W_TM, W_TM, W_TM, W_TR, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, W_ML, F, F, F, F, F, W_MR, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, W_ML, F, F, F, F, F_C, W_MR, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, W_ML, F, F_C, F, F, F, W_MR, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, W_ML, F, F, F_V1, F, O_Rub1, W_MR, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, W_BL, W_BM, F, F, W_BM, W_BM, W_BR, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],

    // -----------------------------------------------------------------------------------------
    // ROW 6-8: HALLWAY (Connecting DB to Hub) | ROW 6-8: VOID (Right)
    // -----------------------------------------------------------------------------------------
    [_, _, _, _, W_ML, F, W_MR, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, W_ML, F_Warn, W_MR, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, W_ML, F, W_MR, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],

    // -----------------------------------------------------------------------------------------
    // ROW 9-15: CENTRAL HUB (Left) --[DOOR]-- MEETING ROOM (Right)
    // -----------------------------------------------------------------------------------------
    // Hub is approx 9 wide (Indices 1-11). Meeting room starts at Index 13.
    // Connection at Row 12.
    [_, W_TL, W_TM, W_TM, W_BR, F, W_BL, W_TM, W_TM, W_TM, W_TM, W_TR, _, W_TL, W_TM, W_TM, W_TM, W_TM, W_TM, W_TM, W_TM, W_TR, _, _, _, _],
    [_, W_ML, F, F, F, F, F, F, F, F, F, W_MR, _, W_ML, F, F, F, F, F, F, F, W_MR, _, _, _, _],
    [_, W_ML, F, F, F, F, F_V2, F, F_C, F, F, W_MR, _, W_ML, F, F, F, F, F, F, F, W_MR, _, _, _, _],
    [_, W_ML, F, F, F, F, F, F, F, F, F, D, D, W_ML, F, F, F, F, F, F, F, W_MR, _, _, _, _], // <-- Door (Double width)
    [_, W_ML, F, F, F, F, F, F, F, F, F, W_MR, _, W_ML, F, F, F, F, F, F, F, W_MR, _, _, _, _],
    [_, W_ML, F, F, F_C, F, F, F, F, F, F, W_MR, _, W_ML, F, F, F, F, F, F, F, W_MR, _, _, _, _],
    [_, W_BL, W_BM, W_BM, W_BM, F, F, W_BM, W_BM, W_BM, W_BM, W_BR, _, W_BL, W_BM, W_BM, W_BM, W_BM, W_BM, W_BM, W_BM, W_BR, _, _, _, _],

    // -----------------------------------------------------------------------------------------
    // ROW 16-18: LOWER CORRIDOR (To API Room) | ROW 16-18: VOID (Right)
    // -----------------------------------------------------------------------------------------
    [_, _, _, _, _, W_ML, F, W_MR, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, W_ML, F, W_MR, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, W_ML, F, W_MR, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],

    // -----------------------------------------------------------------------------------------
    // ROW 19-23: API ROOM (Bottom) | ROW 19-23: VOID (Right)
    // -----------------------------------------------------------------------------------------
    [_, _, _, _, W_TL, W_TM, F, W_TM, W_TR, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, W_ML, F, F, F, W_MR, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, W_ML, F, F_C, F, W_MR, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, W_ML, F, F, F, W_MR, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, W_BL, W_BM, W_BM, W_BM, W_BR, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
];