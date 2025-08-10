/**
 *
 * @param row = the minecraft command to be highlighted
 * @returns {string} with all <span> elements to highlight the command for your webside
 */

function mclangHighlight(row) {
  let replacement = row.replace(/"/g, '<span class="string">"</span>');;

  const searchTermAllKeywords = ["advancement", "attribute", "ban", "ban-ip", "banlist", "bossbar", "clear", "clone", "damage", "data", "datapack", "debug", "defaultgamemode", "deop", "dialog", "difficulty", "effect", "enchant", "execute", "experience", "fill", "fillbiome", "forceload", "function", "gamemode", "gamerule", "give", "help", "item", "jfr", "kick", "kill", "list", "locate", "loot", "me", "msg", "op", "pardon", "pardon-ip", "particle", "perf", "place", "playsound", "publish", "random", "recipe", "reload", "return", "ride", "rotate", "save-all", "save-off", "save-on", "say", "schedule", "scoreboard", "seed", "setblock", "setidletimeout", "setworldspawn", "spawnpoint", "spectate", "spreadplayers", "stop", "stopsound", "summon", "tag", "team", "teammsg", "teleport", "tell", "tellraw", "test", "tick", "time", "title", "tm", "tp", "transfer", "trigger", "version", "w", "waypoint", "weather", "whitelist", "worldborder", "xp"]
  let searchTermKeywords = [];
  const searchTermSelectors = ["@p", "@a", "@r", "@s", "@e", "@n"];
  const selectorProperties = ["scores=", "nbt=", "type=", "tag=", "name=", "advancements=", "distance=", "dx=", "dy=", "dz=", "gamemode=", "level=", "limit=", "predicate=", "sort=", "team=", "x=", "y=", "z=", "x_rotation=", "y_rotation="];
  const selectorX = new Array(",");
  const searchTermCurlyBrackets = ["{", "}"];
  let isScores;
  const searchTermStop = [",", "}", "\"", "]"];
  const searchTermNumber = [".", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  // select existing keywords
  for (let i = 0; i < searchTermAllKeywords.length; i++) {
    const keyword = searchTermAllKeywords[i];
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi'); // 단어 경계 포함

    if (regex.test(row)) {
      searchTermKeywords.push(keyword);
    }
  }


  if (replacement == "\n" || replacement == "") {
    replacement = "<span style=\"visibility: hidden;\">empty</span>";
  } else if (row.startsWith("#")) { // comment gray
    replacement = "<span class=\"comment\">" + replacement + "</span>";
  } else {
    // highlight selectors
    for (let j = 0; j < searchTermSelectors.length; j++) {
      replacement = replacement.replace(new RegExp(searchTermSelectors[j], "gi"), "<span class=\"selector\">" + searchTermSelectors[j] + "</span>")

      let startpos = row.indexOf(searchTermSelectors[j] + "[");
      while (startpos > -1) {
        // Endpos
        let loopEnd = row.length;
        let br = 0;

        for (let u = startpos; u < loopEnd; u++) {
          if (row.charAt(u) === "[") {
            br += 1;
          }
          if (row.charAt(u) === "]") {
            br -= 1;
            if (br === 0) {
              loopEnd = 0;
              endpos = u;
            }
          }
        }
        // copy selector properties
        const section = row.slice(startpos + 3, endpos);
        let newInset = "";

        for (let y = 0; y < section.length; y++) {
          for (let z = 0; z < selectorProperties.length; z++) { // search for selectorProperties at this index
            if (section.indexOf(selectorProperties[z], y) === y) {
              newInset += "<span class=\"selectorProperties\">" + selectorProperties[z] + "</span>";
              y += selectorProperties[z].length;
              isScores = false;
              if (selectorProperties[z] === "scores=") {
                isScores = true;
              }
            }
          }
          if (section.indexOf("!", y) === y) { // search !
            newInset += "<span class=\"not\">!</span>";
          } else if (section.indexOf("#minecraft:", y) === y) { // search #minecraft:
            newInset += "<span class=\"minecraft\">#minecraft:</span>";
            y += 10;
          } else if (section.indexOf("minecraft:", y) === y) { // search minecraft:
            newInset += "<span class=\"minecraft\">minecraft:</span>";
            y += 9;
          } else if (section.indexOf("{", y) === y) { // skip brackets
            let bs = 0;
            for (let u = y; u < section.length; u++) {
              if (section.charAt(u) === "{") {
                bs += 1;
              }
              if (section.charAt(u) === "}") {
                bs -= 1;
                if (bs === 0) {
                  u++;
                  // replace all numbers in scores={}
                  if (isScores) {

                    const kf = section.indexOf("=", y);
                    if (kf < u + 1 && kf !== -1) {

                      for (w1 = y; w1 < u + 1; w1++) {
                        w1 = section.indexOf("=", w1)
                        if (w1 < u + 1 && w1 !== -1) {
                          // searching for endpos
                          arrayEnd = [];

                          for (let kr = 0; kr < searchTermStop.length; kr++) {
                            if (section.indexOf(searchTermStop[kr], w1) !== -1) {
                              arrayEnd[arrayEnd.length] = section.indexOf(searchTermStop[kr], w1);
                            }
                          }
                          arrayEnd = Math.min(...arrayEnd);

                          newInset += "<span class=\"var\">" + section.slice(y, w1 + 1) + "</span>";
                          y = arrayEnd;
                          newInset += "<span class=\"number\">" + section.slice(w1 + 1, arrayEnd) + "</span>";

                        } else { // end loop if no more = characters find
                          w1 = u + 1;
                          newInset += section.slice(arrayEnd, arrayEnd + 2);
                        }
                      }
                    }
                  } else {
                    newInset += "<span class=\"var\">" + section.slice(y, u + 1) + "</span>";
                  }
                  y = u;
                  break;
                }
              }
            }
          } else { // Copy variables up to the end of a comma or parenthesis
            const fs1 = section.indexOf(",", y);
            if (fs1 >= 0) { // continue if , find
              // if the variable is a number, color it differently
              var fg = section.slice(y, fs1);
              var fgl = 0;
              for (let c = 0; c < fg.length; c++) {
                for (let m = 0; m < searchTermNumber.length; m++) {
                  if (searchTermNumber[m] === fg.charAt(c)) {
                    fgl += 1;
                  }
                }
              }
              if (fgl === fg.length) {
                newInset += "<span class=\"number\">" + section.slice(y, fs1 + 1) + "</span>";
                y += section.slice(y, fs1).length;
              } else {
                newInset += "<span class=\"var\">" + section.slice(y, fs1 + 1) + "</span>";
                y += section.slice(y, fs1).length;
              }
            } else {
              // if the variable is a number, color it differently
              fg = section.slice(y, section.length);
              fgl = 0;
              for (let s = 0; s < fg.length; s++) {
                for (let g = 0; g < searchTermNumber.length; g++) {
                  if (searchTermNumber[g] === fg.charAt(s)) {
                    fgl += 1;
                  }
                }
              }
              if (fgl === fg.length) {
                newInset += "<span class=\"number\">" + section.slice(y, section.length) + "</span>";
                y += section.slice(y, section.length).length;
              } else {
                newInset += "<span class=\"var\">" + section.slice(y, section.length) + "</span>";
                y += section.slice(y, section.length).length;
              }
            }
          }
        }

        for (let h = 0; h < selectorX.length; h++) {
          newInset = newInset.replace(new RegExp(selectorX[h], "gi"), "<span class=\"bracket\">" + selectorX[h] + "</span>");
        }
        startpos = row.indexOf(searchTermSelectors[j] + "[", endpos);
        replacement = replacement.replace(section, newInset);
      }
    }
    // general coloring of code parts
    let searchFunction = row.search("function ");
    if (searchFunction >= 0) {
      searchFunction = row.indexOf(" ", searchFunction);
      searchFunction = row.slice(searchFunction, row.length);
      replacement = replacement.replace(searchFunction, " <span class=\"function\">" + searchFunction + "</span>");
    }
    for (let j = 0; j < searchTermKeywords.length; j++) {
      if (replacement.indexOf(searchTermKeywords[j]) === 0) {
        replacement = replacement.replace(searchTermKeywords[j], '<span class="keyword">' + searchTermKeywords[j] + '</span>');
      }
      if (searchTermKeywords[j] === "execute ") {
        replacement = replacement.replace(new RegExp(" run " + searchTermKeywords[j], "gi"), " <span title=\"Useless\" class=\"light-error\">run execute</span> ");
      } else {
        replacement = replacement.replace(new RegExp(" run " + searchTermKeywords[j], "gi"), " run <span class=\"keyword\">" + searchTermKeywords[j] + "</span>");
      }
    }

    for (let j = 0; j < searchTermCurlyBrackets.length; j++) {
      replacement = replacement.replace(new RegExp(searchTermCurlyBrackets[j], "gi"), "<span class=\"bracket\">" + searchTermCurlyBrackets[j] + "</span>");
    }

    replacement = replacement.replace(new RegExp("\\[", "gi"), "<span class=\"bracket\">[</span>");
    replacement = replacement.replace(new RegExp("\\]", "gi"), "<span class=\"bracket\">]</span>");
  }

  return replacement;
}
